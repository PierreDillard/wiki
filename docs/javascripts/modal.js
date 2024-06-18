document.addEventListener('DOMContentLoaded', function () {
    const openModal = () => {
        console.log('Opening modal...');
        const modal = document.getElementById('modal');
        // const keywordCloud = document.querySelector('.words-cloud');
        
        // // Get the bounding rectangle of the keyword cloud
        // const keywordCloudRect = keywordCloud.getBoundingClientRect();
        
        // // Set the position of the modal relative to the keyword cloud
        // modal.style.top = `${keywordCloudRect.top + window.scrollY}px`;
        // modal.style.left = `${keywordCloudRect.left + keywordCloudRect.width + 20}px`; // Adjust the offset as needed
        
        modal.classList.remove('hidden');
        modal.style.display = 'block'; 
        console.log('Modal classes:', modal.classList);
        console.log('Modal content:', modal.innerHTML);
    };

    document.getElementById('close-modal').addEventListener('click', function () {
        console.log('Closing modal...');
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
    });

    document.getElementById('modal').addEventListener('click', function (event) {
        if (event.target === event.currentTarget) {
            console.log('Closing modal by clicking outside content...');
            const modal = document.getElementById('modal');
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    });

    // Export the openModal function to be used in other scripts
    window.openModal = openModal;
});

