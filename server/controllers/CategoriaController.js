/**
 * Controller de Categorias
 * 
 * Centraliza toda a lógica de negócio para categorias (nós filhos)
 */

const pool = require('../db');

class CategoriaController {
  /**
   * Obter categorias filhas por id_pai
   */
  static async obterPorPai(req, res) {
    try {
      const { id_pai } = req.query;

      // Validação: id_pai é obrigatório
      if (id_pai === undefined || id_pai === null) {
        return res.status(400).json({ erro: 'id_pai é obrigatório' });
      }

      // Query: seleciona categorias filhas do id_pai especificado
      const [rows] = await pool.query(
        'SELECT * FROM categoria_no WHERE id_pai = ? ORDER BY nome',
        [id_pai]
      );

      res.json({ sucesso: true, dados: rows });
    } catch (err) {
      console.error('Erro ao obter categorias:', err);
      res.status(500).json({ erro: 'Erro ao obter categorias' });
    }
  }

  /**
   * Obter categoria específica por ID
   */
  static async obterPorId(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM categoria_no WHERE id = ?', [id]);
      const categoria = rows[0] || null;

      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }

      res.json({ sucesso: true, dados: categoria });
    } catch (err) {
      console.error('Erro ao obter categoria:', err);
      res.status(500).json({ erro: 'Erro ao obter categoria' });
    }
  }

  /**
   * Criar nova categoria (nó filho)
   * Body: { nome, descricao?, icone?, id_pai }
   */
  static async criar(req, res) {
    try {
      const { nome, descricao, icone, id_pai } = req.body;

      // Validação: nome é obrigatório
      if (!nome) {
        return res.status(400).json({ erro: 'Nome é obrigatório' });
      }

      // Validação: id_pai é obrigatório (categoria filha deve ter pai)
      if (id_pai === undefined || id_pai === null) {
        return res.status(400).json({ erro: 'id_pai é obrigatório' });
      }

      // RN-02: Validação de extensão mínima (ao menos 4 caracteres, ignorando espaços extras)
      const normalizedForLength = nome.replace(/\s+/g, ' ').trim();
      if (normalizedForLength.length < 4) {
        return res.status(400).json({ erro: 'O nome deve possuir pelo menos 4 caracteres' });
      }

      // Verificar se o pai existe na tabela
      const [paiRows] = await pool.query(
        'SELECT id FROM categoria_no WHERE id = ? LIMIT 1',
        [id_pai]
      );
      if (!paiRows || paiRows.length === 0) {
        return res.status(400).json({ erro: 'Categoria pai não encontrada' });
      }

      // RN-01: Unicidade de nome entre irmãos (mesmo id_pai), ignorando case e espaços
      const compareKey = nome.replace(/\s+/g, '').toLowerCase();
      const [existing] = await pool.query(
        'SELECT id FROM categoria_no WHERE id_pai = ? AND LOWER(REPLACE(nome, " ", "")) = ? LIMIT 1',
        [id_pai, compareKey]
      );

      if (existing && existing.length > 0) {
        return res.status(409).json({ erro: 'Nome já existe entre as categorias do mesmo pai' });
      }

      // Insert no banco com id_pai informado
      const [result] = await pool.query(
        'INSERT INTO categoria_no (nome, descricao, icone, id_pai) VALUES (?, ?, ?, ?)',
        [nome, descricao || '', icone || '', id_pai]
      );

      // Retorna resposta conforme especificado
      res.status(201).json({
        sucesso: true,
        mensagem: 'Categoria criada com sucesso',
        id: result.insertId,
        nome,
        descricao: descricao || '',
        icone: icone || '',
        id_pai
      });
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
      res.status(500).json({ erro: 'Erro ao criar categoria' });
    }
  }

  /**
   * Atualizar categoria existente
   * Body: { nome, descricao?, icone?, ativo? }
   */
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, icone, ativo } = req.body;

      // Validação: nome é obrigatório
      if (!nome) {
        return res.status(400).json({ erro: 'Nome é obrigatório' });
      }

      // RN-02: Validação de extensão mínima (ao menos 4 caracteres)
      const normalizedForLength = nome.replace(/\s+/g, ' ').trim();
      if (normalizedForLength.length < 4) {
        return res.status(400).json({ erro: 'O nome deve possuir pelo menos 4 caracteres' });
      }

      // Obter informações da categoria atual (para saber o id_pai)
      const [catRows] = await pool.query(
        'SELECT id_pai FROM categoria_no WHERE id = ? LIMIT 1',
        [id]
      );
      if (!catRows || catRows.length === 0) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }

      const id_pai = catRows[0].id_pai;

      // RN-01: Verificar unicidade entre irmãos (mesmo id_pai), excluindo o próprio registro
      const compareKey = nome.replace(/\s+/g, '').toLowerCase();
      const [existing] = await pool.query(
        'SELECT id FROM categoria_no WHERE id_pai = ? AND LOWER(REPLACE(nome, " ", "")) = ? AND id != ? LIMIT 1',
        [id_pai, compareKey, id]
      );

      if (existing && existing.length > 0) {
        return res.status(409).json({ erro: 'Nome já existe entre as categorias do mesmo pai' });
      }

      // Preparar campos a atualizar
      let updateFields = ['nome = ?', 'descricao = ?'];
      let params = [nome, descricao || ''];

      if (icone !== undefined) {
        updateFields.push('icone = ?');
        params.push(icone || '');
      }

      if (ativo !== undefined) {
        updateFields.push('ativo = ?');
        params.push(ativo ? 1 : 0);

        // Se está desativando, desativar todos os filhos em cascata
        if (!ativo) {
          await pool.query(
            `UPDATE categoria_no SET ativo = 0 
             WHERE id IN (
               WITH RECURSIVE cte AS (
                 SELECT id FROM categoria_no WHERE id_pai = ?
                 UNION ALL
                 SELECT c.id FROM categoria_no c INNER JOIN cte ON c.id_pai = cte.id
               )
               SELECT id FROM cte
             ) OR id_pai = ?`,
            [id, id]
          );
        }
        // Se está ativando, ativar todos os filhos em cascata
        else {
          await pool.query(
            `UPDATE categoria_no SET ativo = 1 
             WHERE id IN (
               WITH RECURSIVE cte AS (
                 SELECT id FROM categoria_no WHERE id_pai = ?
                 UNION ALL
                 SELECT c.id FROM categoria_no c INNER JOIN cte ON c.id_pai = cte.id
               )
               SELECT id FROM cte
             ) OR id_pai = ?`,
            [id, id]
          );
        }
      }

      params.push(id);

      // Update: modifica registro existente
      await pool.query(
        `UPDATE categoria_no SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      res.json({ sucesso: true, mensagem: 'Categoria atualizada com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      res.status(500).json({ erro: 'Erro ao atualizar categoria' });
    }
  }
}

module.exports = CategoriaController;

