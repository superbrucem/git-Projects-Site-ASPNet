using System;
using Microsoft.AspNetCore.Mvc;
using OttawaOpalShop.Models;
using OttawaOpalShop.Services;

namespace OttawaOpalShop.Controllers
{
    public class CartController : Controller
    {
        private readonly ShoppingCartService _cartService;
        private readonly ProductService _productService;
        private readonly ILogger<CartController> _logger;

        public CartController(ShoppingCartService cartService, ProductService productService, ILogger<CartController> logger)
        {
            _cartService = cartService;
            _productService = productService;
            _logger = logger;
        }

        public IActionResult Index()
        {
            var cart = _cartService.GetCart();
            return View(cart);
        }

        [HttpPost]
        public IActionResult AddToCart(int productId, int quantity = 1, string returnUrl = null)
        {
            try
            {
                _cartService.AddToCart(productId, quantity);
                TempData["SuccessMessage"] = "Item added to cart successfully.";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = ex.Message;
            }

            // If returnUrl is provided, use it
            if (!string.IsNullOrEmpty(returnUrl))
            {
                return Redirect(returnUrl);
            }

            // Otherwise, try to get the referring URL
            string referer = Request.Headers["Referer"].ToString();
            if (!string.IsNullOrEmpty(referer))
            {
                return Redirect(referer);
            }

            // Fallback to Home/Index if no referrer is available
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public IActionResult UpdateCartItem(int itemId, int quantity)
        {
            try
            {
                _cartService.UpdateCartItem(itemId, quantity);
                TempData["SuccessMessage"] = "Cart updated successfully.";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = ex.Message;
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult RemoveFromCart(int itemId)
        {
            try
            {
                _cartService.RemoveFromCart(itemId);
                TempData["SuccessMessage"] = "Item removed from cart.";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = ex.Message;
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult ClearCart()
        {
            _cartService.ClearCart();
            TempData["SuccessMessage"] = "Cart cleared.";
            return RedirectToAction("Index");
        }

        public IActionResult Checkout()
        {
            var cart = _cartService.GetCart();

            if (cart.IsEmpty)
            {
                TempData["ErrorMessage"] = "Your cart is empty.";
                return RedirectToAction("Index");
            }

            if (!_cartService.ValidateCartStock())
            {
                TempData["ErrorMessage"] = "Some items in your cart are out of stock or have insufficient quantity.";
                return RedirectToAction("Index");
            }

            return View(cart);
        }

        [HttpPost]
        public IActionResult ProcessPayment(string FirstName, string LastName, string Email, string Phone, string PaymentMethod, string TransactionId = null)
        {
            var cart = _cartService.GetCart();

            if (cart.IsEmpty)
            {
                TempData["ErrorMessage"] = "Your cart is empty.";
                return RedirectToAction("Index");
            }

            if (!_cartService.ValidateCartStock())
            {
                TempData["ErrorMessage"] = "Some items in your cart are out of stock or have insufficient quantity.";
                return RedirectToAction("Index");
            }

            // Store customer information in TempData for retrieval after PayPal redirect
            TempData["CustomerFirstName"] = FirstName;
            TempData["CustomerLastName"] = LastName;
            TempData["CustomerEmail"] = Email;
            TempData["CustomerPhone"] = Phone;

            // If we have a transaction ID, it means PayPal payment is complete
            if (!string.IsNullOrEmpty(TransactionId))
            {
                // Log customer information
                _logger.LogInformation($"Order placed by {FirstName} {LastName} ({Email})");
                _logger.LogInformation($"Payment method: {PaymentMethod}");
                _logger.LogInformation($"Order total: ${cart.Total}");
                _logger.LogInformation($"PayPal Transaction ID: {TransactionId}");

                // Generate a unique order ID
                string orderId = $"OOS-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8)}";
                _logger.LogInformation($"Generated order ID: {orderId}");

                // Update inventory (reduce stock quantities)
                foreach (var item in cart.Items)
                {
                    var product = _productService.GetProductById(item.ProductId);
                    if (product != null)
                    {
                        // In a real app, you would update the database
                        // For now, we're just simulating the stock reduction
                        _logger.LogInformation($"Reducing stock for product {product.Id} from {product.StockQuantity} to {product.StockQuantity - item.Quantity}");

                        // Update the product stock quantity
                        _productService.UpdateProductStock(product.Id, product.StockQuantity - item.Quantity);
                    }
                }

                // Clear the cart after successful order placement
                _cartService.ClearCart();

                // Store order information in TempData
                TempData["SuccessMessage"] = "Your order has been placed successfully!";
                TempData["OrderId"] = orderId;
                TempData["CustomerName"] = $"{FirstName} {LastName}";
                TempData["CustomerEmail"] = Email;
                TempData["PayPalMessage"] = "Your PayPal payment has been processed successfully.";
                TempData["TransactionId"] = TransactionId;

                return RedirectToAction("OrderConfirmation");
            }
            else
            {
                // Redirect to PayPal for payment
                // For demo purposes, we'll redirect to a simulated PayPal page
                return RedirectToAction("PayPalCheckout");
            }
        }

        public IActionResult PayPalCheckout()
        {
            var cart = _cartService.GetCart();
            return View(cart);
        }

        public IActionResult OrderConfirmation()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CompletePayPalPayment()
        {
            // Retrieve customer information from TempData
            string firstName = TempData["CustomerFirstName"]?.ToString() ?? "";
            string lastName = TempData["CustomerLastName"]?.ToString() ?? "";
            string email = TempData["CustomerEmail"]?.ToString() ?? "";
            string phone = TempData["CustomerPhone"]?.ToString() ?? "";

            // Generate a mock transaction ID
            string transactionId = $"PAYPAL-{Guid.NewGuid().ToString().Substring(0, 12)}";

            // Process the payment with the retrieved information
            return ProcessPayment(firstName, lastName, email, phone, "PayPal", transactionId);
        }
    }
}
