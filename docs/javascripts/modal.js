document.addEventListener('DOMContentLoaded', function () {
    const openModal = () => {
        console.log('Opening modal...');
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');
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
        }
    });

    // Export the openModal function to be used in other scripts
    window.openModal = openModal;
});
