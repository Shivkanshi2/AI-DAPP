import { useState } from "react";
import { FiCopy, FiCheck, FiCode, FiTerminal } from "react-icons/fi";

const MessageFormatter = ({ content, role }) => {
  const [copiedBlocks, setCopiedBlocks] = useState(new Set());

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

  const getLanguageConfig = (language) => {
    const configs = {
      javascript: { color: "from-yellow-400 to-orange-400", icon: FiCode, name: "JavaScript" },
      typescript: { color: "from-blue-400 to-blue-600", icon: FiCode, name: "TypeScript" },
      python: { color: "from-green-400 to-emerald-500", icon: FiCode, name: "Python" },
      html: { color: "from-red-400 to-pink-500", icon: FiCode, name: "HTML" },
      css: { color: "from-blue-500 to-purple-500", icon: FiCode, name: "CSS" },
      json: { color: "from-gray-500 to-gray-600", icon: FiCode, name: "JSON" },
      bash: { color: "from-gray-700 to-black", icon: FiTerminal, name: "Bash" },
      shell: { color: "from-gray-700 to-black", icon: FiTerminal, name: "Shell" },
      sql: { color: "from-indigo-400 to-purple-500", icon: FiCode, name: "SQL" },
      solidity: { color: "from-purple-500 to-pink-500", icon: FiCode, name: "Solidity" },
    };

    return configs[language?.toLowerCase()] || {
      color: "from-gray-500 to-gray-600",
      icon: FiCode,
      name: language?.charAt(0).toUpperCase() + language?.slice(1) || "Code",
    };
  };

  const formatMessage = (text) => {
    if (!text) return text;
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        parts.push(<span key={`text-${lastIndex}`} className="whitespace-pre-wrap">{formatInlineCode(textBefore)}</span>);
      }

      const language = match[1] || "text";
      const code = match[2].trim();
      const currentBlockIndex = blockIndex++;
      const langConfig = getLanguageConfig(language);
      const IconComponent = langConfig.icon;

      parts.push(
        <div
          key={`code-${match.index}`}
          className="my-6 relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl border border-gray-700/50 overflow-hidden"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between px-6 py-3 bg-gray-800/80 border-b border-gray-600/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-gradient-to-br ${langConfig.color} rounded-md flex items-center justify-center shadow-md`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white">{langConfig.name}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">Ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(code, currentBlockIndex)}
              className={`flex items-center gap-2 px-3 py-1 rounded-md font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
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
                  <FiCopy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Code body */}
          <div className="relative p-5 overflow-x-auto bg-gray-900/80 custom-scrollbar">
            <pre className="text-sm font-mono text-gray-100 leading-relaxed">
              <code>
                {code.split("\n").map((line, i) => (
                  <div key={i} className="flex items-start group hover:bg-gray-800/50 -mx-2 px-2 py-0.5 rounded transition-colors duration-200">
                    <span className="text-gray-500 select-none w-8 text-right mr-4 text-xs font-medium opacity-60 group-hover:opacity-100">{i + 1}</span>
                    <span className="flex-1">{line || " "}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {copiedBlocks.has(currentBlockIndex) && (
            <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/30 rounded-2xl animate-pulse" />
          )}
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const textAfter = text.slice(lastIndex);
      parts.push(<span key={`text-${lastIndex}`} className="whitespace-pre-wrap">{formatInlineCode(textAfter)}</span>);
    }

    return parts.length > 0 ? parts : formatInlineCode(text);
  };

  const formatInlineCode = (text) => {
    const inlineCodeRegex = /`([^`]+)`/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

      parts.push(
        <code
          key={`inline-${match.index}`}
          className={`relative inline-flex items-center px-2 py-1 mx-0.5 rounded-md text-sm font-mono font-medium transition-all duration-200 hover:scale-105 ${
            role === "user"
              ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-50 border border-blue-400/20"
              : "bg-gradient-to-r from-gray-700/20 to-gray-800/20 text-gray-100 border border-gray-600/30 shadow-sm"
          }`}
        >
          {match[1]}
        </code>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="text-sm leading-relaxed space-y-2">
      {formatMessage(content)}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
};

export default MessageFormatter;
