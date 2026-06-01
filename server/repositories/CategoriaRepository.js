/**
 * Repository de Categorias
 * 
 * Centraliza toda a lógica de acesso ao banco de dados para categorias.
 * Métodos reutilizáveis para CRUD e queries customizadas.
 */

const pool = require('../config/database');

class CategoriaRepository {
  /**
   * Obter categorias filhas de um id_pai
   */
  async findByIdPai(id_pai) {
    const [rows] = await pool.query(
      'SELECT * FROM categoria_no WHERE id_pai = ? ORDER BY nome',
      [id_pai]
    );
    return rows;
  }

  /**
   * Obter categoria específica por ID
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categoria_no WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Obter filhos de uma categoria
   */
  async findChildren(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categoria_no WHERE id_pai = ? ORDER BY nome',
      [id]
    );
    return rows;
  }

  /**
   * Verificar se pai existe
   */
  async parentExists(id_pai) {
    const [rows] = await pool.query(
      'SELECT id FROM categoria_no WHERE id = ? LIMIT 1',
      [id_pai]
    );
    return rows.length > 0;
  }

  /**
   * Criar nova categoria
   */
  async create({ nome, descricao, icone, id_pai }) {
    const [result] = await pool.query(
      'INSERT INTO categoria_no (nome, descricao, icone, id_pai) VALUES (?, ?, ?, ?)',
      [nome, descricao || '', icone || '', id_pai]
    );
    return { id: result.insertId, nome, descricao, icone, id_pai };
  }

  /**
   * Atualizar categoria
   */
  async update(id, { nome, descricao, icone, ativo }) {
    const updates = [];
    const params = [];

    if (nome !== undefined) {
      updates.push('nome = ?');
      params.push(nome);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(descricao);
    }
    if (icone !== undefined) {
      updates.push('icone = ?');
      params.push(icone);
    }
    if (ativo !== undefined) {
      updates.push('ativo = ?');
      params.push(ativo ? 1 : 0);
    }

    params.push(id);

    if (updates.length > 0) {
      await pool.query(
        `UPDATE categoria_no SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    return this.findById(id);
  }

  /**
   * Contar filhos de uma categoria (RN-10)
   */
  async countChildren(id) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM categoria_no WHERE id_pai = ?',
      [id]
    );
    return rows[0]?.count || 0;
  }

  /**
   * Deletar categoria
   */
  async delete(id) {
    await pool.query('DELETE FROM categoria_no WHERE id = ?', [id]);
    return true;
  }

  /**
   * Verificar se nome já existe entre categorias irmãs (mesmo id_pai)
   * Ignora case e espaços
   */
  async checkNomeExistsBySibling(nome, id_pai, excludeId = null) {
    const compareKey = nome.replace(/\s+/g, '').toLowerCase();
    let query = 'SELECT id FROM categoria_no WHERE id_pai = ? AND LOWER(REPLACE(nome, " ", "")) = ? LIMIT 1';
    let params = [id_pai, compareKey];

    if (excludeId) {
      query = 'SELECT id FROM categoria_no WHERE id_pai = ? AND LOWER(REPLACE(nome, " ", "")) = ? AND id != ? LIMIT 1';
      params = [id_pai, compareKey, excludeId];
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0;
  }

  /**
   * Atualizar status de uma categoria e todos os filhos em cascata
   * Usado para ativar/desativar uma categoria e sua árvore inteira
   */
  async updateStatusCascade(id, ativo) {
    // Atualizar a própria categoria
    await pool.query('UPDATE categoria_no SET ativo = ? WHERE id = ?', [ativo ? 1 : 0, id]);

    // Atualizar todos os filhos (recursivamente)
    await pool.query(
      `UPDATE categoria_no SET ativo = ? 
       WHERE id IN (
         WITH RECURSIVE cte AS (
           SELECT id FROM categoria_no WHERE id_pai = ?
           UNION ALL
           SELECT c.id FROM categoria_no c INNER JOIN cte ON c.id_pai = cte.id
         )
         SELECT id FROM cte
       )`,
      [ativo ? 1 : 0, id]
    );

    return true;
  }

  /**
   * Verificar se existe ciclo ao mover um nó para um novo pai
   * Um ciclo ocorre quando o novo pai é descendente do nó
   * Retorna: boolean (true = ciclo existe, false = sem ciclo)
   */
  async checkCycleExists(nodeId, potentialParentId) {
    // Se novo pai é null, não há ciclo
    if (!potentialParentId) {
      return false;
    }

    // Buscar todos os descendentes do nó usando CTE (recursão)
    const [rows] = await pool.query(
      `WITH RECURSIVE descendants AS (
         SELECT id FROM categoria_no WHERE id_pai = ?
         UNION ALL
         SELECT c.id FROM categoria_no c INNER JOIN descendants d ON c.id_pai = d.id
       )
       SELECT id FROM descendants WHERE id = ? LIMIT 1`,
      [nodeId, potentialParentId]
    );

    return rows.length > 0; // Se encontrou, é um descendente, portanto ciclo existe
  }

  /**
   * Atualizar o id_pai de uma categoria (movimentação)
   * Apenas atualiza o campo id_pai, não toca em outro
   */
  async updateParent(id, newIdPai) {
    const updateValue = newIdPai === null ? null : newIdPai;
    await pool.query('UPDATE categoria_no SET id_pai = ? WHERE id = ?', [updateValue, id]);
    return this.findById(id);
  }

  /**
   * Obter todas as opções de movimentação para uma categoria
   * Retorna a árvore completa EXCETO o nó sendo movido e seus descendentes
   * Formato: { id, nome, nivel, id_pai }
   * Ordenado hierarquicamente
   */
  async getMoveOptions(excludeId) {
    // Usar CTE para listar toda árvore, depois filtrar
    const [rows] = await pool.query(
      `WITH RECURSIVE tree AS (
         SELECT id, nome, id_pai, 0 as nivel FROM categoria_no WHERE id_pai IS NULL
         UNION ALL
         SELECT c.id, c.nome, c.id_pai, t.nivel + 1 
         FROM categoria_no c 
         INNER JOIN tree t ON c.id_pai = t.id
       ),
       descendants AS (
         SELECT id FROM tree WHERE id = ?
         UNION ALL
         SELECT c.id FROM categoria_no c INNER JOIN descendants d ON c.id_pai = d.id
       )
       SELECT id, nome, nivel, id_pai 
       FROM tree 
       WHERE id NOT IN (SELECT id FROM descendants)
       ORDER BY id_pai, nome`,
      [excludeId]
    );

    return rows;
  }
};

module.exports = new CategoriaRepository();
