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
  // Eletrônicos / informática
  'eletrônico': '🖥️',
  'informática': '💻',
  'computador': '💻',
  'notebook': '💻',
  'monitor': '🖥️',
  'tablet': '📱',
  'celular': '📱',
  'smartphone': '📱',
  'tv': '📺',

  // Casa / móveis / decoração
  'casa': '🏠',
  'móvel': '🛋️',
  'decoração': '🛋️',
  'cozinha': '🍽️',
  'jardim': '🌿',

  // Alimentação / supermercado
  'alimento': '🍎',
  'comida': '🍔',
  'bebida': '🥤',
  'padaria': '🥐',
  'bebidas': '🍺',
  'café': '☕',
  'chá': '☕',
  'orgânico': '🥬',

  // Moda / acessórios
  'moda': '👗',
  'roupa': '👕',
  'sapato': '👟',
  'acessório': '👜',

  // Beleza / saúde
  'beleza': '💄',
  'cosmético': '💅',
  'saúde': '💊',
  'farmácia': '💊',

  // Pets
  'pet': '🐾',
  'cachorro': '🐶',
  'gato': '🐱',

  // Esportes / lazer
  'esporte': '🏀',
  'fitness': '🏋️',
  'camping': '🏕️',

  // Automotivo / ferramentas
  'automotivo': '🚗',
  'carro': '🚗',
  'ferramenta': '🔧',
  'construção': '🛠️',

  // Entretenimento / cultura
  'jogo': '🎮',
  'games': '🎮',
  'livro': '📚',
  'música': '🎵',
  'filme': '🎬',

  // Escritório / papelaria
  'escritório': '🗂️',
  'papelaria': '✏️',

  // Viagem / transporte
  'viagem': '✈️',
  'bicicleta': '🚲',

  // Presentes / festas
  'presente': '🎁',
  'festa': '🎉',

  // Outros genéricos
  'segurança': '🔒',
  'financeiro': '💳',
  'tecnologia': '🔌',
  'saúde': '🩺'
};

// Muito maior conjunto de ícones para fallback
// Ampliado para cobrir muitas categorias possíveis
const availableIcons = [
  '🖥️','📱','💻','🖨️','📺','🎧','🔊','📷','📸','🎮','🕹️','⌚','📟',
  '🏠','🏡','🛋️','🛏️','🛒','🍽️','🍔','🍕','🍣','🍜','🍩','🥐','🥗','🍎','🍊','🍋',
  '☕','🍵','🍷','🍺','🥂','🍾','🍹','🧋','🥤','🍫','🍪','🍨','🍦',
  '👕','👗','👠','👟','🧢','👜','💍','👑','🕶️','🧣','🧤','🧦',
  '💄','🧴','🧷','🛁','🧼','🪒','🩴',
  '⚽','🏀','🏈','🎾','🏐','🏓','🏸','🏒','🥊','🏹','🏋️','🚴','🏕️','🏊',
  '🚗','🚕','🚙','🚌','🚎','🏎️','🚲','🛵','⛵','✈️','🚀',
  '🔧','🔨','🪛','🪚','🧰','🪓','🔩',
  '📚','🎵','🎼','🎤','🎧','🎬','📽️','🎨','🖼️','✏️','📎','📐','📏','📌',
  '🐶','🐱','🐰','🐹','🐟','🦜','🐾','🌿','🌵','🌲','💐','🌺','🪴',
  '💡','🔋','🔌','🔒','🔑','🛡️','📦','🧾','💳','💰','🏆','⭐','🔥','❄️',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','✨','⚡','🪄','🔭','🧭'
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
  
  // Se nenhuma palavra-chave for encontrada, escolher um ícone de fallback
  // de forma determinística (para variedade previsível por nome)
  if (availableIcons.length === 0) return '📁';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash = hash & hash; // forçar 32-bit
  }
  const idx = Math.abs(hash) % availableIcons.length;
  return availableIcons[idx];
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
  
  // Limpar mensagens de erro
  clearNameError();
  
  // Focar no campo de nome após abertura do modal
  setTimeout(() => {
    document.getElementById('deptName').focus();
  }, 100);
}

/**
 * Fecha o modal de criação de departamento
 * Limpa os campos do formulário e mensagens de erro
 */
function closeDepartmentModal() {
  const modal = document.getElementById('departmentModal');
  modal.classList.remove('show');
  document.getElementById('departmentForm').reset();
  clearNameError();
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
  
  const name = document.getElementById('deptName').value;
  const description = document.getElementById('deptDescription').value.trim();

  // Limpar erros anteriores
  clearNameError();

  // Normalizar espaços extras e validar comprimento mínimo (RN-02)
  const normalizedForLength = name.replace(/\s+/g, ' ').trim();
  if (normalizedForLength.length < 4) {
    setNameError('O nome deve possuir pelo menos 4 caracteres');
    return;
  }

  const trimmedName = normalizedForLength; // nome final a ser enviado
  
  // Detectar automaticamente o ícone baseado no nome
  const icon = detectIconFromName(trimmedName);
  
  // Enviar dados para a API
  const dados = {
    nome: trimmedName,
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
  .then(async response => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      // RN-01 duplicidade ou RN-02 validação do backend devem mostrar mensagem abaixo do campo Nome
      if (response.status === 409 || response.status === 400) {
        const errMsg = body.erro || 'Erro no nome informado';
        setNameError(errMsg);
        return;
      }

      // Erro genérico: mostrar toast
      showToast(body.erro || 'Erro ao cadastrar departamento', 'error');
      return;
    }

    // Sucesso: mostra toast centralizado e fecha modal
    closeDepartmentModal();
    showToast(`Departamento "${trimmedName}" cadastrado com sucesso!`, 'success', { center: true });
    carregarDepartamentos();
  })
  .catch(err => {
    console.error('Erro ao cadastrar departamento:', err);
    showToast('Erro ao cadastrar departamento. Verifique se o servidor está rodando.', 'error');
  });
}

// ======= Mensagens UI helpers =======
function setNameError(message) {
  const el = document.getElementById('deptNameError');
  if (el) el.textContent = message;
}

function clearNameError() {
  const el = document.getElementById('deptNameError');
  if (el) el.textContent = '';
}

function showToast(message, type = 'success', opts = {}) {
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-body">${message}</div>
    <button class="toast-close" aria-label="Fechar">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  // Se solicitada centralização, anexa ao body e aplica classe que posiciona no centro
  if (opts.center) {
    toast.classList.add('toast-center');
    document.body.appendChild(toast);
  } else {
    if (!container) return;
    container.appendChild(toast);
  }

  // Auto remover após 5s
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// ========== CONTEXT MENU / DROPDOWN MENU ==========
/**
 * Cria e exibe um menu de contexto com opções
 * @param {Event} event - Evento do clique
 * @param {number} itemId - ID do item (departamento ou categoria)
 * @param {string} itemType - Tipo do item ('departamento' ou 'categoria')
 */
function showContextMenu(event, itemId, itemType) {
  event.stopPropagation();
  
  // Remover menu anterior, se existir
  const existingMenu = document.querySelector('.context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Criar novo menu
  const menu = document.createElement('div');
  menu.className = 'context-menu show';
  menu.innerHTML = `
    <button class="context-menu-item edit" data-id="${itemId}" data-type="${itemType}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Editar
    </button>
    <button class="context-menu-item delete" data-id="${itemId}" data-type="${itemType}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
      Excluir
    </button>
  `;
  
  // Posicionar o menu
  document.body.appendChild(menu);
  
  const rect = event.target.getBoundingClientRect();
  menu.style.top = (rect.bottom + 4) + 'px';
  menu.style.left = (rect.right - 140) + 'px';
  
  // Adicionar eventos aos itens do menu
  menu.querySelector('.edit').addEventListener('click', () => {
    handleEditItem(itemId, itemType);
    menu.remove();
  });
  
  menu.querySelector('.delete').addEventListener('click', () => {
    handleDeleteItem(itemId, itemType);
    menu.remove();
  });
}

/**
 * Fecha o menu de contexto
 */
function closeContextMenu() {
  const menu = document.querySelector('.context-menu');
  if (menu) {
    menu.classList.remove('show');
    setTimeout(() => menu.remove(), 200);
  }
}

/**
 * Manipula a ação de editar um item
 */
function handleEditItem(itemId, itemType) {
  if (itemType === 'departamento') {
    openEditDepartmentModal(itemId);
  } else if (itemType === 'categoria') {
    openEditCategoryModal(itemId);
  }
}

/**
 * Carrega dados do departamento e abre modal de edição
 */
async function openEditDepartmentModal(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/departamentos/${id}`);
    if (!response.ok) {
      showToast('Erro ao carregar departamento', 'error');
      return;
    }

    const data = await response.json();
    if (data.status !== 'success') {
      showToast('Erro ao carregar departamento', 'error');
      return;
    }

    const dept = data.data;

    // Preencher formulário
    document.getElementById('editDeptId').value = dept.id;
    document.getElementById('editDeptName').value = dept.nome;
    document.getElementById('editDeptDescription').value = dept.descricao || '';
    document.getElementById('editDeptStatus').value = dept.ativo ? '1' : '0';

    // Preencher select de ícones
    populateIconSelect('editDeptIcons', dept.icone);

    // Limpar erros
    clearEditDeptNameError();

    // Abrir modal
    document.getElementById('editDepartmentModal').classList.add('show');
    setTimeout(() => {
      document.getElementById('editDeptName').focus();
    }, 100);
  } catch (err) {
    console.error('Erro ao abrir modal de edição de departamento:', err);
    showToast('Erro ao carregar departamento', 'error');
  }
}

/**
 * Carrega dados da categoria e abre modal de edição
 */
async function openEditCategoryModal(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/categorias/${id}`);
    if (!response.ok) {
      showToast('Erro ao carregar categoria', 'error');
      return;
    }

    const data = await response.json();
    if (data.status !== 'success') {
      showToast('Erro ao carregar categoria', 'error');
      return;
    }

    const cat = data.data;

    // Preencher formulário
    document.getElementById('editCatId').value = cat.id;
    document.getElementById('editCatParentId').value = cat.id_pai || '';
    document.getElementById('editCatName').value = cat.nome;
    document.getElementById('editCatDescription').value = cat.descricao || '';
    document.getElementById('editCatStatus').value = cat.ativo ? '1' : '0';

    // Carregar opções de movimentação
    try {
      const moveResponse = await fetch(`http://localhost:3000/api/categorias/${id}/move-options`);
      if (moveResponse.ok) {
        const moveData = await moveResponse.json();
        if (moveData.status === 'success') {
          populateMoveOptions(moveData.data, cat.id_pai);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar opções de movimento:', err);
      // Continuar mesmo se não conseguir carregar opções
    }

    // Limpar erros
    clearEditCatNameError();

    // Abrir modal
    document.getElementById('editCategoryModal').classList.add('show');
    setTimeout(() => {
      document.getElementById('editCatName').focus();
    }, 100);
  } catch (err) {
    console.error('Erro ao abrir modal de edição de categoria:', err);
    showToast('Erro ao carregar categoria', 'error');
  }
}

/**
 * Preenche o select de movimentação com opções hierárquicas
 */
function populateMoveOptions(opcoes, currentIdPai) {
  const selectElement = document.getElementById('editCatNewParent');
  selectElement.innerHTML = ''; // Limpar opções anteriores

  // Opção para mover para raiz (se aplicável)
  const rootOption = document.createElement('option');
  rootOption.value = '';
  rootOption.textContent = 'Raiz (sem pai)';
  selectElement.appendChild(rootOption);

  // Adicionar todas as opções com indentação hierárquica
  opcoes.forEach(opcao => {
    const option = document.createElement('option');
    option.value = opcao.id;
    // Criar indentação visual (3 espaços por nível)
    const indentacao = '  '.repeat(opcao.nivel);
    option.textContent = `${indentacao}${opcao.nome}`;
    selectElement.appendChild(option);
  });

  // Marcar o pai atual como selected
  selectElement.value = currentIdPai || '';
}

/**
 * Fecha modal de edição de departamento
 */
function closeEditDepartmentModal() {
  const modal = document.getElementById('editDepartmentModal');
  if (modal) {
    modal.classList.remove('show');
  }
  document.getElementById('editDepartmentForm').reset();
  clearEditDeptNameError();
}

/**
 * Fecha modal de edição de categoria
 */
function closeEditCategoryModal() {
  const modal = document.getElementById('editCategoryModal');
  if (modal) {
    modal.classList.remove('show');
  }
  document.getElementById('editCategoryForm').reset();
  clearEditCatNameError();
}

/**
 * Preenche o select de ícones
 */
function populateIconSelect(selectId, selectedIcon = '') {
  const select = document.getElementById(selectId);
  if (!select) return;

  // Limpar opções existentes
  select.innerHTML = '';

  // Adicionar opção padrão
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Selecione um ícone';
  select.appendChild(defaultOption);

  // Adicionar todos os ícones disponíveis
  availableIcons.forEach(icon => {
    const option = document.createElement('option');
    option.value = icon;
    option.textContent = `${icon} ${getIconName(icon)}`;
    select.appendChild(option);
  });

  // Selecionar ícone atual
  if (selectedIcon) {
    select.value = selectedIcon;
  }
}

/**
 * Retorna um nome descritivo para o ícone
 * Mapeia todos os ícones disponíveis com seus nomes em português
 */
function getIconName(icon) {
  const names = {
    // Eletrônicos
    '🖥️': 'Computador',
    '📱': 'Celular',
    '💻': 'Notebook',
    '🖨️': 'Impressora',
    '📺': 'TV',
    '🎧': 'Fone de Ouvido',
    '🔊': 'Alto-Falante',
    '📷': 'Câmera',
    '📸': 'Câmera Fotográfica',
    '⌚': 'Relógio',
    '📟': 'Pager',
    
    // Jogos
    '🎮': 'Jogo',
    '🕹️': 'Controle de Jogo',
    
    // Casa e Móveis
    '🏠': 'Casa',
    '🏡': 'Casa de Campo',
    '🛋️': 'Sofá',
    '🛏️': 'Cama',
    '🛒': 'Carrinho de Compras',
    
    // Cozinha
    '🍽️': 'Utensílios de Cozinha',
    '🍔': 'Hambúrguer',
    '🍕': 'Pizza',
    '🍣': 'Sushi',
    '🍜': 'Macarrão',
    '🍩': 'Rosquinha',
    '🥐': 'Croissant',
    '🥗': 'Salada',
    
    // Frutas e Alimentos
    '🍎': 'Maçã',
    '🍊': 'Laranja',
    '🍋': 'Limão',
    
    // Bebidas
    '☕': 'Café',
    '🍵': 'Chá',
    '🍷': 'Vinho',
    '🍺': 'Cerveja',
    '🥂': 'Champagne',
    '🍾': 'Garrafa',
    '🍹': 'Coquetel',
    '🧋': 'Bebida de Bolha',
    '🥤': 'Bebida',
    
    // Doces
    '🍫': 'Chocolate',
    '🍪': 'Biscoito',
    '🍨': 'Sorvete',
    '🍦': 'Picolé',
    
    // Roupas
    '👕': 'Camiseta',
    '👗': 'Vestido',
    '👠': 'Sapato de Salto',
    '👟': 'Tênis',
    
    // Acessórios
    '🧢': 'Boné',
    '👜': 'Bolsa',
    '💍': 'Anel',
    '👑': 'Coroa',
    '🕶️': 'Óculos de Sol',
    '🧣': 'Cachecol',
    '🧤': 'Luvas',
    '🧦': 'Meias',
    
    // Beleza e Higiene
    '💄': 'Maquiagem',
    '🧴': 'Produto de Higiene',
    '🧷': 'Alfinete',
    '🛁': 'Banheira',
    '🧼': 'Sabonete',
    '🪒': 'Barbeador',
    '🩴': 'Chinelo',
    
    // Esportes
    '⚽': 'Futebol',
    '🏀': 'Basquete',
    '🏈': 'Futebol Americano',
    '🎾': 'Tênis',
    '🏐': 'Vôlei',
    '🏓': 'Ping-Pong',
    '🏸': 'Badminton',
    '🏒': 'Hóquei',
    '🥊': 'Boxe',
    '🏹': 'Tiro com Arco',
    '🏋️': 'Musculação',
    '🚴': 'Bicicleta',
    '🏕️': 'Camping',
    '🏊': 'Natação',
    
    // Transporte
    '🚗': 'Carro',
    '🚕': 'Táxi',
    '🚙': 'SUV',
    '🚌': 'Ônibus',
    '🚎': 'Trolley',
    '🏎️': 'Carro de Corrida',
    '🚲': 'Bicicleta',
    '🛵': 'Scooter',
    '⛵': 'Vela',
    '✈️': 'Avião',
    '🚀': 'Foguete',
    
    // Ferramentas
    '🔧': 'Chave Inglesa',
    '🔨': 'Martelo',
    '🪛': 'Parafusadeira',
    '🪚': 'Plaina',
    '🧰': 'Caixa de Ferramentas',
    '🪓': 'Motosserra',
    '🔩': 'Parafuso',
    
    // Cultura e Entretenimento
    '📚': 'Livro',
    '🎵': 'Nota Musical',
    '🎼': 'Pentagrama',
    '🎤': 'Microfone',
    '🎬': 'Filme',
    '📽️': 'Projetor de Filme',
    '🎨': 'Paleta de Pintura',
    '🖼️': 'Quadro',
    
    // Escritório
    '✏️': 'Lápis',
    '📎': 'Clipe',
    '📐': 'Esquadro',
    '📏': 'Régua',
    '📌': 'Alfinete',
    
    // Animais
    '🐶': 'Cachorro',
    '🐱': 'Gato',
    '🐰': 'Coelho',
    '🐹': 'Hamster',
    '🐟': 'Peixe',
    '🦜': 'Papagaio',
    '🐾': 'Pegada',
    
    // Natureza
    '🌿': 'Planta',
    '🌵': 'Cacto',
    '🌲': 'Árvore',
    '💐': 'Buquê',
    '🌺': 'Hibisco',
    '🪴': 'Vaso de Planta',
    
    // Energia e Segurança
    '💡': 'Lâmpada',
    '🔋': 'Bateria',
    '🔌': 'Tomada',
    '🔒': 'Cadeado',
    '🔑': 'Chave',
    '🛡️': 'Escudo',
    
    // Pacotes e Diversos
    '📦': 'Caixa',
    '🧾': 'Recibo',
    
    // Financeiro
    '💳': 'Cartão de Crédito',
    '💰': 'Dinheiro',
    
    // Prêmios e Reconhecimento
    '🏆': 'Troféu',
    
    // Outros
    '⭐': 'Estrela',
    '🔥': 'Fogo',
    '❄️': 'Gelo',
    '❤️': 'Coração Vermelho',
    '🧡': 'Coração Laranja',
    '💛': 'Coração Amarelo',
    '💚': 'Coração Verde',
    '💙': 'Coração Azul',
    '💜': 'Coração Roxo',
    '🖤': 'Coração Preto',
    '🤍': 'Coração Branco',
    '🤎': 'Coração Marrom',
    '✨': 'Brilho',
    '⚡': 'Raio',
    '🪄': 'Varinha Mágica',
    '🔭': 'Telescópio',
    '🧭': 'Bússola'
  };
  return names[icon] || icon;
}

/**
 * Salva edição de departamento
 */
function saveEditDepartment(event) {
  event.preventDefault();

  const id = document.getElementById('editDeptId').value;
  const nome = document.getElementById('editDeptName').value;
  const descricao = document.getElementById('editDeptDescription').value.trim();
  const icone = document.getElementById('editDeptIcons').value;
  const ativo = parseInt(document.getElementById('editDeptStatus').value, 10);

  // Limpar erros
  clearEditDeptNameError();

  // Validar
  const normalizedForLength = nome.replace(/\s+/g, ' ').trim();
  if (normalizedForLength.length < 4) {
    setEditDeptNameError('O nome deve possuir pelo menos 4 caracteres');
    return;
  }

  const dados = {
    nome: normalizedForLength,
    descricao: descricao,
    icone: icone,
    ativo: ativo === 1
  };

  fetch(`http://localhost:3000/api/departamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(async response => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 409 || response.status === 400) {
        const errMsg = body.erro || 'Erro ao atualizar';
        setEditDeptNameError(errMsg);
        return;
      }
      showToast(body.erro || 'Erro ao atualizar departamento', 'error');
      return;
    }

    closeEditDepartmentModal();
    showToast('Departamento atualizado com sucesso!', 'success', { center: true });
    carregarDepartamentos();
  })
  .catch(err => {
    console.error('Erro ao atualizar departamento:', err);
    showToast('Erro ao atualizar departamento', 'error');
  });
}

/**
 * Salva edição de categoria
 */
function saveEditCategory(event) {
  event.preventDefault();

  const id = document.getElementById('editCatId').value;
  const nome = document.getElementById('editCatName').value;
  const descricao = document.getElementById('editCatDescription').value.trim();
  const id_pai = document.getElementById('editCatParentId').value;
  const ativo = parseInt(document.getElementById('editCatStatus').value, 10);
  const novoIdPai = document.getElementById('editCatNewParent').value;

  // Limpar erros
  clearEditCatNameError();
  document.getElementById('editCatNewParentError').textContent = '';

  // Validar
  const normalizedForLength = nome.replace(/\s+/g, ' ').trim();
  if (normalizedForLength.length < 4) {
    setEditCatNameError('O nome deve possuir pelo menos 4 caracteres');
    return;
  }

  const dados = {
    nome: normalizedForLength,
    descricao: descricao,
    ativo: ativo === 1
  };

  // Primeiro: Atualizar dados básicos (PUT)
  fetch(`http://localhost:3000/api/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(async response => {
    const body = await response.json();
    
    if (!response.ok) {
      if (response.status === 409 || response.status === 400) {
        const errMsg = body.erro || body.message || 'Erro ao atualizar';
        setEditCatNameError(errMsg);
        return;
      }
      showToast(body.erro || body.message || 'Erro ao atualizar categoria', 'error');
      return;
    }

    // Se o pai mudou, fazer PATCH para mover
    const idPaiAtualizado = novoIdPai === '' ? null : (novoIdPai ? parseInt(novoIdPai, 10) : null);
    const idPaiAnterior = id_pai === '' ? null : (id_pai ? parseInt(id_pai, 10) : null);

    if (idPaiAtualizado !== idPaiAnterior) {
      movimentarCategoria(id, idPaiAtualizado);
    } else {
      // Sem movimento, apenas fechar e recarregar
      closeEditCategoryModal();
      showToast('Categoria atualizada com sucesso!', 'success', { center: true });
      carregarDepartamentos();
    }
  })
  .catch(err => {
    console.error('Erro ao atualizar categoria:', err);
    showToast('Erro ao atualizar categoria. Verifique o console.', 'error');
  });
}

/**
 * Move uma categoria para um novo pai
 */
function movimentarCategoria(id, novoIdPai) {
  const dados = {
    novoIdPai: novoIdPai
  };

  fetch(`http://localhost:3000/api/categorias/${id}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(async response => {
    const body = await response.json();
    
    if (!response.ok) {
      const errMsg = body.erro || body.message || 'Erro ao mover categoria';
      if (response.status === 400 || response.status === 409) {
        document.getElementById('editCatNewParentError').textContent = errMsg;
      } else {
        showToast(errMsg, 'error');
      }
      return;
    }

    closeEditCategoryModal();
    showToast('Categoria movida e atualizada com sucesso!', 'success', { center: true });
    carregarDepartamentos();
  })
  .catch(err => {
    console.error('Erro ao mover categoria:', err);
    showToast('Erro ao mover categoria. Verifique o console.', 'error');
  });
}

/**
 * Define mensagem de erro no campo nome (edição de departamento)
 */
function setEditDeptNameError(message) {
  const el = document.getElementById('editDeptNameError');
  if (el) el.textContent = message;
}

/**
 * Limpa mensagem de erro no campo nome (edição de departamento)
 */
function clearEditDeptNameError() {
  const el = document.getElementById('editDeptNameError');
  if (el) el.textContent = '';
}

/**
 * Define mensagem de erro no campo nome (edição de categoria)
 */
function setEditCatNameError(message) {
  const el = document.getElementById('editCatNameError');
  if (el) el.textContent = message;
}

/**
 * Limpa mensagem de erro no campo nome (edição de categoria)
 */
function clearEditCatNameError() {
  const el = document.getElementById('editCatNameError');
  if (el) el.textContent = '';
}

/**
 * Manipula a ação de excluir um item
 */
function handleDeleteItem(itemId, itemType) {
  if (confirm(`Tem certeza que deseja excluir este ${itemType}?`)) {
    const endpoint = itemType === 'departamento' 
      ? `http://localhost:3000/api/departamentos/${itemId}`
      : `http://localhost:3000/api/categorias/${itemId}`;

    fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(async response => {
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        showToast(body.message || `Erro ao excluir ${itemType}`, 'error');
        return;
      }

      showToast(`${itemType} excluído com sucesso!`, 'success', { center: true });
      closeContextMenu();
      carregarDepartamentos();
    })
    .catch(err => {
      console.error(`Erro ao excluir ${itemType}:`, err);
      showToast(`Erro ao excluir ${itemType}`, 'error');
    });
  }
}

// ========== EVENTO DE CARREGAMENTO ==========
/**
 * Executado quando a página carrega
 * 1. Vincula eventos aos botões
 * 2. Configura comportamento do modal
 * 3. Carrega departamentos da API
 */
document.addEventListener('DOMContentLoaded', () => {
  // Fechar menu de contexto ao clicar fora
  document.addEventListener('click', closeContextMenu);
  
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

  // Fechar modal de categoria ao clicar fora
  const catModal = document.getElementById('categoryModal');
  if (catModal) {
    catModal.addEventListener('click', (e) => {
      if (e.target === catModal) {
        closeCategoryModal();
      }
    });
  }

  // Fechar modal de edição de departamento ao clicar fora
  const editDeptModal = document.getElementById('editDepartmentModal');
  if (editDeptModal) {
    editDeptModal.addEventListener('click', (e) => {
      if (e.target === editDeptModal) {
        closeEditDepartmentModal();
      }
    });
  }

  // Fechar modal de edição de categoria ao clicar fora
  const editCatModal = document.getElementById('editCategoryModal');
  if (editCatModal) {
    editCatModal.addEventListener('click', (e) => {
      if (e.target === editCatModal) {
        closeEditCategoryModal();
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
      if (data.status === 'success' && data.data) {
        exibirDepartamentos(data.data);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar departamentos:', err);
    });
}

// ========== RENDERIZAÇÃO DA INTERFACE ==========

/**
 * Fecha todos os departamentos abertos (accordion pattern)
 * Permite apenas um departamento expandido por vez
 */
function fecharTodosDepartamentos() {
  const container = document.getElementById('departmentsContainer');
  if (!container) return;
  
  // Encontrar todos os chevrons abertos
  const chevromsAbertos = container.querySelectorAll('.chevron.open');
  chevromsAbertos.forEach(chevron => {
    chevron.classList.remove('open');
    
    // Encontrar a lista de subcategorias correspondente e fechar
    const grupo = chevron.closest('.cat-group');
    if (grupo) {
      const subList = grupo.querySelector('.sub-list');
      if (subList) {
        subList.classList.remove('open');
      }
    }
  });
}

/**
 * Exibe os departamentos carregados da API na interface
 * 
 * @param {Array} departamentos - Lista de departamentos retornados pela API
 * 
 * Renderiza cada departamento com suporte a expansão de subcategorias
 * Estrutura esperada por departamento:
 * { id, nome, descricao, icone, id_pai, ativo }
 */
function exibirDepartamentos(departamentos) {
  const container = document.getElementById('departmentsContainer');
  
  // Limpar conteúdo anterior
  container.innerHTML = '';
  
  // Se não houver departamentos, mostrar mensagem
  if (!departamentos || departamentos.length === 0) {
    container.innerHTML = '<div style="padding: 16px; color: var(--text-muted); text-align: center;">Nenhum departamento cadastrado</div>';
    return;
  }
  
  // Renderizar cada departamento
  departamentos.forEach(departamento => {
    const deptElement = criarElementoDepartamento(departamento);
    container.appendChild(deptElement);
  });
}

/**
 * Cria um elemento de departamento com suporte a expansão
 * 
 * @param {Object} departamento - Dados do departamento
 * @returns {HTMLElement} Elemento DOM do departamento
 */
function criarElementoDepartamento(departamento) {
  const grupo = document.createElement('div');
  grupo.className = 'cat-group';
  
  // Criar item principal do departamento
  const item = document.createElement('div');
  item.className = 'cat-item';
  item.id = `dept-${departamento.id}`;
  
  // Adicionar classe 'inactive' se o departamento está desativado
  if (!departamento.ativo) {
    item.classList.add('inactive');
  }
  
  // Chevron (ícone de expandir)
  const chevron = document.createElement('div');
  chevron.className = 'chevron';
  chevron.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;
  
  // Ícone do departamento
  const icone = document.createElement('div');
  icone.className = 'cat-icon';
  icone.textContent = departamento.icone || '📁';
  
  // Rótulo do departamento
  const label = document.createElement('div');
  label.className = 'cat-label';
  label.textContent = departamento.nome;
  label.title = departamento.descricao || departamento.nome;
  
  // Container de ações
  const actions = document.createElement('div');
  actions.className = 'cat-actions';
  
  // Botão de editar
  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn';
  editBtn.title = 'Editar';
  editBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  `;
  editBtn.addEventListener('click', (e) => {
    showContextMenu(e, departamento.id, 'departamento');
  });
  
  actions.appendChild(editBtn);
  
  // Montar o item do departamento
  item.appendChild(chevron);
  item.appendChild(icone);
  item.appendChild(label);
  item.appendChild(actions);
  
  // Criar lista de subcategorias
  const subList = document.createElement('div');
  subList.className = 'sub-list';
  subList.id = `sublist-${departamento.id}`;
  
  // Adicionar evento de clique para expandir/recolher e selecionar
  item.addEventListener('click', () => {
    // Selecionar o departamento
    selectItem(item);
    
    const isOpen = chevron.classList.contains('open');
    
    if (!isOpen) {
      // Fechar todos os outros departamentos abertos
      fecharTodosDepartamentos();
      
      // Carregar categorias filhas se não estiverem carregadas
      carregarCategorias(departamento.id, subList, chevron, departamento.ativo);
    } else {
      // Apenas recolher
      chevron.classList.remove('open');
      subList.classList.remove('open');
    }
  });
  
  // Montar o grupo
  grupo.appendChild(item);
  grupo.appendChild(subList);
  
  return grupo;
}

/**
 * Carrega as categorias filhas de um departamento
 * 
 * @param {number} id_pai - ID do departamento pai
 * @param {HTMLElement} subList - Container para listar as subcategorias
 * @param {HTMLElement} chevron - Ícone de chevron a ser atualizado
 * @param {boolean} parentActive - Se o pai está ativo (afeta renderização de filhos)
 */
function carregarCategorias(id_pai, subList, chevron, parentActive = true) {
  fetch(`http://localhost:3000/api/categorias?id_pai=${id_pai}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success' && data.data) {
        exibirCategorias(data.data, subList, chevron, parentActive);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar categorias:', err);
      showToast('Erro ao carregar categorias', 'error');
    });
}

/**
 * Exibe as categorias filhas na interface
 * 
 * @param {Array} categorias - Lista de categorias filhas
 * @param {HTMLElement} subList - Container para listar as subcategorias
 * @param {HTMLElement} chevron - Ícone de chevron a ser atualizado
 * @param {boolean} parentActive - Se o pai está ativo
 */
function exibirCategorias(categorias, subList, chevron, parentActive = true) {
  // Limpar conteúdo anterior
  subList.innerHTML = '';

  // Extrair id_pai do id do subList (formato: sublist-<id>)
  const parentId = parseInt((subList.id || '').replace('sublist-', ''), 10) || null;

  // Se não houver categorias, mostrar mensagem
  if (!categorias || categorias.length === 0) {
    const mensagem = document.createElement('div');
    mensagem.style.cssText = 'padding: 12px 50px; color: var(--text-muted); font-size: 12px;';
    mensagem.textContent = 'Sem categorias';
    subList.appendChild(mensagem);
  } else {
    // Renderizar cada categoria
    categorias.forEach(categoria => {
      const subItem = criarElementoCategoria(categoria, parentActive);
      subList.appendChild(subItem);
    });
  }

  // Botão para adicionar nova categoria (aparece sempre abaixo das categorias)
  const addBtn = document.createElement('button');
  addBtn.className = 'add-sub-btn';
  addBtn.type = 'button';
  addBtn.innerHTML = `
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
    Adicionar categoria
  `;
  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (parentId) openCategoryModal(parentId);
  });
  subList.appendChild(addBtn);

  // Abrir a lista e mudar o ícone do chevron
  if (chevron) chevron.classList.add('open');
  subList.classList.add('open');
}

/**
 * Fecha todas as categorias irmãs (do mesmo nível) que estão abertas
 * Mantém apenas a categoria atual aberta
 */
function fecharTodasCategorias(grupoAtual) {
  // Encontrar o container pai (sub-list que contém as categorias irmãs)
  const containerPai = grupoAtual.parentElement;
  if (!containerPai || !containerPai.classList.contains('sub-list')) return;
  
  // Encontrar todos os grupos de categorias irmãs com chevron aberto
  const gruposAbertos = containerPai.querySelectorAll('.cat-subgroup .chevron.open');
  gruposAbertos.forEach(chevronAberto => {
    // Pular o chevron do grupo atual
    const grupo = chevronAberto.closest('.cat-subgroup');
    if (grupo === grupoAtual) return;
    
    // Fechar o chevron
    chevronAberto.classList.remove('open');
    
    // Fechar a sub-lista correspondente
    const subList = grupo.querySelector('.sub-list');
    if (subList) subList.classList.remove('open');
  });
}

/**
 * Obtém todos os ancestrais de um item na árvore (pais, avós, etc.)
 * Retorna um array de elementos do tipo .cat-item ou .cat-subitem
 * 
 * @param {HTMLElement} itemElement - Elemento .cat-item ou .cat-subitem
 * @returns {Array<HTMLElement>} Array com o item e todos seus ancestrais
 */
function getAncestorsPath(itemElement) {
  const path = [itemElement];
  let current = itemElement;
  
  // Navegar para cima na árvore
  while (current) {
    // Encontrar o grupo contendo o item atual (.cat-group ou .cat-subgroup)
    const group = current.closest('.cat-group') || current.closest('.cat-subgroup');
    if (!group) break;
    
    // Encontrar o sub-list que contém este grupo
    const subList = group.parentElement;
    if (!subList || !subList.classList.contains('sub-list')) break;
    
    // Encontrar o grupo pai que contém aquele sub-list
    const parentGroup = subList.closest('.cat-group') || subList.closest('.cat-subgroup');
    if (!parentGroup) break;
    
    // Encontrar o item (.cat-item ou .cat-subitem) dentro do grupo pai
    let parentItem = null;
    if (parentGroup.classList.contains('cat-group')) {
      parentItem = parentGroup.querySelector('.cat-item');
    } else if (parentGroup.classList.contains('cat-subgroup')) {
      parentItem = parentGroup.querySelector('.cat-subitem');
    }
    
    if (!parentItem) break;
    
    path.unshift(parentItem); // Adicionar ao início do caminho
    current = parentItem;
  }
  
  return path;
}

/**
 * Seleciona um item (departamento ou categoria) marcando-o como ativo
 * Marca também todos os seus ancestrais (pais, avós) como ativos
 * Cria um "caminho" visual dentro da árvore mercadológica
 * 
 * @param {HTMLElement} itemElement - Elemento .cat-item ou .cat-subitem a ser selecionado
 */
function selectItem(itemElement) {
  // Remover .active de todos os departamentos e categorias
  document.querySelectorAll('.cat-item.active, .cat-subitem.active').forEach(item => {
    item.classList.remove('active');
  });
  
  if (!itemElement) return;
  
  // Obter o caminho completo (item + todos os ancestrais)
  const path = getAncestorsPath(itemElement);
  
  // Adicionar .active a todos os itens do caminho
  path.forEach(item => {
    item.classList.add('active');
  });
}

/**
 * Cria um elemento de categoria filha
 * 
 * @param {Object} categoria - Dados da categoria
 * @returns {HTMLElement} Elemento DOM da categoria
 */
function criarElementoCategoria(categoria, parentActive = true) {
  const grupo = document.createElement('div');
  grupo.className = 'cat-subgroup';
  grupo.id = `catgroup-${categoria.id}`;
  
  // Criar item principal da categoria
  const item = document.createElement('div');
  item.className = 'cat-subitem';
  item.id = `cat-${categoria.id}`;
  
  // Adicionar classe 'inactive' se a categoria está desativada ou se o pai está desativado
  if (!categoria.ativo || !parentActive) {
    item.classList.add('inactive');
  }
  
  // Chevron (ícone de expandir)
  const chevron = document.createElement('div');
  chevron.className = 'chevron';
  chevron.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;
  
  // Rótulo da categoria
  const label = document.createElement('div');
  label.className = 'cat-label';
  label.textContent = categoria.nome;
  label.title = categoria.descricao || categoria.nome;
  
  // Container de ações
  const actions = document.createElement('div');
  actions.className = 'cat-actions';
  
  // Botão de editar
  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn';
  editBtn.title = 'Editar';
  editBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  `;
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showContextMenu(e, categoria.id, 'categoria');
  });
  
  actions.appendChild(editBtn);
  
  // Montar o item da categoria
  item.appendChild(chevron);
  item.appendChild(label);
  item.appendChild(actions);
  
  // Criar lista de subcategorias
  const subList = document.createElement('div');
  subList.className = 'sub-list';
  subList.id = `sublist-${categoria.id}`;
  
  // Adicionar evento de clique para expandir/recolher e selecionar
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Selecionar a categoria
    selectItem(item);
    
    const isOpen = chevron.classList.contains('open');
    
    if (!isOpen) {
      // Fechar todas as categorias irmãs abertas
      fecharTodasCategorias(grupo);
      
      // Carregar subcategorias se não estiverem carregadas
      carregarCategorias(categoria.id, subList, chevron, categoria.ativo);
    } else {
      // Apenas recolher
      chevron.classList.remove('open');
      subList.classList.remove('open');
    }
  });
  
  // Montar o grupo
  grupo.appendChild(item);
  grupo.appendChild(subList);
  
  return grupo;
}

// ========== MODAL: CRIAÇÃO DE CATEGORIA (SUB) ==========
function openCategoryModal(id_pai) {
  const modal = document.getElementById('categoryModal');
  if (!modal) return;
  document.getElementById('categoryForm').reset();
  clearCatNameError();
  document.getElementById('catParentId').value = id_pai;
  modal.classList.add('show');
  setTimeout(() => { document.getElementById('catName').focus(); }, 80);
}

function closeCategoryModal() {
  const modal = document.getElementById('categoryModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.getElementById('categoryForm').reset();
  clearCatNameError();
}

function setCatNameError(message) {
  const el = document.getElementById('catNameError');
  if (el) el.textContent = message;
}

function clearCatNameError() {
  const el = document.getElementById('catNameError');
  if (el) el.textContent = '';
}

function saveCategory(event) {
  event.preventDefault();
  const name = document.getElementById('catName').value || '';
  const description = document.getElementById('catDescription').value || '';
  const id_pai = parseInt(document.getElementById('catParentId').value, 10);

  clearCatNameError();

  const normalizedForLength = name.replace(/\s+/g, ' ').trim();
  if (normalizedForLength.length < 4) {
    setCatNameError('O nome deve possuir pelo menos 4 caracteres');
    return;
  }

  const dados = { nome: normalizedForLength, descricao: description.trim(), id_pai };

  fetch('http://localhost:3000/api/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(async response => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 409 || response.status === 400) {
        const errMsg = body.erro || 'Erro no nome informado';
        setCatNameError(errMsg);
        return;
      }
      showToast(body.erro || 'Erro ao cadastrar categoria', 'error');
      return;
    }

    closeCategoryModal();
    showToast(`Categoria "${normalizedForLength}" cadastrada com sucesso!`, 'success', { center: true });

    // Recarregar as categorias do pai recém-criado
    const subList = document.getElementById(`sublist-${id_pai}`);
    const chevron = document.querySelector(`#catgroup-${id_pai} .chevron, #dept-${id_pai} .chevron`);
    if (subList) {
      carregarCategorias(id_pai, subList, chevron);
    } else {
      // Se não encontrarmos o subList, recarregar todos os departamentos
      carregarDepartamentos();
    }
  })
  .catch(err => {
    console.error('Erro ao cadastrar categoria:', err);
    showToast('Erro ao cadastrar categoria. Verifique se o servidor está rodando.', 'error');
  });
}
