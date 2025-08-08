
function getAlgoliaConfig() {
  return window.ALGOLIA_CONFIG;
}
let isAlgoliaMode = false;
let algoliaInitialized = false;

function getSearchMode() {
  try {
    const saved = localStorage.getItem('searchMode');
    if (saved) return saved === 'algolia';
    const config = getAlgoliaConfig();
    return config.default_algolia || false;
  } catch {
    return false;
  }
}

function saveSearchMode(mode) {
  try {
    localStorage.setItem('searchMode', mode ? 'algolia' : 'native');
  } catch {}
}

function updateSearchMode(useAlgolia) {
  isAlgoliaMode = useAlgolia;
  document.body.className = useAlgolia ? 'search-mode-algolia' : 'search-mode-native';
  
  const label = document.querySelector('.search-mode-label');
  if (label) label.textContent = useAlgolia ? 'Algolia' : 'Native Search';
  
  if (useAlgolia) {
    initAlgolia();
  } else {
    cleanupAlgolia();
  }
}

function initAlgolia() {
  if (typeof docsearch === 'undefined') {
    return;
  }
  
  const config = getAlgoliaConfig();
  let container = document.querySelector('.algolia-search-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'algolia-search-container';
    document.body.appendChild(container);
  }
  
  // Initialize docsearch only the first time
  if (!algoliaInitialized) {
    container.innerHTML = '';
    try {
      docsearch({
        appId: config.app_id,
        apiKey: config.api_key,
        indexName: config.index_name,
        container: container,
        transformItems: window.ALGOLIA_TRANSFORM_ITEMS || function(items) { return items; }
      });
      algoliaInitialized = true;
    } catch (error) {
      // Auto-fallback to native search
      isAlgoliaMode = false;
      const switchElement = document.getElementById('search-mode-switch');
      if (switchElement) switchElement.checked = false;
      updateSearchMode(false);
      return;
    }
  }
  
  // Setup event handlers (in case they were cleaned up)
  const searchIcon = document.querySelector('label[for="__search"]');
  const searchInput = document.querySelector('input[data-md-component="search-query"]');
  
  if (searchIcon) {
    searchIcon.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const button = container.querySelector('button');
      setTimeout(() => button?.click(), 10);
    };
  }
  if (searchInput) {
    const algoliaHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const button = container.querySelector('button');
      setTimeout(() => button?.click(), 10);
    };
    searchInput.onfocus = algoliaHandler;
    searchInput.onclick = algoliaHandler;
  }
}

function cleanupAlgolia() {
 const searchIcon = document.querySelector('label[for="__search"]');
  const searchInput = document.querySelector('input[data-md-component="search-query"]');
  
  if (searchIcon) {
    searchIcon.onclick = null;
  }
  if (searchInput) {
    searchInput.onfocus = null;
    searchInput.onclick = null;
  }
  
  const container = document.querySelector('.algolia-search-container'); 
}
function init() {
  const switchElement = document.getElementById('search-mode-switch');
  if (!switchElement) {
    return;
  }
  
  if (typeof docsearch === 'undefined') {
    document.querySelector('.search-mode-item')?.style.setProperty('display', 'none');
    return;
  }
  isAlgoliaMode = getSearchMode();
  switchElement.checked = isAlgoliaMode;
  updateSearchMode(isAlgoliaMode);
  
  switchElement.onchange = () => {
    isAlgoliaMode = switchElement.checked;
    saveSearchMode(isAlgoliaMode);
    updateSearchMode(isAlgoliaMode);
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
