using Microsoft.AspNetCore.Mvc;
using AISite.Models;
using AISite.Services;

namespace AISite.Controllers;

public class ChatController : Controller
{
    private readonly OpenRouterService _openRouterService;
    private static readonly List<ChatMessage> _chatHistory = new List<ChatMessage>();

    public ChatController(OpenRouterService openRouterService)
    {
        _openRouterService = openRouterService;
    }

    public IActionResult Index()
    {
        return View("Index2", _chatHistory);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            return BadRequest("Message cannot be empty");
        }

        try
        {
            var userMessage = new ChatMessage
            {
                Role = "user",
                Content = message,
                Timestamp = DateTime.Now
            };

            _chatHistory.Add(userMessage);

            var response = await _openRouterService.GetResponseAsync(message, _chatHistory);

            if (response != null)
            {
                _chatHistory.Add(response);
                return Json(new { success = true, response });
            }

            return Json(new { success = false, message = "Failed to get response from AI" });
        }
        catch (Exception ex)
        {
            return Json(new { success = false, message = $"Error: {ex.Message}" });
        }
    }

    [HttpPost]
    public IActionResult ClearChat()
    {
        _chatHistory.Clear();
        return RedirectToAction("Index");
    }
}
