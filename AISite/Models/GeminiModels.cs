using System.Text.Json.Serialization;

namespace AISite.Models;

// Request models
public class GeminiRequest
{
    [JsonPropertyName("contents")]
    public List<GeminiContent> Contents { get; set; } = new List<GeminiContent>();
    
    [JsonPropertyName("generationConfig")]
    public GenerationConfig? GenerationConfig { get; set; }
}

public class GeminiContent
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = "user";
    
    [JsonPropertyName("parts")]
    public List<GeminiPart> Parts { get; set; } = new List<GeminiPart>();
}

public class GeminiPart
{
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;
}

public class GenerationConfig
{
    [JsonPropertyName("temperature")]
    public float Temperature { get; set; } = 0.7f;
    
    [JsonPropertyName("maxOutputTokens")]
    public int MaxOutputTokens { get; set; } = 2048;
    
    [JsonPropertyName("topP")]
    public float TopP { get; set; } = 0.95f;
    
    [JsonPropertyName("topK")]
    public int TopK { get; set; } = 40;
}

// Response models
public class GeminiResponse
{
    [JsonPropertyName("candidates")]
    public List<GeminiCandidate>? Candidates { get; set; }
    
    [JsonPropertyName("promptFeedback")]
    public PromptFeedback? PromptFeedback { get; set; }
}

public class GeminiCandidate
{
    [JsonPropertyName("content")]
    public GeminiContent? Content { get; set; }
    
    [JsonPropertyName("finishReason")]
    public string? FinishReason { get; set; }
    
    [JsonPropertyName("index")]
    public int Index { get; set; }
}

public class PromptFeedback
{
    [JsonPropertyName("blockReason")]
    public string? BlockReason { get; set; }
    
    [JsonPropertyName("safetyRatings")]
    public List<SafetyRating>? SafetyRatings { get; set; }
}

public class SafetyRating
{
    [JsonPropertyName("category")]
    public string? Category { get; set; }
    
    [JsonPropertyName("probability")]
    public string? Probability { get; set; }
}
