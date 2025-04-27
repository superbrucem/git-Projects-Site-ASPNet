// Product Filters JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Product filters script loaded');
    
    // Initialize sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        console.log('Sort select found');
        sortSelect.addEventListener('change', function() {
            console.log('Sort changed to:', this.value);
            applyFilters();
        });
    }
    
    // Initialize per page select
    const perPageSelect = document.getElementById('per-page-select');
    if (perPageSelect) {
        console.log('Per page select found');
        perPageSelect.addEventListener('change', function() {
            console.log('Per page changed to:', this.value);
            applyFilters();
        });
    }
    
    // Initialize column buttons
    const columnButtons = document.querySelectorAll('.column-btn');
    if (columnButtons.length > 0) {
        console.log('Column buttons found:', columnButtons.length);
        columnButtons.forEach(button => {
            button.addEventListener('click', function() {
                const columns = this.getAttribute('data-columns');
                console.log('Columns changed to:', columns);
                
                // Update active state
                columnButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Apply filters
                applyFilters();
            });
        });
    }
});

function applyFilters() {
    console.log('Applying filters...');
    
    // Get current URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    
    // Get filter values
    const sortSelect = document.getElementById('sort-select');
    const perPageSelect = document.getElementById('per-page-select');
    const activeColumnBtn = document.querySelector('.column-btn.active');
    
    // Update parameters
    if (sortSelect) {
        params.set('sort', sortSelect.value);
        console.log('Setting sort to:', sortSelect.value);
    }
    
    if (perPageSelect) {
        params.set('perPage', perPageSelect.value);
        console.log('Setting perPage to:', perPageSelect.value);
    }
    
    if (activeColumnBtn) {
        params.set('columns', activeColumnBtn.getAttribute('data-columns'));
        console.log('Setting columns to:', activeColumnBtn.getAttribute('data-columns'));
    }
    
    // Reset to page 1
    params.set('page', '1');
    
    // Get hidden fields
    const categoryName = document.getElementById('category-name');
    const searchQuery = document.getElementById('search-query');
    
    // Preserve category
    if (categoryName && categoryName.value && !params.has('category')) {
        params.set('category', categoryName.value);
        console.log('Setting category to:', categoryName.value);
    }
    
    // Preserve search query
    if (searchQuery && searchQuery.value && !params.has('query')) {
        params.set('query', searchQuery.value);
        console.log('Setting query to:', searchQuery.value);
    }
    
    // Build new URL
    const newUrl = `${url.pathname}?${params.toString()}`;
    console.log('Navigating to:', newUrl);
    
    // Navigate to new URL
    window.location.href = newUrl;
}
