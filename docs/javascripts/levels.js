document.addEventListener('DOMContentLoaded', function() {
  const levelSwitch = document.getElementById('level-switch');
  const switchLabel = document.querySelector('.switch-label');
  const savedLevel = localStorage.getItem('userLevel') || 'beginner';
  
  // Initialiser l'état du switch
  levelSwitch.checked = savedLevel === 'expert';
  updateSwitchLabel();
  
  addLevelTags();
  filterContent(savedLevel);

  levelSwitch.addEventListener('change', function() {
    const selectedLevel = this.checked ? 'expert' : 'beginner';
    localStorage.setItem('userLevel', selectedLevel);
    updateSwitchLabel();
    filterContent(selectedLevel);
  });

  function updateSwitchLabel() {
    switchLabel.textContent = levelSwitch.checked ? 'Expert' : 'Beginner';
  }
});

function addLevelTags() {
  const allContent = document.querySelectorAll('[data-level]');
  allContent.forEach(element => {
    const level = element.dataset.level;
    if (level) {
      const tag = document.createElement('span');
      tag.className = `level-tag level-${level}`;
      tag.textContent = level.charAt(0).toUpperCase() + level.slice(1);
      element.insertBefore(tag, element.firstChild);
    }
  });
}

function filterContent(level) {
  const articleContent = document.querySelector('.article-content');
  if (articleContent) {
    const sections = articleContent.querySelectorAll('.collapse-section');
    sections.forEach(section => {
      const h2Element = section.querySelector('h2');
      const sectionLevel = h2Element ? h2Element.dataset.level : null;
      
      if (level === 'expert') {
        // En mode expert, toutes les sections sont visibles
        section.classList.remove('hidden-level');
      } else if (level === 'beginner') {
        if (sectionLevel === 'beginner') {
          section.classList.r        } else {
          section.classList.add('hidden-level');
        }
      }
    });
  }
}