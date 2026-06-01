# 📚 Documentação Completa - Estrutura do Projeto Árvore Mercadológica

## 🎯 Visão Geral

**Árvore Mercadológica** é uma aplicação web para gerenciar estruturas hierárquicas de departamentos e categorias. É um sistema full-stack com:
- **Frontend**: HTML/CSS/JavaScript puro (sem framework)
- **Backend**: Node.js + Express
- **Banco de dados**: MySQL
- **Arquitetura**: Camadas (Controllers → Repositories → Database)

---

## 📁 Estrutura Geral do Projeto

```
Árvore Mercadologica/
├── package.json           ← Dependências npm
├── schema.sql             ← Script de criação do banco
├── public/                ← Frontend (arquivos servidos ao cliente)
│   ├── index.html
│   ├── script.js
│   └── style.css
└── server/                ← Backend (API e lógica de negócio)
    ├── index.js
    ├── routes.js
    ├── config/            ← Configurações
    ├── controllers/       ← Lógica de requisições HTTP
    ├── middleware/        ← Processadores de requisição
    ├── repositories/      ← Acesso ao banco de dados
    ├── routes/            ← Definição de endpoints
    └── utils/             ← Funções auxiliares
```

---

## 📋 Arquivos na Raiz

### `package.json`
- **O quê**: Configuração do projeto Node.js
- **Contém**:
  - Nome: `arvore-mercadologica`
  - Versão: `1.0.0`
  - Script principal: `server/index.js`
  - Dependências: Express, MySQL2, CORS, Body-parser, dotenv
  - DevDependencies: Nodemon (recarregar servidor em desenvolvimento)
- **Uso**: `npm install` (instalar dependências), `npm start` (rodar servidor)
- **Scripts**:
  ```json
  {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js"
  }
  ```

### `schema.sql`
- **O quê**: Script SQL para criar o banco de dados
- **Contém**: Criação da tabela `categoria_no` com campos:
  - `id` (AUTO_INCREMENT)
  - `nome`, `descricao`, `icone`
  - `id_pai` (referência para hierarquia)
  - `ativo` (flag para ativar/desativar)
- **Uso**: Executar uma vez ao inicializar o banco
- **Estrutura da tabela**:
  ```sql
  CREATE TABLE IF NOT EXISTS categoria_no (
    id             INT   NOT NULL AUTO_INCREMENT,
    nome           VARCHAR(120)  NOT NULL,
    descricao      VARCHAR(250)  NOT NULL DEFAULT '',
    icone          VARCHAR(50)   NOT NULL DEFAULT '',
    id_pai         INT ,
    ativo          TINYINT(1)    NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    INDEX idx_pai      (id_pai),
    INDEX idx_ativo    (ativo),
    CONSTRAINT fk_pai FOREIGN KEY (id_pai)
      REFERENCES categoria_no(id)
      ON DELETE RESTRICT ON UPDATE CASCADE
  );
  ```

---

## 🎨 Pasta `/public` - Frontend

Arquivos servidos ao cliente (HTML, CSS, JavaScript). Esta é a interface visual da aplicação.

### `public/index.html`
- **O quê**: Página HTML principal da aplicação
- **Responsabilidades**:
  - Estrutura da página (meta tags, title)
  - Importação de estilos e fontes
  - Área de controles (theme toggle)
  - Sidebar para listar departamentos
  - Área de conteúdo para gerenciar categorias
- **Meta tags importantes**:
  - `charset="UTF-8"` - Codificação UTF-8
  - `viewport="width=device-width, initial-scale=1.0"` - Responsividade
  - `data-theme="light"` - Tema padrão
- **Componentes principais**:
  - `.controls` - Botão para alternar tema (claro/escuro)
  - `.demo-wrapper` - Container principal
  - Sidebar - Lista hierárquica de departamentos
  - Main content - Formulário e listagem de categorias

### `public/style.css`
- **O quê**: Folha de estilos CSS da aplicação
- **Responsabilidades**:
  - Definir layout responsivo
  - Estilos de componentes (botões, inputs, cards)
  - Suporte a dois temas (claro/escuro)
  - Animações e transições
- **Características principais**:
  - Variáveis CSS customizadas (`--cor-primaria`, `--bg-dark`, etc)
  - Modo claro: cores claras (fundo branco, texto escuro)
  - Modo escuro: cores escuras (fundo preto, texto claro)
  - Responsividade para mobile e desktop
  - Flexbox/Grid para layout moderno
- **Componentes estilizados**:
  - Sidebar com hierarquia visual
  - Botões com hover/active states
  - Formulários com validação visual
  - Cards e containers
  - Tema toggle button

### `public/script.js`
- **O quê**: Lógica JavaScript do frontend
- **Responsabilidades principais**:
  1. **Fazer requisições HTTP para a API**
     - GET `/api/departamentos` - Listar departamentos
     - GET `/api/categorias?id_pai=X` - Listar categorias de um pai
     - POST `/api/departamentos` - Criar departamento
     - POST `/api/categorias` - Criar categoria
     - PUT `/api/departamentos/:id` - Atualizar departamento
     - PUT `/api/categorias/:id` - Atualizar categoria
     - DELETE `/api/departamentos/:id` - Deletar departamento
     - DELETE `/api/categorias/:id` - Deletar categoria
  
  2. **Renderizar a árvore hierárquica**
     - Carregar departamentos na sidebar
     - Carrega categorias quando clica em um departamento
     - Renderizar estrutura visual (indentação, ícones)
  
  3. **Manipular eventos de usuário**
     - Click em departamento → Carrega suas categorias
     - Click em "Criar" → Abre formulário
     - Click em "Editar" → Preenche formulário
     - Click em "Deletar" → Confirma e deleta
     - Submit formulário → Envia dados para API
  
  4. **Gerenciar tema**
     - Toggle entre claro/escuro
     - Salvar preferência no localStorage
     - Aplicar classe CSS correspondente
  
  5. **Feedback visual**
     - Mostrar mensagens de sucesso/erro
     - Desabilitar botões durante requisições
     - Indicadores de carregamento
     - Validação de inputs no cliente

---

## 🖥️ Pasta `/server` - Backend

### `server/index.js` - Ponto de Entrada
- **O quê**: Arquivo principal que inicia o servidor Node.js
- **Responsabilidades**:
  1. **Importar dependências e configurações**
     - Express (framework web)
     - CORS (permitir requisições cross-origin)
     - dotenv (variáveis de ambiente)
     - Logger, error handler, request logger
  
  2. **Criar aplicação Express**
     - `const app = express()`
  
  3. **Configurar middleware (em ordem)**
     - `cors()` - Permite requisições de qualquer origem
     - `express.json()` - Parse de corpo JSON
     - `requestLogger` - Log de todas as requisições
     - `express.static()` - Servir arquivos estáticos de `/public`
  
  4. **Montar rotas de API**
     - `app.use('/api', require('./routes'))`
     - Combina departamentos e categorias
  
  5. **Rota de health check**
     - `GET /api/health` - Verifica se servidor está rodando
  
  6. **Middleware de erro**
     - `app.use(errorHandler)` - Captura erros globais
  
  7. **Iniciar servidor**
     - `app.listen(PORT)` - Escuta na porta configurada
     - Log de sucesso
- **Porta padrão**: 3000 (configurável via `process.env.PORT`)

### `server/routes.js` - Agregador de Rotas
- **O quê**: Centraliza todas as rotas da API
- **Responsabilidade**:
  1. Criar router Express
  2. Importar routers específicos (`departamentos`, `categorias`)
  3. Montar routers sob `/api`
  4. Exportar router para ser usado em `index.js`
- **Estrutura**:
  ```javascript
  const router = express.Router();
  router.use('/departamentos', require('./routes/departamentos'));
  router.use('/categorias', require('./routes/categorias'));
  module.exports = router;
  ```
- **Padrão**: Separação de responsabilidades por entidade

---

## ⚙️ Pasta `/server/config` - Configurações

### `config/environment.js`
- **O quê**: Gerencia todas as variáveis de ambiente
- **Carrega**:
  - `PORT` - Porta do servidor (padrão: 3000)
  - `NODE_ENV` - Ambiente (development/production)
  - Credenciais MySQL:
    - `MYSQL_HOST` - Host do banco
    - `MYSQL_PORT` - Porta do banco (padrão: 3306)
    - `MYSQL_USER` - Usuário MySQL
    - `MYSQL_PASSWORD` - Senha MySQL
    - `MYSQL_DATABASE` - Nome do banco
  - `CORS_ORIGIN` - Origem permitida para CORS
- **Uso**: Importar uma única vez e usar em toda aplicação
- **Benefício**: Centraliza configuração, facilita mudar para diferentes ambientes

### `config/database.js`
- **O quê**: Gerencia conexão com banco de dados MySQL
- **Responsabilidade**:
  1. Importar credenciais do `environment.js`
  2. Criar pool de conexões MySQL2
  3. Testar conexão (opcional)
  4. Exportar pool para repositories
- **O que é pool?**: Conjunto reutilizável de conexões
  - Mais eficiente que abrir/fechar conexão a cada query
  - Aumenta performance
  - Gerencia automaticamente limite de conexões
- **Uso em repositories**:
  ```javascript
  const pool = require('../config/database');
  const [rows] = await pool.query('SELECT * FROM categoria_no');
  ```

### `config/constants.js`
- **O quê**: Constantes globais da aplicação
- **Contém**:
  - **Status de entidades**:
    ```javascript
    ENTITY_STATUS: {
      ACTIVE: 1,
      INACTIVE: 0
    }
    ```
  - **Códigos HTTP padronizados**:
    ```javascript
    HTTP_CODES: {
      OK: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
      NOT_FOUND: 404,
      CONFLICT: 409,
      INTERNAL_ERROR: 500
    }
    ```
  - **Códigos de erro**:
    ```javascript
    ERROR_CODES: {
      VALIDATION_ERROR,
      DUPLICATE_NAME,
      PARENT_NOT_FOUND,
      NOT_FOUND,
      INTERNAL_ERROR
    }
    ```
  - **Validações**:
    ```javascript
    MIN_NOME_LENGTH: 4,
    MAX_NOME_LENGTH: 120
    ```
- **Benefício**: Evita "números mágicos" espalhados no código
- **Uso**: `if (status === ENTITY_STATUS.ACTIVE) { ... }`

---

## 🎮 Pasta `/server/controllers` - Lógica HTTP

Controllers são responsáveis por receber requisições HTTP, validar dados, chamar repositories e retornar respostas.

### `controllers/DepartamentoController.js`
- **O quê**: Lógica para gerenciar departamentos (nós raiz da árvore)
- **Responsabilidades**:
  1. Receber requisições HTTP
  2. Validar dados de entrada
  3. Chamar repository para operações de banco
  4. Retornar respostas padronizadas
- **Métodos (static)**:
  
  **`criar(req, res)`** - POST /api/departamentos
  - Recebe: `{ nome, descricao, icone }`
  - Valida: Nome obrigatório, comprimento mínimo, unicidade
  - Chama: `DepartamentoRepository.create()`
  - Retorna: 201 com novo departamento
  
  **`obterTodos(req, res)`** - GET /api/departamentos
  - Sem parâmetros
  - Chama: `DepartamentoRepository.findAll()`
  - Retorna: 200 com array de departamentos
  
  **`obterPorId(req, res)`** - GET /api/departamentos/:id
  - Recebe: `:id` na URL
  - Valida: ID válido
  - Chama: `DepartamentoRepository.findById(id)`
  - Retorna: 200 com departamento ou 404
  
  **`atualizar(req, res)`** - PUT /api/departamentos/:id
  - Recebe: `:id` + `{ nome, descricao, icone, ativo }`
  - Valida: Campos que estão sendo atualizados
  - Chama: `DepartamentoRepository.update()`
  - Retorna: 200 com departamento atualizado
  
  **`deletar(req, res)`** - DELETE /api/departamentos/:id
  - Recebe: `:id`
  - Valida: Não tem subcategorias
  - Chama: `DepartamentoRepository.delete()`
  - Retorna: 204 ou 409 se tiver filhos
  
- **Tratamento de erros**:
  - Erros de validação → 400
  - Conflitos (duplicação) → 409
  - Não encontrado → 404
  - Erro interno → 500
  - Todos loggados e retornados com código de erro

### `controllers/CategoriaController.js`
- **O quê**: Lógica para gerenciar categorias (nós filhos da árvore)
- **Métodos**: Similares a DepartamentoController
- **Diferenças principais**:
  - Categorias obrigatoriamente têm `id_pai`
  - Nome deve ser único entre irmãos (mesmo pai), não globalmente
  - Validação adicional: Verificar se pai existe
  - Método adicional: `obterPorIdPai()` - Listar categorias de um departamento

---

## 📦 Pasta `/server/repositories` - Acesso a Dados

Repositories encapsulam toda a lógica SQL, separando completamente da lógica HTTP. Garantem que SQL só exista em um lugar.

### `repositories/DepartamentoRepository.js`
- **O quê**: Todas as queries SQL relacionadas a departamentos
- **Método CRUD**:
  
  **`create({ nome, descricao, icone })`**
  - INSERT: Insere novo departamento (sem id_pai = raiz)
  - Retorna: `{ id, nome, descricao, icone }`
  
  **`findAll()`**
  - SELECT: Todos departamentos raiz (WHERE id_pai IS NULL)
  - Ordem: Por nome
  - Retorna: Array de departamentos
  
  **`findById(id)`**
  - SELECT: Um departamento específico
  - Retorna: Objeto ou null se não existe
  
  **`update(id, { nome, descricao, icone, ativo })`**
  - UPDATE: Apenas campos fornecidos (não força atualizar tudo)
  - Exemplo: Se só `nome` é fornecido, só atualiza `nome`
  - Retorna: Departamento atualizado
  
  **`delete(id)`**
  - DELETE: Remove departamento da tabela
  - Retorna: true
  
- **Métodos customizados**:
  
  **`checkNomeExists(nome, excludeId = null)`**
  - Verifica se nome já existe (ignora case e espaços)
  - `excludeId`: Permite excluir um ID na busca (útil ao editar)
  - Retorna: boolean
  
  **`countChildren(id)`**
  - Conta quantas subcategorias um departamento tem
  - Usado para validar se pode deletar
  - Retorna: número

### `repositories/CategoriaRepository.js`
- **O quê**: Todas as queries SQL relacionadas a categorias
- **Métodos**: Similares a DepartamentoRepository
- **Diferenças principais**:
  - Queries levam em conta `id_pai`
  - Método adicional: `findByIdPai(id_pai)`
    - SELECT: Todas as categorias de um pai específico
    - Retorna: Array de categorias
  - Unicidade de nome: Valida entre irmãos, não globalmente
  - Na inserção: Obrigatoriamente fornece `id_pai`

---

## 🛤️ Pasta `/server/routes` - Definição de Endpoints

Routes definem URLs e conectam requisições HTTP com controllers.

### `routes/departamentos.js`
- **O quê**: Endpoints REST para departamentos
- **Endpoints**:
  ```
  GET    /departamentos           → DepartamentoController.obterTodos()
  POST   /departamentos           → DepartamentoController.criar()
  GET    /departamentos/:id       → DepartamentoController.obterPorId()
  PUT    /departamentos/:id       → DepartamentoController.atualizar()
  DELETE /departamentos/:id       → DepartamentoController.deletar()
  ```
- **Exemplo de implementação**:
  ```javascript
  const express = require('express');
  const router = express.Router();
  const DepartamentoController = require('../controllers/DepartamentoController');

  router.get('/', DepartamentoController.obterTodos);
  router.post('/', DepartamentoController.criar);
  router.get('/:id', DepartamentoController.obterPorId);
  router.put('/:id', DepartamentoController.atualizar);
  router.delete('/:id', DepartamentoController.deletar);

  module.exports = router;
  ```
- **Padrão**: RESTful (recursos como substantivos, métodos HTTP como ações)

### `routes/categorias.js`
- **O quê**: Endpoints REST para categorias
- **Endpoints básicos**: Mesma estrutura que departamentos
  ```
  GET    /categorias             → CategoriaController.obterTodos()
  POST   /categorias             → CategoriaController.criar()
  GET    /categorias/:id         → CategoriaController.obterPorId()
  PUT    /categorias/:id         → CategoriaController.atualizar()
  DELETE /categorias/:id         → CategoriaController.deletar()
  ```
- **Endpoints adicionais** (específicos de categorias):
  ```
  GET    /categorias/pai/:id_pai → CategoriaController.obterPorIdPai()
  ```
  - Retorna todas as categorias filhas de um departamento

---

## 🔧 Pasta `/server/middleware` - Processadores

Middleware executam antes/depois das rotas e podem modificar requisição/resposta.

### `middleware/errorHandler.js`
- **O quê**: Trata erros não capturados da aplicação
- **Responsabilidade**:
  1. Capturar erros lançados por controllers/repositories
  2. Fazer log estruturado do erro
  3. Retornar resposta HTTP padrão
- **Características**:
  - Recebe: `(err, req, res, next)` - 4 parâmetros (Express sabe que é error handler)
  - Loga: Mensagem, stack trace, URL e método HTTP
  - Retorna: 500 com formato padrão
  ```javascript
  res.status(err.status || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Erro interno'
  });
  ```
- **Ordem**: Deve ser o ÚLTIMO middleware registrado em Express

### `middleware/requestLogger.js`
- **O quê**: Registra todas as requisições HTTP
- **Responsabilidade**:
  1. Capturar início da requisição
  2. Medir tempo de processamento
  3. Logar método, URL, status, duração
- **Característ**:
  - Executa para toda requisição
  - Usa evento `res.on('finish')` para capturar após resposta
  - Calcula duração: `Date.now() - start`
  - Loga: `[INFO] GET /api/departamentos status: 200 duration: 15ms`
- **Benefício**: Visibilidade total de requisições, debug de performance

---

## 🛠️ Pasta `/server/utils` - Funções Auxiliares

Utilitários compartilhados entre diferentes partes da aplicação.

### `utils/validators.js`
- **O quê**: Validações centralizadas de dados
- **Por que centralizar?**: Evita duplicação entre controllers
- **Funções**:
  
  **`validateNome(nome)`**
  - Valida: Não vazio, comprimento mínimo (4 chars), formato
  - Normaliza: Remove espaços extras
  - Retorna: `{ valid: true/false, error?: 'mensagem' }`
  
  **`validateIdPai(id_pai)`**
  - Valida: ID é número, existe no banco
  - Retorna: `{ valid: true/false, error?: 'mensagem' }`
  
  **`validateIdDepartamento(id)`**
  - Valida: ID é número válido
  - Retorna: `{ valid: true/false, error?: 'mensagem' }`

- **Padrão de retorno**:
  ```javascript
  if (!validation.valid) {
    throw new ValidationError(validation.error);
  }
  ```

### `utils/logger.js`
- **O quê**: Sistema de logging estruturado
- **Métodos**:
  
  **`error(message, error, context)`**
  - Loga erros com stack trace
  - Formato: `[ERROR] 2026-06-01T10:30:00Z - Mensagem { error, context }`
  - Útil para debugging
  
  **`info(message, context)`**
  - Loga informações importantes
  - Formato: `[INFO] 2026-06-01T10:30:00Z - Mensagem { context }`
  - Exemplo: "Servidor iniciado", "Conexão com banco OK"
  
  **`debug(message, context)`**
  - Loga apenas em desenvolvimento (NODE_ENV=debug)
  - Útil para rastrear fluxo
  - Não aparece em produção

- **Benefício**: Logs estruturados facilitam debugging em produção

### `utils/errors.js`
- **O quê**: Classes de erro customizadas tipadas
- **Classes**:
  
  **`AppError`** - Erro genérico base
  - Propriedades: `message`, `status`, `code`
  - Uso: Base para outros erros
  
  **`ValidationError`** - Erro de validação (400)
  - Propriedades: `message`, `field` (qual campo falhou)
  - Exemplo: `new ValidationError('Nome obrigatório', 'nome')`
  
  **`ConflictError`** - Conflito/duplicação (409)
  - Exemplo: `new ConflictError('Nome já existe')`
  - Usado quando tenta criar/atualizar nome duplicado
  
  **`NotFoundError`** - Recurso não encontrado (404)
  - Exemplo: `new NotFoundError('Departamento')`
  - Retorna: "Departamento não encontrado"

- **Uso em controller**:
  ```javascript
  if (!nome) {
    throw new ValidationError('Nome obrigatório', 'nome');
  }
  const existe = await DepartamentoRepository.checkNomeExists(nome);
  if (existe) {
    throw new ConflictError('Nome já existe');
  }
  ```

---

## 🔄 Fluxo de uma Requisição Completo

### Exemplo: Criar novo departamento

```
1. CLIENT (script.js)
   └─> Usuário clica em "Criar Departamento"
       └─> script.js faz fetch POST para /api/departamentos
           Corpo: { nome: "Eletrônicos", descricao: "...", icone: "📱" }

2. EXPRESS ROUTER (index.js)
   └─> Middleware: cors(), express.json(), requestLogger
   └─> Middleware: errorHandler (final)
   └─> Route: /api/departamentos POST
       └─> routes/departamentos.js: POST handler
           └─> DepartamentoController.criar(req, res)

3. CONTROLLER (DepartamentoController.js)
   └─> Recebe req.body
   └─> Extrai dados: const { nome, descricao, icone } = req.body
   └─> Valida:
       ├─> validators.validateNome(nome)
       ├─> DepartamentoRepository.checkNomeExists(nome)
       └─> Lança erro se falhar (ValidationError, ConflictError)
   └─> Se ok, chama:
       └─> DepartamentoRepository.create({ nome, descricao, icone })

4. REPOSITORY (DepartamentoRepository.js)
   └─> Recebe dados
   └─> Executa INSERT SQL:
       ```sql
       INSERT INTO categoria_no (nome, descricao, icone)
       VALUES (?, ?, ?)
       ```
   └─> Retorna novo objeto com { id: 1, nome, descricao, icone, ativo: 1 }

5. CONTROLLER (volta aqui)
   └─> Recebe resposta do repository
   └─> Retorna resposta HTTP:
       ```javascript
       res.status(201).json({
         status: 'success',
         data: { id: 1, nome, descricao, icone },
         message: 'Departamento criado com sucesso'
       });
       ```

6. EXPRESS (volta ao index.js)
   └─> requestLogger: Registra "POST /api/departamentos status: 201 duration: 25ms"

7. CLIENT (script.js)
   └─> Recebe resposta com status 201
   └─> Parse JSON → extrai dados
   └─> Atualiza interface:
       ├─> Mostra mensagem de sucesso
       ├─> Recarrega lista de departamentos
       ├─> Limpa formulário
       └─> Fecha modal/formulário
```

### Exemplo: Deletar um departamento

```
1. CLIENT
   └─> script.js faz DELETE /api/departamentos/5

2. CONTROLLER
   └─> Valida: ID = 5
   └─> Chama: DepartamentoRepository.countChildren(5)
   └─> Se countChildren > 0:
       └─> Lança ConflictError ("Departamento tem 3 subcategorias")
       └─> retorna 409
   └─> Se countChildren === 0:
       └─> Chama: DepartamentoRepository.delete(5)
       └─> Retorna 204 No Content

3. REPOSITORY
   └─> Executa: DELETE FROM categoria_no WHERE id = 5
   └─> Sucesso!

4. CLIENT
   └─> Se 204: Remove de lista
   └─> Se 409: Mostra erro ao usuário
```

---

## 📊 Banco de Dados

### Tabela: `categoria_no`

```sql
CREATE TABLE IF NOT EXISTS categoria_no (
  id             INT   NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(120)  NOT NULL,
  descricao      VARCHAR(250)  NOT NULL DEFAULT '',
  icone          VARCHAR(50)   NOT NULL DEFAULT '',
  id_pai         INT ,
  ativo          TINYINT(1)    NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  INDEX idx_pai      (id_pai),
  INDEX idx_ativo    (ativo),

  CONSTRAINT fk_pai FOREIGN KEY (id_pai)
    REFERENCES categoria_no(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
```

**Colunas**:
- `id`: Identificador único, auto-incrementado
- `nome`: Nome do departamento/categoria (até 120 caracteres)
- `descricao`: Descrição opcional (até 250 caracteres)
- `icone`: Ícone opcional para exibição (até 50 caracteres)
- `id_pai`: ID do departamento pai
  - `NULL` = É um departamento (raiz)
  - `> 0` = É uma categoria (subcategoria)
- `ativo`: Flag para ativar/desativar (1 = ativo, 0 = inativo)

**Índices**:
- `PRIMARY KEY (id)` - Busca por ID rápida
- `INDEX idx_pai (id_pai)` - Busca por pai rápida
- `INDEX idx_ativo (ativo)` - Filtro por status rápido

**Constraint**:
- `FOREIGN KEY id_pai REFERENCES categoria_no(id)` - Garante referencial
- `ON DELETE RESTRICT` - Não permite deletar departamento com filhos
- `ON UPDATE CASCADE` - Se atualizar pai, atualiza filhos

**Hierarquia**:
```
categoria_no (tabela única com auto-referência)
├── id_pai IS NULL → Departamentos (raiz)
│   └── id_pai = 1 → Categorias filhas
│       └── id_pai = 2 → Subcategorias (níveis ilimitados)
└── Estrutura em árvore flexível
```

---

## 🎯 Regras de Negócio

### RN-01: Unicidade de Nome
- **Departamentos**: Nome deve ser único globalmente
  - Não pode existir dois departamentos com mesmo nome
  - Ignora case (maiúscula/minúscula)
  - Ignora espaços em branco extras
  - Normalização: "  Eletrônicos  " = "eletrônicos"

- **Categorias**: Nome único entre irmãos (mesmo `id_pai`)
  - Pode existir "Notebooks" em dois departamentos diferentes
  - Mas não pode ter dois "Notebooks" no mesmo departamento
  - Mesma normalização (case e espaços)

### RN-02: Validação de Comprimento Mínimo
- Nome deve ter **pelo menos 4 caracteres** (após normalizar espaços)
- Máximo 120 caracteres
- Exemplos:
  - "PC" ❌ (2 caracteres)
  - "Foto" ✅ (4 caracteres)
  - "Eletrônicos" ✅ (11 caracteres)

### RN-03: Cascata de Status
- Quando um departamento ou categoria é **ativado/desativado**:
  - Todos os filhos também devem ser ativados/desativados
  - Exemplo: Desativar "Eletrônicos" → Desativa "Notebooks", "Tablets", etc
  - Implementação: Query recursiva ou atualização em cascade

### RN-10: Bloqueio de Exclusão de Estrutura
- Sistema **impede deleção** de um departamento/categoria que tem filhos
- Erro retornado: `ConflictError` com mensagem
  - Exemplo: "Não é possível deletar: Existem 3 subcategorias"
  - Status HTTP: 409 Conflict
- Solução: Administrador deve primeiro deletar/mover subcategorias
- Implementação: 
  - Repository método `countChildren(id)` conta filhos
  - Controller valida: `if (countChildren > 0) throw ConflictError`
  - Garante integridade da árvore

---

## 🚀 Como Usar

### Instalação e Inicialização

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env na raiz (opcional, usa defaults)
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=db_market_tree

# 3. Criar banco de dados
# Execute schema.sql no MySQL:
mysql -u root < schema.sql

# 4. Iniciar servidor
npm start              # Modo produção
npm run dev          # Modo desenvolvimento (com nodemon)
```

### Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health check**: http://localhost:3000/api/health

### Endpoints Principais

#### Departamentos
```http
# Listar todos
GET /api/departamentos

# Criar novo
POST /api/departamentos
Body: { "nome": "Eletrônicos", "descricao": "...", "icone": "..." }

# Obter um
GET /api/departamentos/1

# Atualizar
PUT /api/departamentos/1
Body: { "nome": "Novo Nome", "ativo": 0 }

# Deletar
DELETE /api/departamentos/1
```

#### Categorias
```http
# Listar todas categorias de um departamento
GET /api/categorias?id_pai=1

# Criar novo
POST /api/categorias
Body: { "nome": "Notebooks", "id_pai": 1, "descricao": "..." }

# Obter uma
GET /api/categorias/5

# Atualizar
PUT /api/categorias/5
Body: { "nome": "Novo Nome" }

# Deletar
DELETE /api/categorias/5
```

### Formato de Resposta

**Sucesso (200/201)**:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "...",
    "icone": "...",
    "ativo": 1
  },
  "message": "Operação realizada com sucesso"
}
```

**Erro (400/409/500)**:
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Nome é obrigatório",
  "field": "nome"
}
```

---

## 📚 Estrutura de Camadas

A arquitetura segue o padrão de camadas:

```
┌─────────────────────────────────────────────┐
│         CLIENTE (Browser)                   │
│  - HTML/CSS/JavaScript                      │
│  - Faz requisições AJAX/Fetch               │
└──────────────┬──────────────────────────────┘
               │ HTTP Request/Response
┌──────────────▼──────────────────────────────┐
│         ROUTES (Endpoints)                  │
│  - Define URLs (/api/departamentos)         │
│  - Conecta com controllers                  │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│         CONTROLLERS (Lógica HTTP)           │
│  - Recebe requisição                        │
│  - Valida dados                             │
│  - Chama repository                         │
│  - Retorna resposta                         │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│         REPOSITORIES (Acesso a Dados)       │
│  - Encapsula queries SQL                    │
│  - Reutilizável entre controllers           │
│  - Retorna dados objetos                    │
└──────────────┬──────────────────────────────┘
               │ SQL Query
┌──────────────▼──────────────────────────────┐
│         DATABASE (MySQL)                    │
│  - Armazena dados em tabelas                │
│  - Executa queries                          │
│  - Garante integridade                      │
└─────────────────────────────────────────────┘
```

**Benefícios desta arquitetura**:
- ✅ **Separação de responsabilidades** - Cada camada tem uma função
- ✅ **Reutilização** - Repository pode ser chamado por múltiplos controllers
- ✅ **Testabilidade** - Fácil testar cada camada independentemente
- ✅ **Manutenibilidade** - Mudanças em banco só afetam repository
- ✅ **Escalabilidade** - Fácil adicionar novas funcionalidades

---

## 🔐 Padrões de Desenvolvimento

### Padrão de Resposta HTTP
Todas as respostas seguem este formato:
```javascript
{
  status: 'success' | 'error',
  data?: {...},           // Present em sucesso
  message?: 'string',     // Mensagem descritiva
  code?: 'ERROR_CODE',    // Present em erro
  field?: 'fieldName'     // Present em erro de validação
}
```

### Padrão de Nomenclatura
- **Métodos de busca**: `findAll()`, `findById()`, `findByIdPai()`
- **Métodos de verificação**: `checkNomeExists()`, `countChildren()`
- **Métodos CRUD**: `create()`, `update()`, `delete()`
- **Variáveis**: `departamento` (singular), `departamentos` (plural)
- **Constantes**: `ENTITY_STATUS`, `HTTP_CODES`, `ERROR_CODES` (UPPER_SNAKE_CASE)

### Padrão de Validação
```javascript
// ❌ Errado - validação espalhada
if (!nome) return res.status(400).json({...});

// ✅ Certo - validação centralizada
const { valid, error } = Validators.validateNome(nome);
if (!valid) throw new ValidationError(error, 'nome');
```

---

## 🛠️ Troubleshooting

### "Erro de conexão com banco de dados"
- Verificar credenciais em `.env`
- Verificar se MySQL está rodando
- Verificar se banco `db_market_tree` foi criado

### "Nome já existe"
- Nome não é único entre irmãos (para categorias)
- Ou nome não é único globalmente (para departamentos)
- Mudar nome para algo diferente

### "Não é possível deletar: tem filhos"
- Departamento/categoria tem subcategorias
- Deletar subcategorias primeiro
- Ou usar DELETE com cascade (não recomendado)

### "Erro 500"
- Verificar logs no servidor (console)
- Verificar integridade do banco
- Checar se tabela `categoria_no` existe

---

## 📝 Checklist de Desenvolvimento

Ao adicionar novas funcionalidades:

- [ ] Criar query em repository
- [ ] Criar método em controller para handle requisição
- [ ] Adicionar rota em routes
- [ ] Testar via Postman/Insomnia/curl
- [ ] Testar via frontend (script.js)
- [ ] Adicionar validação em validators.js
- [ ] Logar requisição importante
- [ ] Documentar endpoint novo neste arquivo
- [ ] Testar casos de erro

---

## 📞 Contato e Suporte

Para dúvidas sobre a estrutura, consulte este documento e os comentários nos arquivos.

