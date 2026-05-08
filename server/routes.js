/**
 * Rotas e Lógica Unificadas
 * 
 * Este arquivo centraliza TODAS as rotas da API junto com sua lógica.
 * Combina o que antes estava em:
 * - controllers/DepartamentoController.js
 * - controllers/CategoriaController.js
 * - routes/departamentos.js
 * - routes/categorias.js
 * 
 * Mantém todas as funcionalidades e validações originais.
 */

const express = require('express');
const pool = require('./db');

const router = express.Router();

// ========== DEPARTAMENTOS (nós raiz) ==========

/**
 * POST /api/departamentos
 * Criar novo departamento (raiz)
 * Body: { nome, descricao?, icone? }
 */
router.post('/departamentos', async (req, res) => {
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
});

/**
 * GET /api/departamentos
 * Obter todos os departamentos principais (sem pai)
 */
router.get('/departamentos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categoria_no WHERE id_pai IS NULL ORDER BY nome');
    res.json({ sucesso: true, dados: rows });
  } catch (err) {
    console.error('Erro ao obter departamentos:', err);
    res.status(500).json({ erro: 'Erro ao obter departamentos' });
  }
});

/**
 * GET /api/departamentos/:id
 * Obter departamento específico por ID
 */
router.get('/departamentos/:id', async (req, res) => {
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
});

/**
 * PUT /api/departamentos/:id
 * Atualizar departamento existente
 * Body: { nome, descricao?, icone? }
 */
router.put('/departamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

    // RN-01: Verificar unicidade global de nome, excluindo o próprio registro
    const compareKey = nome.replace(/\s+/g, '').toLowerCase();
    const [existing] = await pool.query(
      'SELECT id FROM categoria_no WHERE LOWER(REPLACE(nome, " ", "")) = ? AND id != ? LIMIT 1',
      [compareKey, id]
    );

    if (existing && existing.length > 0) {
      return res.status(409).json({ erro: 'Nome já existe (deve ser único na árvore)' });
    }

    // Update: modifica registro existente
    await pool.query(
      'UPDATE categoria_no SET nome = ?, descricao = ?, icone = ? WHERE id = ?',
      [nome, descricao || '', icone || '', id]
    );

    res.json({ sucesso: true, mensagem: 'Departamento atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar departamento:', err);
    res.status(500).json({ erro: 'Erro ao atualizar departamento' });
  }
});

/**
 * DELETE /api/departamentos/:id
 * Deletar departamento
 */
router.delete('/departamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categoria_no WHERE id = ?', [id]);
    res.json({ sucesso: true, mensagem: 'Departamento deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar departamento:', err);
    res.status(500).json({ erro: 'Erro ao deletar departamento' });
  }
});

// ========== CATEGORIAS (nós filhos) ==========

/**
 * GET /api/categorias?id_pai=X
 * Obter categorias filhas por id_pai
 */
router.get('/categorias', async (req, res) => {
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
});

/**
 * POST /api/categorias
 * Criar nova categoria (nó filho)
 * Body: { nome, descricao?, icone?, id_pai }
 */
router.post('/categorias', async (req, res) => {
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
});

module.exports = router;
