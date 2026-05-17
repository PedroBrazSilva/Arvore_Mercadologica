/**
 * Controller de Departamentos
 * 
 * Centraliza toda a lógica de negócio para departamentos
 */

const pool = require('../db');

class DepartamentoController {
  /**
   * Criar novo departamento (raiz)
   * Body: { nome, descricao?, icone? }
   */
  static async criar(req, res) {
    try {
      const { nome, descricao, icone } = req.body;

      // Validação: nome é obrigatório
      if (!nome) {
        return res.status(400).json({ erro: 'Nome é obrigatório' });
      }

      // RN-02: Validação de extensão mínima (ao menos 4 caracteres)
      const normalizedForLength = nome.replace(/\s+/g, ' ').trim();
      if (normalizedForLength.length < 4) {
        return res.status(400).json({ erro: 'O nome deve possuir pelo menos 4 caracteres' });
      }

      // RN-01: Unicidade global de nome (ignora case e espaços)
      const compareKey = nome.replace(/\s+/g, '').toLowerCase();
      const [existing] = await pool.query(
        'SELECT id FROM categoria_no WHERE LOWER(REPLACE(nome, " ", "")) = ? LIMIT 1',
        [compareKey]
      );

      if (existing && existing.length > 0) {
        return res.status(409).json({ erro: 'Nome já existe (deve ser único na árvore)' });
      }

      // Insert no banco: adiciona novo departamento root (id_pai IS NULL)
      const [result] = await pool.query(
        'INSERT INTO categoria_no (nome, descricao, icone) VALUES (?, ?, ?)',
        [nome, descricao || '', icone || '']
      );

      // Retorna sucesso com ID do novo registro
      res.status(201).json({
        sucesso: true,
        mensagem: 'Departamento criado com sucesso',
        id: result.insertId,
        nome,
        descricao,
        icone
      });
    } catch (err) {
      console.error('Erro ao criar departamento:', err);
      res.status(500).json({ erro: 'Erro ao criar departamento' });
    }
  }

  /**
   * Obter todos os departamentos principais (sem pai)
   */
  static async obterTodos(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM categoria_no WHERE id_pai IS NULL ORDER BY nome');
      res.json({ sucesso: true, dados: rows });
    } catch (err) {
      console.error('Erro ao obter departamentos:', err);
      res.status(500).json({ erro: 'Erro ao obter departamentos' });
    }
  }

  /**
   * Obter departamento específico por ID
   */
  static async obterPorId(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM categoria_no WHERE id = ?', [id]);
      const departamento = rows[0] || null;

      if (!departamento) {
        return res.status(404).json({ erro: 'Departamento não encontrado' });
      }

      res.json({ sucesso: true, dados: departamento });
    } catch (err) {
      console.error('Erro ao obter departamento:', err);
      res.status(500).json({ erro: 'Erro ao obter departamento' });
    }
  }

  /**
   * Atualizar departamento existente
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

      // RN-01: Verificar unicidade global de nome, excluindo o próprio registro
      const compareKey = nome.replace(/\s+/g, '').toLowerCase();
      const [existing] = await pool.query(
        'SELECT id FROM categoria_no WHERE LOWER(REPLACE(nome, " ", "")) = ? AND id != ? LIMIT 1',
        [compareKey, id]
      );

      if (existing && existing.length > 0) {
        return res.status(409).json({ erro: 'Nome já existe (deve ser único na árvore)' });
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

      res.json({ sucesso: true, mensagem: 'Departamento atualizado com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar departamento:', err);
      res.status(500).json({ erro: 'Erro ao atualizar departamento' });
    }
  }

  /**
   * Deletar departamento
   */
  static async deletar(req, res) {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM categoria_no WHERE id = ?', [id]);
      res.json({ sucesso: true, mensagem: 'Departamento deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar departamento:', err);
      res.status(500).json({ erro: 'Erro ao deletar departamento' });
    }
  }
}

module.exports = DepartamentoController;
