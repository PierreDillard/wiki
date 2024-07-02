
let levelSwitch, switchLabel;


function initializeLevelManagement() {
    levelSwitch = document.getElementById('level-switch');
    switchLabel = document.querySelector('.switch-label');
    const savedLevel = localStorage.getItem('userLevel') || 'beginner';
    
    console.log('savedLevel', savedLevel);
    
    levelSwitch.checked = savedLevel === 'expert';
    updateSwitchLabel();
    
    addLevelTags();
    filterContent(savedLevel);

    levelSwitch.addEventListener('change', handleLevelChange);
}

function handleLevelChange() {
    const selectedLevel = levelSwitch.checked ? 'expert' : 'beginner';
    localStorage.setItem('userLevel', selectedLevel);
    updateSwitchLabel();
    filterContent(selectedLevel);
}


function updateSwitchLabel() {
    switchLabel.textContent = levelSwitch.checked ? 'Expert' : 'Beginner';
}

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
            const isAllSection = h2Element && h2Element.dataset.level === 'all';
            const span = section.querySelector('.level-tag');
            
            if (level === 'expert' || isAllSection) {
                handleExpertOrAllSection(section, span, level, isAllSection);
            } else if (level === 'beginner') {
                handleBeginnerSection(section, sectionLevel, isAllSection, span);
            }

            if (isAllSection) {
                section.classList.add('active');
            }
        });
    }
}

function handleExpertOrAllSection(section, span, level, isAllSection) {
    section.classList.remove('hidden-level');
    if (span && level === 'expert' || isAllSection) {
        span.style.display = 'none';
    }
}


function handleBeginnerSection(section, sectionLevel, isAllSection, span) {
    if (sectionLevel === 'beginner' || isAllSection) {
        section.classList.remove('hidden-level');
        if (span) {
            span.style.display = ''; // Display the tag "beginner"
        }
    } else {
        section.classList.add('hidden-level');
    }
}


document.addEventListener('DOMContentLoaded', initializeLevelManagement);