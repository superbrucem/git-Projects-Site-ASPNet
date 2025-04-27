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

        public CartController(ShoppingCartService cartService, ProductService productService)
        {
            _cartService = cartService;
            _productService = productService;
        }

        public IActionResult Index()
        {
            var cart = _cartService.GetCart();
            return View(cart);
        }

        [HttpPost]
        public IActionResult AddToCart(int productId, int quantity = 1)
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
        public IActionResult ProcessPayment()
        {
            // This would normally handle the payment processing
            // For now, we'll just clear the cart and show a success message
            
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

            // Process the order (in a real app, this would update inventory, create an order record, etc.)
            _cartService.ClearCart();
            
            TempData["SuccessMessage"] = "Your order has been placed successfully!";
            return RedirectToAction("OrderConfirmation");
        }

        public IActionResult OrderConfirmation()
        {
            return View();
        }
    }
}
