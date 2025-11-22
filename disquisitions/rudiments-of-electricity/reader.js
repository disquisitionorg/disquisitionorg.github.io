// ==================== SIDEBAR TOGGLE ====================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const bookContent = document.getElementById('bookContent');
const readerControls = document.getElementById('readerControls');

let sidebarOpen = true;

sidebarToggle.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
        sidebar.classList.remove('hidden');
        bookContent.classList.remove('sidebar-closed');
        bookContent.classList.add('sidebar-open');
        readerControls.classList.add('sidebar-open');
    } else {
        sidebar.classList.add('hidden');
        bookContent.classList.add('sidebar-closed');
        bookContent.classList.remove('sidebar-open');
        readerControls.classList.remove('sidebar-open');
    }
});

// ==================== FULLSCREEN TOGGLE ====================
const fullscreenToggle = document.getElementById('fullscreenToggle');
const readerContainer = document.getElementById('readerContainer');

fullscreenToggle.addEventListener('click', () => {
    readerContainer.classList.toggle('fullscreen');
});

// Exit fullscreen on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && readerContainer.classList.contains('fullscreen')) {
        readerContainer.classList.remove('fullscreen');
    }
});

// ==================== SETTINGS PANEL ====================
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');

settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
});

// Close settings when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsToggle.contains(e.target)) {
        settingsPanel.classList.remove('active');
    }
});

// ==================== FONT SIZE ====================
const fontSizeBtns = document.querySelectorAll('[data-size]');
const bookInner = document.querySelector('.book-inner');

fontSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fontSizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const size = btn.dataset.size;
        if (size === 'small') {
            bookInner.style.fontSize = '1rem';
        } else if (size === 'medium') {
            bookInner.style.fontSize = '1.1rem';
        } else if (size === 'large') {
            bookInner.style.fontSize = '1.25rem';
        }
    });
});

// ==================== LINE SPACING ====================
const spacingBtns = document.querySelectorAll('[data-spacing]');

spacingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        spacingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const spacing = btn.dataset.spacing;
        if (spacing === 'compact') {
            bookInner.style.lineHeight = '1.6';
        } else if (spacing === 'comfortable') {
            bookInner.style.lineHeight = '1.8';
        } else if (spacing === 'relaxed') {
            bookInner.style.lineHeight = '2.0';
        }
    });
});

// ==================== FONT FAMILY ====================
const fontBtns = document.querySelectorAll('[data-font]');

fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const font = btn.dataset.font;
        if (font === 'serif') {
            document.body.style.fontFamily = "'Lora', Georgia, serif";
        } else if (font === 'sans') {
            document.body.style.fontFamily = "'Inter', -apple-system, sans-serif";
        }
    });
});

// ==================== VIEW MODE ====================
const viewModeBtns = document.querySelectorAll('[data-mode]');

viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.mode;
        // For now, just continuous mode works
        // Single and Two-page modes would require more complex implementation
        console.log('View mode:', mode);
    });
});

// ==================== TABLE OF CONTENTS ====================
// Expand/collapse chapter sections
const chapterItems = document.querySelectorAll('.chapter-item');

chapterItems.forEach(item => {
    item.addEventListener('click', () => {
        const chapterId = item.dataset.chapter;
        const sectionList = document.getElementById(`sections-${chapterId}`);
        
        if (sectionList) {
            sectionList.classList.toggle('expanded');
        }
    });
});

// Smooth scroll for TOC links
const tocLinks = document.querySelectorAll('.toc a');

tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== SCROLL SPY (Highlight active section) ====================
const sections = document.querySelectorAll('.chapter, .section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active from all links
            tocLinks.forEach(link => link.classList.remove('active'));
            
            // Add active to current section
            const id = entry.target.id;
            const activeLink = document.querySelector(`.toc a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                
                // Expand parent chapter if this is a section
                const parentChapter = entry.target.closest('.chapter');
                if (parentChapter && parentChapter.id !== id) {
                    const chapterId = parentChapter.id;
                    const sectionList = document.getElementById(`sections-${chapterId}`);
                    if (sectionList) {
                        sectionList.classList.add('expanded');
                    }
                }
            }
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
});

sections.forEach(section => {
    observer.observe(section);
});

// ==================== SEARCH IN BOOK ====================
const sidebarSearch = document.getElementById('sidebarSearch');

sidebarSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    tocLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const listItem = link.parentElement;
        
        if (text.includes(query) || query === '') {
            listItem.style.display = 'block';
        } else {
            listItem.style.display = 'none';
        }
    });
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // F for fullscreen
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            readerContainer.classList.toggle('fullscreen');
        }
    }
    
    // S for sidebar
    if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            sidebarToggle.click();
        }
    }
    
    // Arrow keys for navigation (future implementation)
    // if (e.key === 'ArrowRight') { /* next page */ }
    // if (e.key === 'ArrowLeft') { /* previous page */ }
});

// ==================== SAVE SCROLL POSITION ====================
const bookContentEl = document.getElementById('bookContent');
const bookKey = 'rudiments-of-electricity-scroll';

// Load saved position
window.addEventListener('load', () => {
    const savedPosition = localStorage.getItem(bookKey);
    if (savedPosition) {
        bookContentEl.scrollTop = parseInt(savedPosition);
    }
});

// Save position on scroll (debounced)
let scrollTimeout;
bookContentEl.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        localStorage.setItem(bookKey, bookContentEl.scrollTop);
    }, 500);
});
