// JavaScript for dynamic layout and dragging
const postcards = document.querySelectorAll('.postcard');
let currentMaxZ = 10;
let draggedCard = null;
let offsetX = 0;
let offsetY = 0;
let isMobile = window.matchMedia("(max-width: 768px)").matches;

// Function to bring postcard to front
function bringToFront() {
    if (!draggedCard) {
        this.style.zIndex = currentMaxZ;
        currentMaxZ++;
    }
}

function applyDesktopLayout() {
    const cardCount = postcards.length;
    const marginX = 40; // px, horizontal margin from edges
    const marginY = 40; // px, vertical margin from edges
    const availableWidth = window.innerWidth - marginX * 2;
    const availableHeight = window.innerHeight - marginY * 2;
    const spacingX = availableWidth / (cardCount + 1);
    const spacingY = availableHeight / (cardCount + 1);

    postcards.forEach((postcard, i) => {
        postcard.removeEventListener('mousedown', startDragging);
        postcard.removeEventListener('touchstart', startDragging);
        postcard.removeEventListener('click', bringToFront);

        postcard.style.width = '';
        postcard.style.height = '';
        postcard.style.position = 'absolute';
        postcard.style.transform = '';

        requestAnimationFrame(() => {
            const rect = postcard.getBoundingClientRect();

            // Reverse the order: first card is at the right, last at the left
            const xIndex = cardCount - i;
            const leftRaw = marginX + spacingX * xIndex - rect.width / 2 + (Math.random() - 0.5) * 30;

            // Clamp left so card stays fully on screen
            const left = Math.max(marginX, Math.min(leftRaw, window.innerWidth - marginX - rect.width));

            // Same for top
            const topRaw = marginY + spacingY * (i + 1) - rect.height / 2 + (Math.random() - 0.5) * 30;
            const top = Math.max(marginY, Math.min(topRaw, window.innerHeight - marginY - rect.height));

            const rotation = -10 + Math.random() * 20;

            postcard.style.left = `${left}px`;
            postcard.style.top = `${top}px`;
            postcard.style.transform = `rotate(${rotation}deg)`;
            postcard.style.zIndex = cardCount - i;

            postcard.addEventListener('click', bringToFront);
            postcard.addEventListener('mousedown', startDragging);
            postcard.addEventListener('touchstart', startDragging);
        });
    });
}

function applyMobileLayout() {
    postcards.forEach(postcard => {
        // Remove desktop event listeners
        postcard.removeEventListener('mousedown', startDragging);
        postcard.removeEventListener('touchstart', startDragging);
        postcard.removeEventListener('click', bringToFront);

        // Reset styles for vertical stacking
        postcard.style.top = '';
        postcard.style.left = '';
        postcard.style.transform = '';
        postcard.style.zIndex = '';
        postcard.style.position = 'relative';
        postcard.dataset.dragged = ''; // Clear dragged state
    });
}

function applyLayout() {
    const newIsMobile = window.matchMedia("(max-width: 768px)").matches;
    if (newIsMobile !== isMobile) {
        // Only re-render when crossing breakpoint
        isMobile = newIsMobile;
        if (isMobile) {
            applyMobileLayout();
        } else {
            applyDesktopLayout();
        }
    } else if (!isMobile && !postcards[0].style.top) {
        // Force desktop layout if no positions set (initial load fix)
        applyDesktopLayout();
    }
}

function startDragging(e) {
    // Don't drag if clicking on a copyable element or a link/button
    if (e.target.closest('.copyable, a, button')) return;

    e.preventDefault();
    draggedCard = this;
    this.style.zIndex = currentMaxZ;
    currentMaxZ++;
    this.dataset.dragged = 'true'; // Mark as dragged

    const rect = this.getBoundingClientRect();
    if (e.type === 'mousedown') {
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    } else if (e.type === 'touchstart') {
        const touch = e.touches[0];
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        // Touch drag/tap distinction
        let dragStartY = touch.clientY;
        let dragStartX = touch.clientX;
        let isDragging = false;
        const moveHandler = (moveEvent) => {
            const moveTouch = moveEvent.touches[0];
            const diffY = Math.abs(moveTouch.clientY - dragStartY);
            const diffX = Math.abs(moveTouch.clientX - dragStartX);
            if (diffY > 10 || diffX > 10) {
                isDragging = true;
            }
        };
        const endHandler = (endEvent) => {
            if (!isDragging) {
                // This was a tap, let the event bubble to links/buttons
                draggedCard = null;
            }
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endHandler);
        };
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('touchend', endHandler);
    }
}

// Handle dragging movement
document.addEventListener('mousemove', e => {
    if (draggedCard) {
        e.preventDefault();
        const x = (e.clientX - offsetX) / window.innerWidth * 100;
        const y = (e.clientY - offsetY) / window.innerHeight * 100;
        draggedCard.style.left = `${x}vw`;
        draggedCard.style.top = `${y}vh`;
    }
});

document.addEventListener('touchmove', e => {
    if (draggedCard) {
        e.preventDefault();
        const touch = e.touches[0];
        const x = (touch.clientX - offsetX) / window.innerWidth * 100;
        const y = (touch.clientY - offsetY) / window.innerHeight * 100;
        draggedCard.style.left = `${x}vw`;
        draggedCard.style.top = `${y}vh`;
    }
});

// Stop dragging
document.addEventListener('mouseup', () => {
    draggedCard = null;
});

document.addEventListener('touchend', () => {
    draggedCard = null;
});

// Apply layout on load
applyLayout();

// Optimize resize handling
window.addEventListener('resize', () => {
    applyLayout();
});

document.getElementById('open-gallery').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('gallery-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('gallery-modal').focus();
});

