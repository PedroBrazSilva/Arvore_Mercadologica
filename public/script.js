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

  // Fechar modal de categoria ao clicar fora
  const catModal = document.getElementById('categoryModal');
  if (catModal) {
    catModal.addEventListener('click', (e) => {
      if (e.target === catModal) {
        closeCategoryModal();
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
  // TODO: Adicionar botões de editar/deletar se necessário
  
  // Montar o item do departamento
  item.appendChild(chevron);
  item.appendChild(icone);
  item.appendChild(label);
  item.appendChild(actions);
  
  // Criar lista de subcategorias
  const subList = document.createElement('div');
  subList.className = 'sub-list';
  subList.id = `sublist-${departamento.id}`;
  
  // Adicionar evento de clique para expandir/recolher
  item.addEventListener('click', () => {
    const isOpen = chevron.classList.contains('open');
    
    if (!isOpen) {
      // Fechar todos os outros departamentos abertos
      fecharTodosDepartamentos();
      
      // Carregar categorias filhas se não estiverem carregadas
      carregarCategorias(departamento.id, subList, chevron);
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
 */
function carregarCategorias(id_pai, subList, chevron) {
  fetch(`http://localhost:3000/api/categorias?id_pai=${id_pai}`)
    .then(response => response.json())
    .then(data => {
      if (data.sucesso && data.dados) {
        exibirCategorias(data.dados, subList, chevron);
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
 */
function exibirCategorias(categorias, subList, chevron) {
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
      const subItem = criarElementoCategoria(categoria);
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
 * Cria um elemento de categoria filha
 * 
 * @param {Object} categoria - Dados da categoria
 * @returns {HTMLElement} Elemento DOM da categoria
 */
function criarElementoCategoria(categoria) {
  const grupo = document.createElement('div');
  grupo.className = 'cat-subgroup';
  grupo.id = `catgroup-${categoria.id}`;
  
  // Criar item principal da categoria
  const item = document.createElement('div');
  item.className = 'cat-subitem';
  item.id = `cat-${categoria.id}`;
  
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
  
  // Montar o item da categoria
  item.appendChild(chevron);
  item.appendChild(label);
  item.appendChild(actions);
  
  // Criar lista de subcategorias
  const subList = document.createElement('div');
  subList.className = 'sub-list';
  subList.id = `sublist-${categoria.id}`;
  
  // Adicionar evento de clique para expandir/recolher
  item.addEventListener('click', () => {
    const isOpen = chevron.classList.contains('open');
    
    if (!isOpen) {
      // Carregar subcategorias se não estiverem carregadas
      carregarCategorias(categoria.id, subList, chevron);
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

  const icon = detectIconFromName(normalizedForLength);

  const dados = { nome: normalizedForLength, descricao: description.trim(), icone: icon, id_pai };

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
    const chevron = document.querySelector(`#dept-${id_pai} .chevron`);
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
