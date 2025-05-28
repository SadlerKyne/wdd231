document.getElementById("currentYear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = "Last Updated: " + document.lastModified;

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('wireframeModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalButton = document.querySelector('.modal-close');
    const wireframeThumbnails = document.querySelectorAll('.wireframe-item img');

    if (!modal || !modalImage || !closeModalButton) {
        console.error("One or more modal elements were not found. Check IDs/classes.");
        return;
    }

    wireframeThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const fullSrc = this.getAttribute('data-fullsrc');
            const captionText = this.getAttribute('data-caption');

            if (fullSrc) {
                modalImage.src = fullSrc;
                modalImage.alt = captionText || "Enlarged wireframe view";
                modalImage.classList.remove('modal-image-zoomed');
                modal.classList.add('modal-visible');
                closeModalButton.focus();
            } else {
                console.error("Missing 'data-fullsrc' attribute on clicked thumbnail:", this);
            }
        });
    });

    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('modal-visible');
        modalImage.classList.remove('modal-image-zoomed');
    });

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('modal-visible');
            modalImage.classList.remove('modal-image-zoomed');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('modal-visible')) {
            modal.classList.remove('modal-visible');
            modalImage.classList.remove('modal-image-zoomed');
        }
    });

    modalImage.addEventListener('click', function() {
        this.classList.toggle('modal-image-zoomed');
        if (this.classList.contains('modal-image-zoomed')) {
            modal.scrollTop = (this.offsetHeight - modal.clientHeight) / 2;
            modal.scrollLeft = (this.offsetWidth - modal.clientWidth) / 2;
        }
    });
});