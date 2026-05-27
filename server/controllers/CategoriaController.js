/**
 * Controller de Categorias (REFATORADO)
 * 
 * Centraliza a lógica de negócio para categorias usando:
 * - Repository para acesso a dados
 * - Validators para validações
 * - Erros customizados para tratamento consistente
 */

const CategoriaRepository = require('../repositories/CategoriaRepository');
const Validators = require('../utils/validators');
const Logger = require('../utils/logger');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/errors');

class CategoriaController {
  /**
   * Obter categorias filhas por id_pai
   */
  static async obterPorPai(req, res, next) {
    try {
      const { id_pai } = req.query;

      // Validação: id_pai
      const validation = Validators.validateIdPai(id_pai);
      if (!validation.valid) {
        throw new ValidationError(validation.error, 'id_pai');
      }

      // Verificar se pai existe
      const existe = await CategoriaRepository.parentExists(id_pai);
      if (!existe) {
        throw new NotFoundError('Categoria pai');
      }

      // Obter categorias filhas
      const categorias = await CategoriaRepository.findByIdPai(id_pai);

      res.status(200).json({
        status: 'success',
        data: categorias
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obter categoria específica por ID
   */
  static async obterPorId(req, res, next) {
    try {
      const { id } = req.params;

      // Validação: ID
      const validation = Validators.validateId(id);
      if (!validation.valid) {
        throw new ValidationError(validation.error, 'id');
      }

      // Buscar categoria
      const categoria = await CategoriaRepository.findById(id);
      if (!categoria) {
        throw new NotFoundError('Categoria');
      }

      res.status(200).json({
        status: 'success',
        data: categoria
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Criar nova categoria (nó filho)
   * Body: { nome, descricao?, icone?, id_pai }
   */
  static async criar(req, res, next) {
    try {
      const { nome, descricao, icone, id_pai } = req.body;

      // Validação: nome
      const nomeValidation = Validators.validateNome(nome);
      if (!nomeValidation.valid) {
        throw new ValidationError(nomeValidation.error, 'nome');
      }

      // Validação: id_pai
      const idPaiValidation = Validators.validateIdPai(id_pai);
      if (!idPaiValidation.valid) {
        throw new ValidationError(idPaiValidation.error, 'id_pai');
      }

      // Verificar se pai existe
      const paiExiste = await CategoriaRepository.parentExists(id_pai);
      if (!paiExiste) {
        throw new NotFoundError('Categoria pai');
      }

      // RN-01: Verificar unicidade entre irmãos
      const nomeExiste = await CategoriaRepository.checkNomeExistsBySibling(nome, id_pai);
      if (nomeExiste) {
        throw new ConflictError('Nome já existe entre as categorias do mesmo pai');
      }

      // Criar categoria
      const categoria = await CategoriaRepository.create({
        nome,
        descricao,
        icone,
        id_pai
      });

      res.status(201).json({
        status: 'success',
        data: categoria,
        message: 'Categoria criada com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Atualizar categoria existente
   * Body: { nome, descricao?, icone?, ativo? }
   */
  static async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { nome, descricao, icone, ativo } = req.body;

      // Validação: ID
      const idValidation = Validators.validateId(id);
      if (!idValidation.valid) {
        throw new ValidationError(idValidation.error, 'id');
      }

      // Verificar se categoria existe
      const categoria = await CategoriaRepository.findById(id);
      if (!categoria) {
        throw new NotFoundError('Categoria');
      }

      // Validação: nome (se fornecido)
      if (nome !== undefined) {
        const nomeValidation = Validators.validateNome(nome);
        if (!nomeValidation.valid) {
          throw new ValidationError(nomeValidation.error, 'nome');
        }

        // RN-01: Verificar unicidade entre irmãos
        const nomeExiste = await CategoriaRepository.checkNomeExistsBySibling(
          nome,
          categoria.id_pai,
          id
        );
        if (nomeExiste) {
          throw new ConflictError('Nome já existe entre as categorias do mesmo pai');
        }
      }

      // Se está atualizando status, fazer cascata
      if (ativo !== undefined) {
        await CategoriaRepository.updateStatusCascade(id, ativo);
      }

      // Atualizar categoria
      const categoriaAtualizada = await CategoriaRepository.update(id, {
        nome,
        descricao,
        icone,
        ativo: ativo === undefined ? undefined : ativo
      });

      res.status(200).json({
        status: 'success',
        data: categoriaAtualizada,
        message: 'Categoria atualizada com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletar categoria (RN-10: Bloqueia se possui filhos)
   */
  static async deletar(req, res, next) {
    try {
      const { id } = req.params;

      // Validação: ID
      const validation = Validators.validateId(id);
      if (!validation.valid) {
        throw new ValidationError(validation.error, 'id');
      }

      // Verificar se categoria existe
      const categoria = await CategoriaRepository.findById(id);
      if (!categoria) {
        throw new NotFoundError('Categoria');
      }

      // RN-10: Verificar se possui filhos
      const totalFilhos = await CategoriaRepository.countChildren(id);
      if (totalFilhos > 0) {
        throw new ConflictError(
          `Não é possível deletar uma categoria que possui ${totalFilhos} subcategoria(s). ` +
          'Delete ou mova as subcategorias primeiro.'
        );
      }

      // Deletar
      await CategoriaRepository.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Categoria deletada com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoriaController;

