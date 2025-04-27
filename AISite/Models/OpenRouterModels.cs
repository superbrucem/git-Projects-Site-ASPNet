using System.Text.Json.Serialization;

namespace AISite.Models;

// Request models
public class OpenRouterRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;
    
    [JsonPropertyName("messages")]
    public List<OpenRouterMessage> Messages { get; set; } = new List<OpenRouterMessage>();
}

public class OpenRouterMessage
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = "user";
    
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

// Response models
public class OpenRouterResponse
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
    
    [JsonPropertyName("choices")]
    public List<OpenRouterChoice>? Choices { get; set; }
    
    [JsonPropertyName("usage")]
    public OpenRouterUsage? Usage { get; set; }
}

public class OpenRouterChoice
{
    [JsonPropertyName("index")]
    public int Index { get; set; }
    
    [JsonPropertyName("message")]
    public OpenRouterMessage? Message { get; set; }
    
    [JsonPropertyName("finish_reason")]
    public string? FinishReason { get; set; }
}

public class OpenRouterUsage
{
    [JsonPropertyName("prompt_tokens")]
    public int PromptTokens { get; set; }
    
    [JsonPropertyName("completion_tokens")]
    public int CompletionTokens { get; set; }
    
    [JsonPropertyName("total_tokens")]
    public int TotalTokens { get; set; }
}
