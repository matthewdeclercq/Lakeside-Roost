// JavaScript for simple vertical stacking layout
const postcards = document.querySelectorAll('.postcard');

function applySimpleLayout() {
    postcards.forEach(postcard => {
        postcard.style.top = '';
        postcard.style.left = '';
        postcard.style.transform = '';
        postcard.style.zIndex = '';
        postcard.style.position = 'relative';
        postcard.dataset.dragged = '';
    });
}

// Apply layout on load and on resize
applySimpleLayout();
window.addEventListener('resize', applySimpleLayout);

// Gallery modal logic (if present)
const galleryBtn = document.getElementById('open-gallery');
if (galleryBtn) {
    galleryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('gallery-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.getElementById('gallery-modal').focus();
    });
}

