// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Ottawa Opal Shop JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarHeaders = document.querySelectorAll('.sidebar-header');

    sidebarHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');

            // Toggle content visibility
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                content.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('ripple');
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Quantity selector functionality
    // Quantity decrease buttons
    document.querySelectorAll('.quantity-decrease').forEach(function (button) {
        button.addEventListener('click', function () {
            const input = this.parentNode.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });
    });

    // Quantity increase buttons
    document.querySelectorAll('.quantity-increase').forEach(function (button) {
        button.addEventListener('click', function () {
            const input = this.parentNode.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            const maxValue = parseInt(input.getAttribute('max'));
            if (currentValue < maxValue) {
                input.value = currentValue + 1;
            }
        });
    });

    // Validate quantity inputs
    document.querySelectorAll('.quantity-input').forEach(function (input) {
        // Center the text in the input
        input.style.textAlign = 'center';

        // Prevent non-numeric input
        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Validate on change
        input.addEventListener('change', function () {
            const minValue = parseInt(this.getAttribute('min'));
            const maxValue = parseInt(this.getAttribute('max'));
            let currentValue = parseInt(this.value);

            if (isNaN(currentValue) || currentValue < minValue) {
                this.value = minValue;
            } else if (currentValue > maxValue) {
                this.value = maxValue;
            }
        });

        // Validate on blur
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = 1;
            }
        });
    });

    // Initialize PayPal button if we're on the checkout page
    if (document.getElementById('paypal-button-container')) {
        initPayPalButton();
    }
});

// PayPal integration
function initPayPalButton() {
    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'paypal',
            },
            createOrder: function(data, actions) {
                // Get total from the page
                const total = document.getElementById('order-total').textContent.replace('$', '');

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: 'USD',
                            value: total
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(orderData) {
                    // Submit the form to process the payment on the server
                    document.getElementById('checkout-form').submit();
                });
            },
            onError: function(err) {
                console.log(err);
                alert('There was an error processing your payment. Please try again.');
            }
        }).render('#paypal-button-container');
    }
}
