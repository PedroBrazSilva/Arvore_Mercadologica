/**
 * Controller de Departamentos (REFATORADO)
 * 
 * Centraliza a lógica de negócio para departamentos usando:
 * - Repository para acesso a dados
 * - Validators para validações
 * - Erros customizados para tratamento consistente
 */

const DepartamentoRepository = require('../repositories/DepartamentoRepository');
const Validators = require('../utils/validators');
const Logger = require('../utils/logger');
const { ValidationError, ConflictError, NotFoundError } = require('../utils/errors');

class DepartamentoController {
  /**
   * Criar novo departamento (raiz)
   * Body: { nome, descricao?, icone? }
   */
  static async criar(req, res, next) {
    try {
      const { nome, descricao, icone } = req.body;

      // Validação: nome
      const validation = Validators.validateNome(nome);
      if (!validation.valid) {
        throw new ValidationError(validation.error, 'nome');
      }

      // Verificar unicidade global de nome (RN-01)
      const existe = await DepartamentoRepository.checkNomeExists(nome);
      if (existe) {
        throw new ConflictError('Nome já existe (deve ser único na árvore)');
      }

      // Criar departamento
      const departamento = await DepartamentoRepository.create({
        nome,
        descricao,
        icone
      });

      // Resposta padrão
      res.status(201).json({
        status: 'success',
        data: departamento,
        message: 'Departamento criado com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obter todos os departamentos principais (sem pai)
   */
  static async obterTodos(req, res, next) {
    try {
      const departamentos = await DepartamentoRepository.findAll();
      res.status(200).json({
        status: 'success',
        data: departamentos
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obter departamento específico por ID
   */
  static async obterPorId(req, res, next) {
    try {
      const { id } = req.params;

      // Validação: ID
      const validation = Validators.validateId(id);
      if (!validation.valid) {
        throw new ValidationError(validation.error, 'id');
      }

      // Buscar departamento
      const departamento = await DepartamentoRepository.findById(id);
      if (!departamento) {
        throw new NotFoundError('Departamento');
      }

      res.status(200).json({
        status: 'success',
        data: departamento
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Atualizar departamento existente
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

      // Validação: nome (se fornecido)
      if (nome !== undefined) {
        const nomeValidation = Validators.validateNome(nome);
        if (!nomeValidation.valid) {
          throw new ValidationError(nomeValidation.error, 'nome');
        }

        // Verificar unicidade global (RN-01)
        const existe = await DepartamentoRepository.checkNomeExists(nome, id);
        if (existe) {
          throw new ConflictError('Nome já existe (deve ser único na árvore)');
        }
      }

      // Verificar se departamento existe
      const departamento = await DepartamentoRepository.findById(id);
      if (!departamento) {
        throw new NotFoundError('Departamento');
      }

      // Se está atualizando status, fazer cascata
      if (ativo !== undefined) {
        await DepartamentoRepository.updateStatusCascade(id, ativo);
      }

      // Atualizar departamento
      const departamentoAtualizado = await DepartamentoRepository.update(id, {
        nome,
        descricao,
        icone,
        ativo: ativo === undefined ? undefined : ativo
      });

      res.status(200).json({
        status: 'success',
        data: departamentoAtualizado,
        message: 'Departamento atualizado com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletar departamento (RN-10: Bloqueia se possui filhos)
   */
  static async deletar(req, res, next) {
    try {
      const { id } = req.params;

      // Validação: ID
      const validation = Validators.validateId(id);
      if (!validation.valid) {
        throw new ValidationError(validation.error, 'id');
      }

      // Verificar se departamento existe
      const departamento = await DepartamentoRepository.findById(id);
      if (!departamento) {
        throw new NotFoundError('Departamento');
      }

      // RN-10: Verificar se possui filhos (subcategorias)
      const totalFilhos = await DepartamentoRepository.countChildren(id);
      if (totalFilhos > 0) {
        throw new ConflictError(
          `Não é possível deletar um departamento que possui ${totalFilhos} categoria(s). ` +
          'Delete ou mova as categorias primeiro.'
        );
      }

      // Deletar
      await DepartamentoRepository.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Departamento deletado com sucesso'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DepartamentoController;
