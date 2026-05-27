/**
 * Repository de Departamentos
 * 
 * Centraliza toda a lógica de acesso ao banco de dados para departamentos.
 * Métodos reutilizáveis para CRUD e queries customizadas.
 */

const pool = require('../config/database');

class DepartamentoRepository {
  /**
   * Obter todos os departamentos (raiz, sem pai)
   */
  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM categoria_no WHERE id_pai IS NULL ORDER BY nome'
    );
    return rows;
  }

  /**
   * Obter departamento específico por ID
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categoria_no WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Obter filhos de um departamento (subcategorias)
   */
  async findChildren(id) {
    const [rows] = await pool.query(
      'SELECT * FROM categoria_no WHERE id_pai = ? ORDER BY nome',
      [id]
    );
    return rows;
  }

  /**
   * Criar novo departamento
   */
  async create({ nome, descricao, icone }) {
    const [result] = await pool.query(
      'INSERT INTO categoria_no (nome, descricao, icone) VALUES (?, ?, ?)',
      [nome, descricao || '', icone || '']
    );
    return { id: result.insertId, nome, descricao, icone };
  }

  /**
   * Atualizar departamento
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
   * Contar filhos de um departamento (RN-10)
   */
  async countChildren(id) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM categoria_no WHERE id_pai = ?',
      [id]
    );
    return rows[0]?.count || 0;
  }

  /**
   * Deletar departamento
   */
  async delete(id) {
    await pool.query('DELETE FROM categoria_no WHERE id = ?', [id]);
    return true;
  }

  /**
   * Verificar se nome (departamento) já existe globalmente
   * Ignora case e espaços
   */
  async checkNomeExists(nome, excludeId = null) {
    const compareKey = nome.replace(/\s+/g, '').toLowerCase();
    let query = 'SELECT id FROM categoria_no WHERE LOWER(REPLACE(nome, " ", "")) = ? LIMIT 1';
    let params = [compareKey];

    if (excludeId) {
      query = 'SELECT id FROM categoria_no WHERE LOWER(REPLACE(nome, " ", "")) = ? AND id != ? LIMIT 1';
      params = [compareKey, excludeId];
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0;
  }

  /**
   * Atualizar status de um departamento e todos os filhos em cascata
   * Usado para ativar/desativar um departamento e sua árvore inteira
   */
  async updateStatusCascade(id, ativo) {
    // Atualizar o próprio departamento
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
}

module.exports = new DepartamentoRepository();
