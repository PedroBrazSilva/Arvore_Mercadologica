# 🌳 Árvore Mercadológica

Sistema completo para gestão de árvore mercadológica (departamentos e categorias) com interface web intuitiva e API RESTful robusta.

## 📋 Sobre o Projeto

A **Árvore Mercadológica** é uma aplicação que permite organizar produtos em uma estrutura hierárquica de departamentos e subcategorias. O sistema fornece uma interface visual para criar, editar, visualizar e remover elementos da árvore, mantendo a integridade dos dados através de regras de negócio bem definidas.

### ✨ Funcionalidades

- ✅ Gestão de **departamentos** (raiz da hierarquia)
- ✅ Gestão de **categorias** com suporte a subcategorias ilimitadas
- ✅ **Ativação/Desativação** de elementos (com cascata automática)
- ✅ Validação de **nome único** entre irmãos
- ✅ Bloqueio de exclusão se houver filhos
- ✅ Interface web responsiva e intuitiva
- ✅ API RESTful com respostas padronizadas
- ✅ Logging estruturado de operações
- ✅ Tratamento de erros personalizado

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL 2** - Banco de dados relacional
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Suporte a requisições cross-origin
- **body-parser** - Parse de corpos de requisição

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilos
- **Vanilla JavaScript** - Lógica do cliente

### Desenvolvimento
- **Nodemon** - Reinício automático do servidor durante desenvolvimento

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **MySQL** 5.7+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/arvore-mercadologica.git
cd arvore-mercadologica
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Abra o MySQL e execute o script SQL para criar o banco:

```bash
mysql -u root -p < schema.sql
```

Ou no MySQL client:

```sql
SOURCE schema.sql;
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base em `.env.example`:

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=db_market_tree

# Logging
LOG_LEVEL=info
DEBUG=false

# API
CORS_ORIGIN=http://localhost:3000
```

---

## 🏃 Como Executar

### Modo Produção

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

### Modo Desenvolvimento (com reload automático)

```bash
npm run dev
```

---

## 📁 Estrutura do Projeto

```
arvore-mercadologica/
├── public/                      # Arquivos estáticos (frontend)
│   ├── index.html              # Página principal
│   ├── script.js               # Lógica do cliente
│   └── style.css               # Estilos
│
├── server/                      # Backend
│   ├── config/                 # Configurações
│   │   ├── constants.js        # Constantes globais
│   │   ├── database.js         # Configuração do MySQL
│   │   └── environment.js      # Variáveis de ambiente
│   │
│   ├── controllers/            # Camada de negócio
│   │   ├── DepartamentoController.js
│   │   └── CategoriaController.js
│   │
│   ├── repositories/           # Acesso a dados
│   │   ├── DepartamentoRepository.js
│   │   └── CategoriaRepository.js
│   │
│   ├── routes/                 # Definição de rotas
│   │   ├── departamentos.js
│   │   └── categorias.js
│   │
│   ├── middleware/             # Processadores de requisição
│   │   ├── errorHandler.js    # Tratamento de erros
│   │   └── requestLogger.js   # Log de requisições
│   │
│   ├── utils/                  # Funções utilitárias
│   │   ├── validators.js       # Validações
│   │   ├── logger.js           # Logging estruturado
│   │   └── errors.js           # Erros customizados
│   │
│   ├── index.js                # Ponto de entrada
│   └── routes.js               # Agregador de rotas
│
├── schema.sql                   # Script de criação do banco
├── package.json                # Dependências do projeto
├── .env.example                # Exemplo de configuração
├── README.md                    # Este arquivo
└── .gitignore                  # Arquivos a ignorar no Git
```

---

## 🔌 API Endpoints

### Departamentos

#### Listar todos os departamentos
```http
GET /api/departamentos
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nome": "Eletrônicos",
      "descricao": "Departamento de eletrônicos",
      "icone": "📱",
      "id_pai": null,
      "ativo": 1
    }
  ]
}
```

#### Obter departamento por ID
```http
GET /api/departamentos/:id
```

#### Criar novo departamento
```http
POST /api/departamentos
Content-Type: application/json

{
  "nome": "Eletrônicos",
  "descricao": "Departamento de eletrônicos",
  "icone": "📱"
}
```

**Resposta (201):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "nome": "Eletrônicos",
    "descricao": "Departamento de eletrônicos",
    "icone": "📱",
    "id_pai": null,
    "ativo": 1
  },
  "message": "Departamento criado com sucesso"
}
```

#### Atualizar departamento
```http
PUT /api/departamentos/:id
Content-Type: application/json

{
  "nome": "Eletrônicos e Informática",
  "descricao": "Atualizado",
  "icone": "💻",
  "ativo": 1
}
```

#### Deletar departamento
```http
DELETE /api/departamentos/:id
```

---

### Categorias

#### Listar categorias de um departamento
```http
GET /api/categorias/:id_pai
```

#### Listar todas as categorias com hierarquia
```http
GET /api/categorias
```

#### Obter categoria por ID
```http
GET /api/categorias/detalhes/:id
```

#### Criar nova categoria
```http
POST /api/categorias
Content-Type: application/json

{
  "nome": "Smartphones",
  "descricao": "Telefones móveis",
  "icone": "📱",
  "id_pai": 1
}
```

#### Atualizar categoria
```http
PUT /api/categorias/:id
Content-Type: application/json

{
  "nome": "Smartphones Premium",
  "descricao": "Telefones de alta gama",
  "ativo": 1
}
```

#### Deletar categoria
```http
DELETE /api/categorias/:id
```

---

## 📋 Regras de Negócio

### RN-01: Unicidade de Nome
- **Departamentos**: Nome deve ser único globalmente (ignora maiúsculas/minúsculas e espaços)
- **Categorias**: Nome deve ser único entre irmãos (mesmo `id_pai`), ignora maiúsculas/minúsculas e espaços

### RN-02: Validação de Comprimento Mínimo
- Nome deve ter pelo menos 4 caracteres (após normalizar espaços)

### RN-03: Cascata de Status
- Quando um departamento ou categoria é ativado/desativado, todos os filhos também devem ser ativados/desativados

### RN-10: Bloqueio de Exclusão de Estrutura
- O sistema impede a exclusão de um departamento/categoria que possua subcategorias
- Erro retornado: `ConflictError` com mensagem indicando quantidade de filhos
- **Solução**: Deletar ou mover as subcategorias antes de remover o nó pai

---

## ⚠️ Códigos de Erro

| Código | Status | Descrição |
|--------|--------|-----------|
| `VALIDATION_ERROR` | 400 | Dados de entrada inválidos |
| `DUPLICATE_NAME` | 409 | Nome duplicado |
| `PARENT_NOT_FOUND` | 404 | Pai/Categoria não existe |
| `NOT_FOUND` | 404 | Recurso não encontrado |
| `INTERNAL_ERROR` | 500 | Erro interno do servidor |

---

## 🗂️ Esquema do Banco de Dados

### Tabela: `categoria_no`

```sql
CREATE TABLE categoria_no (
  id             INT            NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(120)   NOT NULL,
  descricao      VARCHAR(250)   NOT NULL DEFAULT '',
  icone          VARCHAR(50)    NOT NULL DEFAULT '',
  id_pai         INT            NULL,
  ativo          TINYINT(1)     NOT NULL DEFAULT 1,
  
  PRIMARY KEY (id),
  INDEX idx_pai (id_pai),
  INDEX idx_ativo (ativo),
  CONSTRAINT fk_pai FOREIGN KEY (id_pai)
    REFERENCES categoria_no(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
```

**Campos:**
- `id`: Identificador único
- `nome`: Nome da categoria/departamento
- `descricao`: Descrição textual
- `icone`: Emoji ou ícone
- `id_pai`: ID do nó pai (NULL = departamento raiz)
- `ativo`: Status do elemento (1 = ativo, 0 = inativo)

---

## 📝 Exemplos de Uso

### JavaScript (Frontend)

```javascript
// Obter todos os departamentos
const response = await fetch('/api/departamentos');
const data = await response.json();

// Criar novo departamento
const newDept = await fetch('/api/departamentos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Eletrônicos',
    descricao: 'Produtos eletrônicos',
    icone: '📱'
  })
});

// Atualizar departamento
await fetch('/api/departamentos/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Eletrônicos e TI' })
});

// Deletar departamento
await fetch('/api/departamentos/1', { method: 'DELETE' });
```

---

## 🐛 Troubleshooting

### Erro: "Conectar no banco de dados"
- Verifique se MySQL está rodando
- Confirme as credenciais em `.env`
- Certifique-se que o banco `db_market_tree` foi criado

### Erro: "CORS error"
- Verifique a variável `CORS_ORIGIN` em `.env`
- Certifique-se que está acessando a partir da origem correta

### Porta 3000 já em uso
```bash
# Mudar a porta no .env
PORT=3001
```

---

## 📚 Documentação Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura técnica do projeto
- [API.md](./API.md) - Documentação completa da API
- [BUSINESS_RULES.md](./BUSINESS_RULES.md) - Regras de negócio detalhadas
- [STANDARDS.md](./STANDARDS.md) - Padrões e convenções de código

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commits

```
feat: adicionar nova funcionalidade
fix: corrigir bug
refactor: reestruturar código
docs: atualizar documentação
test: adicionar testes
style: formatação de código
chore: atualizações de dependências
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por Pedro Henrique Braz Silva

---

## 🎯 Roadmap

- [ ] Autenticação e autorização de usuários
- [ ] Exportação de árvore em diferentes formatos (JSON, CSV, XML)
- [ ] Busca avançada e filtros
- [ ] Histórico de mudanças
- [ ] Testes automatizados completos
- [ ] Dashboard com estatísticas
- [ ] Mobile app (React Native)

---

**Última atualização:** Junho de 2026
