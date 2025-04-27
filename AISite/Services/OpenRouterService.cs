using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AISite.Models;

namespace AISite.Services;

public class OpenRouterService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly string? _siteUrl;
    private readonly string? _siteName;
    private readonly string _apiUrl = "https://openrouter.ai/api/v1/chat/completions";

    public OpenRouterService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _apiKey = _configuration["OpenRouterApi:ApiKey"] ?? throw new ArgumentNullException("OpenRouter API key is not configured");
        _model = _configuration["OpenRouterApi:Model"] ?? "anthropic/claude-3-opus:beta";
        _siteUrl = _configuration["OpenRouterApi:SiteUrl"];
        _siteName = _configuration["OpenRouterApi:SiteName"];
    }

    public async Task<ChatMessage?> GetResponseAsync(string message, List<ChatMessage> chatHistory)
    {
        try
        {
            var request = new OpenRouterRequest
            {
                Model = _model,
                Messages = ConvertChatHistoryToOpenRouterMessages(chatHistory, message)
            };

            var requestJson = JsonSerializer.Serialize(request);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");
            
            // Set up the HTTP request
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, _apiUrl);
            httpRequest.Content = content;
            
            // Add headers
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            
            if (!string.IsNullOrEmpty(_siteUrl))
            {
                httpRequest.Headers.Add("HTTP-Referer", _siteUrl);
            }
            
            if (!string.IsNullOrEmpty(_siteName))
            {
                httpRequest.Headers.Add("X-Title", _siteName);
            }
            
            // Send the request
            var response = await _httpClient.SendAsync(httpRequest);
            
            if (response.IsSuccessStatusCode)
            {
                var responseJson = await response.Content.ReadAsStringAsync();
                var openRouterResponse = JsonSerializer.Deserialize<OpenRouterResponse>(responseJson);
                
                if (openRouterResponse?.Choices != null && openRouterResponse.Choices.Count > 0)
                {
                    var choice = openRouterResponse.Choices[0];
                    if (choice.Message != null)
                    {
                        return new ChatMessage
                        {
                            Role = "assistant",
                            Content = choice.Message.Content,
                            Timestamp = DateTime.Now
                        };
                    }
                }
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error calling OpenRouter API: {response.StatusCode}, {errorContent}");
            }
            
            return new ChatMessage
            {
                Role = "assistant",
                Content = "I'm sorry, I couldn't process your request at this time.",
                Timestamp = DateTime.Now
            };
        }
        catch (Exception ex)
        {
            return new ChatMessage
            {
                Role = "assistant",
                Content = $"An error occurred: {ex.Message}",
                Timestamp = DateTime.Now
            };
        }
    }

    private List<OpenRouterMessage> ConvertChatHistoryToOpenRouterMessages(List<ChatMessage> chatHistory, string newMessage)
    {
        var messages = new List<OpenRouterMessage>();
        
        // Add chat history
        foreach (var message in chatHistory)
        {
            messages.Add(new OpenRouterMessage
            {
                Role = message.Role,
                Content = message.Content
            });
        }
        
        // Add the new message
        messages.Add(new OpenRouterMessage
        {
            Role = "user",
            Content = newMessage
        });
        
        return messages;
    }
}
