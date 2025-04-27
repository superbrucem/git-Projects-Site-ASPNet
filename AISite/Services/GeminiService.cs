using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AISite.Models;

namespace AISite.Services;

public class GeminiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _apiKey;
    private readonly string _apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

    public GeminiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _apiKey = _configuration["GeminiApi:ApiKey"] ?? throw new ArgumentNullException("Gemini API key is not configured");
    }

    public async Task<ChatMessage?> GetResponseAsync(string message, List<ChatMessage> chatHistory)
    {
        try
        {
            var request = new GeminiRequest
            {
                Contents = ConvertChatHistoryToGeminiContents(chatHistory, message),
                GenerationConfig = new GenerationConfig
                {
                    Temperature = 0.7f,
                    MaxOutputTokens = 2048,
                    TopP = 0.95f,
                    TopK = 40
                }
            };

            var requestJson = JsonSerializer.Serialize(request);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            var requestUrl = $"{_apiUrl}?key={_apiKey}";
            var response = await _httpClient.PostAsync(requestUrl, content);

            if (response.IsSuccessStatusCode)
            {
                var responseJson = await response.Content.ReadAsStringAsync();
                var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseJson);

                if (geminiResponse?.Candidates != null && geminiResponse.Candidates.Count > 0)
                {
                    var candidate = geminiResponse.Candidates[0];
                    if (candidate.Content?.Parts != null && candidate.Content.Parts.Count > 0)
                    {
                        return new ChatMessage
                        {
                            Role = "assistant",
                            Content = candidate.Content.Parts[0].Text,
                            Timestamp = DateTime.Now
                        };
                    }
                }
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Error calling Gemini API: {response.StatusCode}, {errorContent}");
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

    private List<GeminiContent> ConvertChatHistoryToGeminiContents(List<ChatMessage> chatHistory, string newMessage)
    {
        var contents = new List<GeminiContent>();

        // Add chat history
        foreach (var message in chatHistory)
        {
            contents.Add(new GeminiContent
            {
                Role = message.Role,
                Parts = new List<GeminiPart>
                {
                    new GeminiPart { Text = message.Content }
                }
            });
        }

        // Add the new message
        contents.Add(new GeminiContent
        {
            Role = "user",
            Parts = new List<GeminiPart>
            {
                new GeminiPart { Text = newMessage }
            }
        });

        return contents;
    }
}
