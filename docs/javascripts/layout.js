function setMaxContentHeight() {
    const contentWrapper = document.querySelector('.content-wrapper');
    const collapseSections = document.querySelectorAll('.collapse-section');
    let totalHeight = 0;
console.log("Function setMaxContentHeight Appellée !!")
    // Calculating the total height of all sections
    collapseSections.forEach(section => {
        totalHeight += section.querySelector('h2').offsetHeight; 
        const content = section.querySelector('.collapse-content');
        if (content) {
            const originalDisplay = content.style.display;
            content.style.display = 'block';
            totalHeight += content.offsetHeight;
            content.style.display = originalDisplay;
        }
    });

  
    totalHeight += 10; 

  
    contentWrapper.style.minHeight = `${totalHeight}px`;

    // Adjusting the height of the last hidden section
    const lastHiddenSection = document.querySelector('.collapse-section.hidden-level:last-of-type');
    const lastActiveSection = document.querySelector('.collapse-section.active:last-of-type');
    if (lastHiddenSection && lastActiveSection) {
        lastHiddenSection.style.height = `${lastActiveSection.offsetHeight}px`;
    }
}


window.addEventListener('load', setMaxContentHeight);
window.addEventListener('resize', setMaxContentHeight);