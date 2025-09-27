import { useState } from "react";
import { FiCopy, FiCheck, FiCode, FiTerminal } from "react-icons/fi";

const MessageFormatter = ({ content, role }) => {
  const [copiedBlocks, setCopiedBlocks] = useState(new Set());

  // Function to copy code to clipboard
  const copyToClipboard = async (text, blockIndex) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks((prev) => new Set(prev).add(blockIndex));
      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockIndex);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Get language-specific styling and icons
  const getLanguageConfig = (language) => {
    const configs = {
      javascript: {
        color: "from-yellow-500 to-orange-500",
        icon: FiCode,
        name: "JavaScript",
      },
      typescript: {
        color: "from-blue-500 to-blue-600",
        icon: FiCode,
        name: "TypeScript",
      },
      python: {
        color: "from-green-500 to-emerald-500",
        icon: FiCode,
        name: "Python",
      },
      html: {
        color: "from-orange-500 to-red-500",
        icon: FiCode,
        name: "HTML",
      },
      css: {
        color: "from-blue-500 to-purple-500",
        icon: FiCode,
        name: "CSS",
      },
      json: {
        color: "from-gray-500 to-gray-600",
        icon: FiCode,
        name: "JSON",
      },
      bash: {
        color: "from-gray-700 to-black",
        icon: FiTerminal,
        name: "Bash",
      },
      shell: {
        color: "from-gray-700 to-black",
        icon: FiTerminal,
        name: "Shell",
      },
      sql: {
        color: "from-indigo-500 to-purple-500",
        icon: FiCode,
        name: "SQL",
      },
      solidity: {
        color: "from-purple-500 to-pink-500",
        icon: FiCode,
        name: "Solidity",
      },
    };

    return (
      configs[language?.toLowerCase()] || {
        color: "from-gray-500 to-gray-600",
        icon: FiCode,
        name: language?.charAt(0).toUpperCase() + language?.slice(1) || "Code",
      }
    );
  };

  // Function to detect and format code blocks
  const formatMessage = (text) => {
    if (!text) return text;

    // Split by code blocks (```language or ```)
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {formatInlineCode(textBefore)}
          </span>
        );
      }

      // Add code block
      const language = match[1] || "text";
      const code = match[2].trim();
      const currentBlockIndex = blockIndex++;
      const langConfig = getLanguageConfig(language);
      const IconComponent = langConfig.icon;

      parts.push(
        <div
          key={`code-${match.index}`}
          className="my-6 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl border border-gray-700/50"
        >
          {/* Header with enhanced styling */}
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border-b border-gray-600/30">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${langConfig.color} opacity-10`}
            />
            <div className="relative flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 bg-gradient-to-br ${langConfig.color} rounded-lg flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">
                    {langConfig.name}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">Ready to copy</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(code, currentBlockIndex)}
                className={`group/copy flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                  copiedBlocks.has(currentBlockIndex)
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20"
                }`}
              >
                {copiedBlocks.has(currentBlockIndex) ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4 group-hover/copy:scale-110 transition-transform duration-200" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Decorative line */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${langConfig.color} opacity-50`}
            />
          </div>

          {/* Code content with enhanced styling */}
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            <div className="relative p-6 overflow-x-auto custom-scrollbar">
              <pre className="text-sm leading-relaxed font-mono">
                <code className="text-gray-100 block">
                  {code.split("\n").map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className="flex items-start group/line hover:bg-white/5 -mx-2 px-2 py-0.5 rounded transition-colors duration-200"
                    >
                      <span className="text-gray-500 select-none w-8 text-right mr-4 text-xs font-medium opacity-60 group-hover/line:opacity-100 transition-opacity">
                        {lineIndex + 1}
                      </span>
                      <span className="flex-1 min-w-0">{line || " "}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Copy success animation overlay */}
          {copiedBlocks.has(currentBlockIndex) && (
            <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/30 rounded-2xl animate-pulse" />
          )}
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < text.length) {
      const textAfter = text.slice(lastIndex);
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {formatInlineCode(textAfter)}
        </span>
      );
    }

    return parts.length > 0 ? parts : formatInlineCode(text);
  };

  // Function to format inline code (single backticks)
  const formatInlineCode = (text) => {
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      // Add text before inline code
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add inline code with enhanced styling
      parts.push(
        <code
          key={`inline-${match.index}`}
          className={`relative inline-flex items-center px-2 py-1 mx-0.5 rounded-md text-sm font-mono font-medium transition-all duration-200 hover:scale-105 ${
            role === "user"
              ? "bg-white/20 text-blue-100 border border-white/30"
              : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-gray-500/50 shadow-sm"
          }`}
        >
          <span className="relative z-10">{match[1]}</span>
          {role !== "user" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-md" />
          )}
        </code>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Format text with better typography
  const formatTextContent = (content) => {
    if (!content) return content;

    // Handle lists and formatting
    const lines = content.split("\n");
    const formattedLines = lines.map((line, index) => {
      // Handle bullet points
      if (line.match(/^[\s]*[-*•]\s/)) {
        return (
          <div key={index} className="flex items-start gap-3 my-1">
            <span className="text-blue-500 dark:text-blue-400 mt-1.5 text-xs">
              ●
            </span>
            <span className="flex-1">{line.replace(/^[\s]*[-*•]\s/, "")}</span>
          </div>
        );
      }

      // Handle numbered lists
      if (line.match(/^[\s]*\d+\.\s/)) {
        const number = line.match(/^[\s]*(\d+)\./)[1];
        return (
          <div key={index} className="flex items-start gap-3 my-1">
            <span className="text-blue-500 dark:text-blue-400 font-semibold text-sm min-w-[1.5rem]">
              {number}.
            </span>
            <span className="flex-1">{line.replace(/^[\s]*\d+\.\s/, "")}</span>
          </div>
        );
      }

      return line;
    });

    return formattedLines;
  };

  return (
    <div className="text-sm leading-relaxed">
      {formatMessage(content)}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default MessageFormatter;
