// Product Grid JavaScript Functions

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    // Initialize per page select
    const perPageSelect = document.getElementById('per-page-select');
    if (perPageSelect) {
        perPageSelect.addEventListener('change', applyFilters);
    }

    // Initialize column buttons
    const columnButtons = document.querySelectorAll('.column-btn');
    if (columnButtons.length > 0) {
        columnButtons.forEach(button => {
            button.addEventListener('click', function() {
                const columns = parseInt(this.getAttribute('data-columns'));
                setColumns(columns);
            });
        });
    }

    // Initialize column layout based on URL parameter
    initializeColumnLayout();
});

// Apply filters function
function applyFilters() {
    console.log('Applying filters...');
    
    // Get values
    const sortSelect = document.getElementById('sort-select');
    const perPageSelect = document.getElementById('per-page-select');
    const activeColumnBtn = document.querySelector('.column-btn.active');
    
    if (!sortSelect || !perPageSelect || !activeColumnBtn) {
        console.error('Required elements not found');
        return;
    }
    
    const sortValue = sortSelect.value;
    const perPageValue = perPageSelect.value;
    const columnsValue = activeColumnBtn.getAttribute('data-columns');
    
    console.log('Sort:', sortValue, 'PerPage:', perPageValue, 'Columns:', columnsValue);

    // Get current URL and parameters
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    // Update parameters
    params.set('sort', sortValue);
    params.set('perPage', perPageValue);
    params.set('columns', columnsValue);
    params.set('page', '1'); // Reset to page 1 when filters change

    // Preserve category parameter if it exists in the model
    const categoryElement = document.getElementById('category-name');
    if (categoryElement && categoryElement.value) {
        params.set('category', categoryElement.value);
    }

    // Preserve search parameter if it exists in the model
    const searchElement = document.getElementById('search-query');
    if (searchElement && searchElement.value) {
        params.set('search', searchElement.value);
    }

    // Create the new URL and navigate to it
    const newUrl = url.pathname + '?' + params.toString();
    console.log('Navigating to:', newUrl);
    window.location.href = newUrl;
}

// Set columns function
function setColumns(columns) {
    console.log('Setting columns to:', columns);
    
    // Update active state on buttons
    document.querySelectorAll('.column-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`.column-btn[data-columns="${columns}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update product card classes based on columns
    const productCards = document.querySelectorAll('.product-card-container');
    productCards.forEach(card => {
        // Remove existing column classes
        card.classList.remove('col-md-12', 'col-md-6', 'col-md-4', 'col-md-3', 'col-md-2');

        // Add appropriate column class
        switch(columns) {
            case 1:
                card.classList.add('col-md-12');
                break;
            case 2:
                card.classList.add('col-md-6');
                break;
            case 3:
                card.classList.add('col-md-4');
                break;
            case 4:
                card.classList.add('col-md-3');
                break;
            case 6:
                card.classList.add('col-md-2');
                break;
            default:
                card.classList.add('col-md-3');
        }
    });

    // Apply filters to update URL
    applyFilters();
}

// Initialize column layout based on URL parameter
function initializeColumnLayout() {
    const urlParams = new URLSearchParams(window.location.search);
    const columns = urlParams.get('columns') || '4'; // Default to 4 columns
    
    console.log('Initializing column layout to:', columns);

    // Update active state on column buttons
    document.querySelectorAll('.column-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`.column-btn[data-columns="${columns}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update product card classes
    const productCards = document.querySelectorAll('.col-md-3.col-lg-3.mb-4, .product-card-container');
    productCards.forEach(card => {
        card.classList.add('product-card-container');

        // Remove existing column classes
        card.classList.remove('col-md-12', 'col-md-6', 'col-md-4', 'col-md-3', 'col-md-2');

        // Add appropriate column class
        switch(columns) {
            case '1':
                card.classList.add('col-md-12');
                break;
            case '2':
                card.classList.add('col-md-6');
                break;
            case '3':
                card.classList.add('col-md-4');
                break;
            case '4':
                card.classList.add('col-md-3');
                break;
            case '6':
                card.classList.add('col-md-2');
                break;
            default:
                card.classList.add('col-md-3');
        }
    });
}
