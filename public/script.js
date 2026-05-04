/**
 * Script Principal da Árvore Mercadológica
 * 
 * Responsável pela lógica de frontend:
 * 1. Gerenciamento de temas (claro/escuro)
 * 2. Controle do modal de novo departamento
 * 3. Detecção automática de ícones por nome
 * 4. Comunicação com a API para CRUD de departamentos
 * 5. Renderização dinâmica da interface
 */

// ========== ALTERNÂNCIA DE TEMA ==========
/**
 * Alterna entre tema claro e escuro
 * Modifica o atributo 'data-theme' do elemento html
 */
function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
}

// ========== MAPA DE ÍCONES ==========
/**
 * Dicionário que mapeia palavras-chave para ícones emoji
 * Usado para detectar automaticamente o ícone baseado no nome do departamento
 */
const iconMap = {
  'eletrônico': '🖥️',
  'celular': '📱',
  'informática': '💻',
  'eletrodoméstico': '🏠',
  'casa': '🛋️',
  'decoração': '🛋️',
  'moda': '👕',
  'beleza': '💆',
  'saúde': '💆',
  'supermercado': '🛒',
  'pets': '🐾',
  'esportes': '⚽',
  'lazer': '⚽',
  'automotivo': '🚗',
  'ferramentas': '🔧',
  'construção': '🔧',
  'games': '🎮',
  'consoles': '🎮',
  'livros': '📚',
  'música': '📚',
  'filmes': '📚',
  'serviços': '🔔',
};

// Array de ícones disponíveis para fallback
// Usado quando nenhuma palavra-chave é encontrada
const availableIcons = [
  '🖥️', '📱', '💻', '🏠', '🛋️', '👕',
  '💆', '🛒', '🐾', '⚽', '🚗', '🔧',
  '🎮', '📚', '🔔', '❤️', '⭐', '🎨',
  '🔐', '📊', '✉️', '🎯', '💡', '🌟',
  '🎁', '🔥', '💎', '🏆', '📈', '🎪'
];

// ========== DETECÇÃO AUTOMÁTICA DE ÍCONES ==========
/**
 * Analisa o nome do departamento e retorna um ícone apropriado
 * Busca por palavras-chave no nome
 * 
 * @param {string} name - Nome do departamento
 * @returns {string} Ícone emoji correspondente
 */
function detectIconFromName(name) {
  const lowerName = name.toLowerCase();
  
  // Procura por palavras-chave conhecidas no nome
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(keyword)) {
      return icon;
    }
  }
  
  // Se nenhuma palavra-chave for encontrada, usa o primeiro ícone como padrão
  return availableIcons[0];
}

// ========== GERENCIAMENTO DO MODAL ==========
/**
 * Abre o modal para criar novo departamento
 * Limpa o formulário e coloca foco no campo de nome
 */
function openDepartmentModal() {
  const modal = document.getElementById('departmentModal');
  modal.classList.add('show');
  
  // Limpar o formulário
  document.getElementById('departmentForm').reset();
  
  // Focar no campo de nome após abertura do modal
  setTimeout(() => {
    document.getElementById('deptName').focus();
  }, 100);
}

/**
 * Fecha o modal de criação de departamento
 * Limpa os campos do formulário
 */
function closeDepartmentModal() {
  const modal = document.getElementById('departmentModal');
  modal.classList.remove('show');
  document.getElementById('departmentForm').reset();
}

// ========== SALVAR DEPARTAMENTO ==========
/**
 * Processa o envio do formulário de novo departamento
 * 1. Valida os dados
 * 2. Detecta automaticamente o ícone
 * 3. Envia os dados para a API
 * 4. Atualiza a interface
 */
function saveDepartment(event) {
  event.preventDefault();
  
  const name = document.getElementById('deptName').value.trim();
  const description = document.getElementById('deptDescription').value.trim();
  
  if (!name) {
    alert('Por favor, insira o nome do departamento.');
    return;
  }
  
  // Detectar automaticamente o ícone baseado no nome
  const icon = detectIconFromName(name);
  
  // Enviar dados para a API
  const dados = {
    nome: name,
    descricao: description,
    icone: icon
  };

  fetch('http://localhost:3000/api/departamentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
  .then(response => response.json())
  .then(data => {
    if (data.sucesso) {
      // Fechar o modal
      closeDepartmentModal();
      
      // Mostrar mensagem de sucesso
      alert(`Departamento "${name}" cadastrado com sucesso!`);
      
      // Recarregar a lista de departamentos
      carregarDepartamentos();
    } else {
      alert('Erro: ' + (data.erro || 'Erro ao cadastrar departamento'));
    }
  })
  .catch(err => {
    console.error('Erro ao cadastrar departamento:', err);
    alert('Erro ao cadastrar departamento. Verifique se o servidor está rodando.');
  });
}

// ========== EVENTO DE CARREGAMENTO ==========
/**
 * Executado quando a página carrega
 * 1. Vincula eventos aos botões
 * 2. Configura comportamento do modal
 * 3. Carrega departamentos da API
 */
document.addEventListener('DOMContentLoaded', () => {
  // Vincular clique no botão '+' para abrir modal
  const btnAddMain = document.querySelector('.btn-add-main');
  if (btnAddMain) {
    btnAddMain.addEventListener('click', openDepartmentModal);
  }
  
  // Fechar modal ao clicar fora do conteúdo
  const modal = document.getElementById('departmentModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeDepartmentModal();
      }
    });
  }
  
  // Carregar departamentos da API ao iniciar
  carregarDepartamentos();
});

// ========== COMUNICAÇÃO COM API ==========
/**
 * Carrega todos os departamentos da API
 * Requisição GET para /api/departamentos
 */
function carregarDepartamentos() {
  fetch('http://localhost:3000/api/departamentos')
    .then(response => response.json())
    .then(data => {
      if (data.sucesso && data.dados) {
        exibirDepartamentos(data.dados);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar departamentos:', err);
    });
}

// ========== RENDERIZAÇÃO DA INTERFACE ==========
/**
 * Exibe os departamentos carregados da API na interface
 * 
 * @param {Array} departamentos - Lista de departamentos retornados pela API
 * 
 * TODO: Implementar renderização completa dos departamentos na sidebar
 * Estrutura esperada por departamento:
 * { id, nome, descricao, icone, id_pai, ativo }
 */
function exibirDepartamentos(departamentos) {
  const container = document.getElementById('departmentsContainer');
  
  // Limpar conteúdo anterior
  container.innerHTML = '';
  
  // TODO: Implementar renderização de cada departamento
  // com suporte a expansão de subcategorias e ações (editar/deletar)
  console.log('Departamentos carregados:', departamentos);
}
