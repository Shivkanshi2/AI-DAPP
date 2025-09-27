import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import OpenAIService from "../services/openai";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { address } = useAccount();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);

  // Load conversations from localStorage on mount
  useEffect(() => {
    if (address) {
      const savedConversations = localStorage.getItem(
        `conversations_${address}`
      );
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);

        // Set current conversation to the most recent one
        if (parsed.length > 0) {
          setCurrentConversation(parsed[0]);
        }
      }
    }
  }, [address]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (address && conversations.length > 0) {
      localStorage.setItem(
        `conversations_${address}`,
        JSON.stringify(conversations)
      );
    }
  }, [conversations, address]);

  // Validate OpenAI API key on mount
  useEffect(() => {
    const validateKey = async () => {
      try {
        const isValid = await OpenAIService.validateApiKey();
        setIsApiKeyValid(isValid);
        if (!isValid && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
          toast.error(
            "Invalid OpenAI API key. Please check your configuration."
          );
        }
      } catch (error) {
        console.error("Error validating API key:", error);
        setIsApiKeyValid(false);
      }
    };

    validateKey();
  }, []);

  // Create new conversation
  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    return newConversation;
  };

  // Add message to current conversation with better state handling
  const addMessage = (message) => {
    console.log(
      "Adding message:",
      message.role,
      message.content.substring(0, 30) + "..."
    );

    const newMessage = {
      id: Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9),
      role: message.role,
      content: message.content,
      timestamp: new Date().toISOString(),
    };

    console.log("Created new message object:", newMessage);

    // Use functional update to ensure we're working with latest state
    setCurrentConversation((prevConversation) => {
      let targetConversation = prevConversation;

      // If no current conversation, create one
      if (!targetConversation) {
        targetConversation = {
          id: Date.now().toString(),
          title: "New Chat",
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log("Created new conversation:", targetConversation.id);
      }

      // Create updated conversation with new message
      const updatedConversation = {
        ...targetConversation,
        messages: [...(targetConversation.messages || []), newMessage],
        updatedAt: new Date().toISOString(),
        title:
          targetConversation.messages?.length === 0 && message.role === "user"
            ? message.content.substring(0, 50) +
              (message.content.length > 50 ? "..." : "")
            : targetConversation.title || "New Chat",
      };

      console.log(
        "Updated conversation messages count:",
        updatedConversation.messages.length
      );
      console.log(
        "All messages in updated conversation:",
        updatedConversation.messages.map(
          (m) => `${m.role}: ${m.content.substring(0, 20)}...`
        )
      );

      // Update conversations array in a separate effect
      setConversations((prevConversations) => {
        const existingIndex = prevConversations.findIndex(
          (conv) => conv.id === targetConversation.id
        );
        if (existingIndex >= 0) {
          const newConversations = [...prevConversations];
          newConversations[existingIndex] = updatedConversation;
          return newConversations;
        } else {
          return [updatedConversation, ...prevConversations];
        }
      });

      return updatedConversation;
    });

    return newMessage;
  };

  // Delete conversation
  const deleteConversation = (conversationId) => {
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId)
    );

    if (currentConversation?.id === conversationId) {
      const remaining = conversations.filter(
        (conv) => conv.id !== conversationId
      );
      setCurrentConversation(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Clear all conversations
  const clearAllConversations = () => {
    setConversations([]);
    setCurrentConversation(null);
    if (address) {
      localStorage.removeItem(`conversations_${address}`);
    }
  };

  // Send message with OpenAI integration - FIXED VERSION
  const sendMessage = async (userMessage, subscriptionTier = 1) => {
    if (!isApiKeyValid) {
      toast.error("OpenAI API key is not configured or invalid");
      return;
    }

    console.log("=== STARTING SEND MESSAGE ===");
    console.log("User message:", userMessage);

    // Add the user message first
    addMessage({
      role: "user",
      content: userMessage,
    });

    console.log("User message added, now starting AI call...");

    setIsTyping(true);
    setStreamingMessage("");

    try {
      // Get current conversation state for API context
      // We'll build the API messages manually to ensure we have the user message
      const conversationToUse = currentConversation;
      const existingMessages = conversationToUse?.messages || [];

      console.log("Existing messages for API:", existingMessages.length);

      // Build messages for API call - include ALL existing messages + the new user message
      const messagesForAPI = [
        ...existingMessages,
        { role: "user", content: userMessage },
      ];

      console.log("Total messages for API:", messagesForAPI.length);

      const formattedMessages =
        OpenAIService.formatMessagesForAPI(messagesForAPI);
      console.log("Formatted messages for OpenAI:", formattedMessages);

      // Get model configuration based on subscription tier
      const modelConfig = OpenAIService.getModelForTier(subscriptionTier);

      // Use streaming for better UX
      let assistantResponse = "";

      await OpenAIService.createStreamingChatCompletion(
        formattedMessages,
        modelConfig,
        (chunk) => {
          assistantResponse += chunk;
          setStreamingMessage(assistantResponse);
        }
      );

      console.log("=== AI RESPONSE COMPLETE ===");
      console.log(
        "Full AI response:",
        assistantResponse.substring(0, 100) + "..."
      );

      // Clear streaming message
      setStreamingMessage("");

      // Add ONLY the assistant response
      addMessage({
        role: "assistant",
        content: assistantResponse,
      });

      console.log("Assistant message added");
    } catch (error) {
      console.error("Error getting AI response:", error);

      let errorMessage =
        "Sorry, I encountered an error while processing your request.";

      if (error.message.includes("API key")) {
        errorMessage =
          "Invalid API key. Please check your OpenAI API configuration.";
      } else if (error.message.includes("quota")) {
        errorMessage = "API quota exceeded. Please check your OpenAI billing.";
      } else if (error.message.includes("rate limit")) {
        errorMessage =
          "Rate limit exceeded. Please wait a moment and try again.";
      }

      setStreamingMessage("");

      addMessage({
        role: "assistant",
        content: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      setIsTyping(false);
      setStreamingMessage("");
      console.log("=== SEND MESSAGE COMPLETE ===");
    }
  };

  // Get AI response (non-streaming version)
  const getAIResponse = async (userMessage, subscriptionTier = 1) => {
    if (!isApiKeyValid) {
      throw new Error("OpenAI API key is not configured or invalid");
    }

    try {
      // Get conversation history for context (last 10 messages to avoid token limits)
      const conversationHistory = (currentConversation?.messages || []).slice(
        -10
      );
      const messages = OpenAIService.formatMessagesForAPI([
        ...conversationHistory,
        { role: "user", content: userMessage },
      ]);

      // Get model configuration based on subscription tier
      const modelConfig = OpenAIService.getModelForTier(subscriptionTier);

      const response = await OpenAIService.createChatCompletion(
        messages,
        modelConfig
      );

      return (
        response.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a response."
      );
    } catch (error) {
      console.error("Error getting AI response:", error);
      throw error;
    }
  };

  const value = {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
    addMessage,
    deleteConversation,
    clearAllConversations,
    sendMessage,
    getAIResponse,
    isTyping,
    streamingMessage,
    isApiKeyValid,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
