import { useState, useEffect, useRef } from "react";
import {
  FiSend,
  FiUser,
  FiAlertCircle,
  FiWifi,
  FiWifiOff,
  FiZap,
  FiShield,
  FiCpu,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { useChat } from "../context/ChatContext";
import { useContract } from "../context/ContractContext";
import MessageFormatter from "../components/Chat/MessageFormatter";
import Link from "next/link";
import toast from "react-hot-toast";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    currentConversation,
    sendMessage,
    isTyping,
    createNewConversation,
    streamingMessage,
    isApiKeyValid,
  } = useChat();

  const {
    hasActiveSubscription,
    canMakeQuery,
    remainingQueries,
    getTierName,
    subscriptionDetails,
    useQuery,
    address,
  } = useContract();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isTyping, streamingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isGenerating || isTyping) return;

    if (!isApiKeyValid) {
      toast.error(
        "OpenAI API key is not configured or invalid. Please check your environment variables."
      );
      return;
    }

    if (!hasActiveSubscription) {
      toast.error("Please subscribe to a plan to start chatting!");
      return;
    }

    if (!canMakeQuery) {
      toast.error("You have reached your query limit for this billing period!");
      return;
    }

    const userMessage = message.trim();
    setMessage("");
    setIsGenerating(true);

    try {
      // Get the subscription tier for AI model selection
      const tier = subscriptionDetails ? subscriptionDetails[0] : 1;

      // Send the message to OpenAI (this will handle the chat interaction)
      await sendMessage(userMessage, tier);

      // Track query usage (this is separate from the chat interaction)
      if (address) {
        try {
          await useQuery(address);
          console.log("Query usage tracked successfully");
        } catch (queryError) {
          console.warn("Query tracking failed:", queryError);
          // Don't fail the entire chat if query tracking fails
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If no conversation exists, create one
  useEffect(() => {
    if (!currentConversation) {
      createNewConversation();
    }
  }, [currentConversation, createNewConversation]);

  const getModelName = (tier) => {
    switch (tier) {
      case 1:
        return "GPT-3.5 Turbo";
      case 2:
        return "GPT-3.5 Turbo (Enhanced)";
      case 3:
        return "GPT-4";
      default:
        return "GPT-3.5 Turbo";
    }
  };

  const getModelIcon = (tier) => {
    switch (tier) {
      case 1:
        return FiCpu;
      case 2:
        return FiZap;
      case 3:
        return FiShield;
      default:
        return FiCpu;
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/50" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced API Status */}
          <div className="mb-6 flex items-center justify-center">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl border shadow-lg ${
                isApiKeyValid
                  ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isApiKeyValid ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              {isApiKeyValid ? (
                <FiWifi className="w-4 h-4" />
              ) : (
                <FiWifiOff className="w-4 h-4" />
              )}
              <span className="font-medium text-sm">
                {isApiKeyValid
                  ? "AI Network Connected"
                  : "AI Network Disconnected"}
              </span>
            </div>
          </div>

          {/* Enhanced API Key warning */}
          {!isApiKeyValid && (
            <div className="mb-6 relative overflow-hidden bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5" />
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-800 dark:text-red-200 text-lg mb-2">
                    🔌 AI Network Configuration Required
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-4 leading-relaxed">
                    Connect to the AI network by configuring your OpenAI API
                    credentials. This enables secure, decentralized AI
                    interactions on the blockchain.
                  </p>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <code className="text-sm font-mono text-red-800 dark:text-red-200">
                      NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Subscription warning */}
          {!hasActiveSubscription && (
            <div className="mb-6 relative overflow-hidden bg-amber-500/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5" />
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiShield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-800 dark:text-amber-200 text-lg mb-2">
                    ⚡ Blockchain Subscription Required
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 mb-4 leading-relaxed">
                    Activate your decentralized AI subscription to unlock the
                    power of blockchain-secured conversations.
                  </p>
                  <Link
                    href="/subscription"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiZap className="w-4 h-4" />
                    Choose Your Plan
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Query limit warning */}
          {hasActiveSubscription && !canMakeQuery && (
            <div className="mb-6 relative overflow-hidden bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5" />
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-800 dark:text-red-200 text-lg mb-2">
                    🚫 Query Capacity Reached
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-4 leading-relaxed">
                    You've reached your blockchain query limit for this billing
                    cycle. Upgrade to continue your AI conversations.
                  </p>
                  <Link
                    href="/subscription"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiZap className="w-4 h-4" />
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Welcome message */}
          {(!currentConversation?.messages ||
            currentConversation.messages.length === 0) && (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <FaRobot className="w-12 h-12 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-600/50 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Welcome to BlockChat AI
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the future of AI conversations powered by blockchain
                technology. Secure, decentralized, and intelligent.
              </p>

              {hasActiveSubscription && subscriptionDetails && (
                <div className="relative overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 inline-block border border-white/20 dark:border-gray-700/20 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10" />
                  <div className="relative">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div
                        className={`w-8 h-8 bg-gradient-to-br ${
                          subscriptionDetails[0] === 3
                            ? "from-yellow-400 to-orange-500"
                            : subscriptionDetails[0] === 2
                            ? "from-purple-400 to-pink-500"
                            : "from-blue-400 to-cyan-500"
                        } rounded-lg flex items-center justify-center`}
                      >
                        {(() => {
                          const IconComponent = getModelIcon(
                            subscriptionDetails[0]
                          );
                          return (
                            <IconComponent className="w-4 h-4 text-white" />
                          );
                        })()}
                      </div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {getTierName(subscriptionDetails[0])} Plan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-gray-600 dark:text-gray-400 mb-1">
                          Queries Available
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {/* {remainingQueries === Number.MAX_SAFE_INTEGER
                            ? "∞ Unlimited"
                            : `${remainingQueries.toLocaleString()}`} */}
                          Start asking
                        </div>
                      </div>
                      <div className="bg-white/40 dark:bg-gray-700/40 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-gray-600 dark:text-gray-400 mb-1">
                          AI Model
                        </div>
                        <div className="font-bold text-blue-600 dark:text-blue-400">
                          {getModelName(subscriptionDetails[0])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Messages */}
          {currentConversation?.messages &&
            currentConversation.messages.length > 0 &&
            currentConversation.messages.map((msg, index) => (
              <div
                key={`${msg.id}-${index}`}
                className={`flex gap-4 mb-8 animate-fadeIn ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <FaRobot className="w-5 h-5 text-white relative z-10" />
                  </div>
                )}

                <div
                  className={`max-w-3xl ${
                    msg.role === "user" ? "order-1" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl px-6 py-4 shadow-lg backdrop-blur-xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto border border-blue-400/20"
                        : "bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20"
                    }`}
                  >
                    {msg.role === "user" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                    )}
                    <div className="relative z-10">
                      <MessageFormatter content={msg.content} role={msg.role} />
                      <div
                        className={`flex items-center gap-2 mt-3 text-xs ${
                          msg.role === "user"
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <span className="capitalize font-medium">
                          {msg.role}
                        </span>
                        <div className="w-1 h-1 bg-current rounded-full opacity-50" />
                        <span>{formatTimestamp(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
              </div>
            ))}

          {/* Enhanced Typing indicator */}
          {(isTyping || streamingMessage) && (
            <div className="flex gap-4 mb-8 animate-fadeIn">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <FaRobot className="w-5 h-5 text-white relative z-10 animate-pulse" />
              </div>
              <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 rounded-2xl px-6 py-4 border border-white/20 dark:border-gray-700/20 max-w-3xl shadow-lg backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
                <div className="relative z-10">
                  {streamingMessage ? (
                    <div className="relative">
                      <MessageFormatter
                        content={streamingMessage}
                        role="assistant"
                      />
                      <span className="inline-block w-0.5 h-5 bg-blue-500 animate-pulse ml-1 rounded-full"></span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                        AI is thinking
                      </span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Message input */}
      <div className="relative z-10 border-t border-white/20 dark:border-gray-700/20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  !isApiKeyValid
                    ? "🔌 AI Network configuration required..."
                    : hasActiveSubscription
                    ? canMakeQuery
                      ? "💬 Start your blockchain AI conversation..."
                      : "🚫 Query limit reached"
                    : "⚡ Subscribe to unlock AI conversations..."
                }
                disabled={
                  !isApiKeyValid ||
                  !hasActiveSubscription ||
                  !canMakeQuery ||
                  isGenerating ||
                  isTyping
                }
                className="w-full resize-none border border-white/30 dark:border-gray-600/30 rounded-2xl px-6 py-4 pr-14 bg-white/50 dark:bg-gray-700/50 backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] max-h-40 transition-all duration-300 shadow-lg"
                rows={1}
              />
              {message && (
                <div className="absolute bottom-2 right-16 text-xs text-gray-400 bg-white/50 dark:bg-gray-700/50 px-2 py-1 rounded-full backdrop-blur-sm">
                  {message.length} chars
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={
                !message.trim() ||
                !isApiKeyValid ||
                !hasActiveSubscription ||
                !canMakeQuery ||
                isGenerating ||
                isTyping
              }
              className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isGenerating || isTyping ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend className="w-5 h-5" />
              )}
            </button>
          </form>

          {hasActiveSubscription && isApiKeyValid && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 text-sm">
              <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {/* <span>
                    {remainingQueries === Number.MAX_SAFE_INTEGER
                      ? "∞ Unlimited queries"
                      : `${remainingQueries.toLocaleString()} queries remaining`}
                  </span> */}
                </div>
                {subscriptionDetails && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        subscriptionDetails[0] === 3
                          ? "bg-yellow-500"
                          : subscriptionDetails[0] === 2
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {getModelName(subscriptionDetails[0])}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-gray-500 dark:text-gray-500 text-xs">
                Press Enter to send • Shift+Enter for new line
              </span>
            </div>
          )}

          {/* Enhanced Model info for development */}
          {process.env.NODE_ENV === "development" && subscriptionDetails && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs backdrop-blur-xl">
                <FiCpu className="w-3 h-3" />
                Debug: Tier {subscriptionDetails[0]} • Model:{" "}
                {getModelName(subscriptionDetails[0])}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-30px, -30px) rotate(-120deg);
          }
          66% {
            transform: translate(20px, 20px) rotate(-240deg);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
