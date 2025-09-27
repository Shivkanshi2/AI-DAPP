class OpenAIService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    this.baseUrl = "https://api.openai.com/v1";

    if (!this.apiKey) {
      console.warn(
        "OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment variables."
      );
    }
  }

  async createChatCompletion(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const {
      model = "gpt-3.5-turbo",
      temperature = 0.7,
      max_tokens = 1000,
      stream = false,
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  }

  async createStreamingChatCompletion(messages, options = {}, onChunk) {
    if (!this.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const {
      model = "gpt-3.5-turbo",
      temperature = 0.7,
      max_tokens = 1000,
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
            `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;
          if (line.trim() === "data: [DONE]") return;

          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (error) {
              console.warn("Error parsing streaming response:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("OpenAI Streaming API Error:", error);
      throw error;
    }
  }

  // Get model info based on subscription tier
  getModelForTier(tier) {
    switch (tier) {
      case 1: // Basic
        return {
          model: "gpt-3.5-turbo",
          max_tokens: 500,
          temperature: 0.7,
        };
      case 2: // Premium
        return {
          model: "gpt-3.5-turbo",
          max_tokens: 1500,
          temperature: 0.7,
        };
      case 3: // Enterprise
        return {
          model: "gpt-4",
          max_tokens: 2000,
          temperature: 0.7,
        };
      default:
        return {
          model: "gpt-3.5-turbo",
          max_tokens: 500,
          temperature: 0.7,
        };
    }
  }

  // Format messages for OpenAI API
  formatMessagesForAPI(messages) {
    return messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));
  }

  // Check if API key is valid
  async validateApiKey() {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new OpenAIService();
