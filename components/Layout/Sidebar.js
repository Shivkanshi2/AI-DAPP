import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiMessageSquare,
  FiSettings,
  FiCreditCard,
  FiBarChart,
  FiPlus,
  FiTrash2,
  FiX,
  FiLink,
  FiShield,
} from "react-icons/fi";
import { useChat } from "../../context/ChatContext";
import { useContract } from "../../context/ContractContext";

const Sidebar = ({ onClose }) => {
  const router = useRouter();
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
    deleteConversation,
  } = useChat();
  const { hasActiveSubscription, getTierName, subscriptionDetails } =
    useContract();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const navigation = [
    {
      name: "Chat",
      href: "/",
      icon: FiMessageSquare,
      gradient: "from-green-400 to-green-600",
    },
    {
      name: "Subscription",
      href: "/subscription",
      icon: FiCreditCard,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Statistics",
      href: "/stats",
      icon: FiBarChart,
      gradient: "from-teal-400 to-green-500",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: FiSettings,
      gradient: "from-gray-500 to-slate-500",
    },
  ];

  const handleDeleteConversation = (convId, e) => {
    e.stopPropagation();
    setShowDeleteConfirm(convId);
  };

  const confirmDelete = (convId) => {
    deleteConversation(convId);
    setShowDeleteConfirm(null);
  };

  const handleNewChat = () => {
    createNewConversation();
    if (router.pathname !== "/") {
      router.push("/");
    }
    if (onClose) onClose();
  };

  const handleConversationClick = (conversation) => {
    setCurrentConversation(conversation);
    if (router.pathname !== "/") {
      router.push("/");
    }
    if (onClose) onClose();
  };

  return (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Green lighting background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-tr from-green-600/10 via-transparent to-green-500/10" />

      {/* Floating green lights */}
      <div className="absolute top-1/4 -left-8 w-16 h-16 bg-green-400/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-8 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <FiLink className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-green-900 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">BlockChat AI</h1>
              <p className="text-xs text-green-200 font-medium">
                Decentralized Intelligence
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-300 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <FiPlus className="w-3 h-3" />
              </div>
              <span className="font-semibold">New Conversation</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-xl`}
                  />
                )}
                <div
                  className={`relative z-10 w-5 h-5 ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white`
                      : "text-gray-400 group-hover:text-white"
                  } rounded-md flex items-center justify-center`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Conversations */}
        <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-green-300 uppercase tracking-wider">
              Recent Conversations
            </h3>
            <div className="w-8 h-px bg-gradient-to-r from-green-500 to-transparent" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                className={`group relative flex items-center justify-between px-3 py-3 text-sm rounded-lg cursor-pointer transition-all duration-300 ${
                  currentConversation?.id === conversation.id
                    ? "bg-white/15 text-white shadow-md backdrop-blur-sm border border-white/20"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      currentConversation?.id === conversation.id
                        ? "bg-green-400 animate-pulse"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="truncate">
                    {conversation.title || `Chat ${index + 1}`}
                  </span>
                </div>

                {showDeleteConfirm === conversation.id ? (
                  <div className="flex items-center gap-2 bg-red-500/20 px-2 py-1 rounded-md backdrop-blur-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(conversation.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 bg-red-500/30 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(null);
                      }}
                      className="text-gray-400 hover:text-gray-300 text-xs font-medium px-2 py-1 bg-gray-500/30 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) =>
                      handleDeleteConversation(conversation.id, e)
                    }
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all p-1 rounded hover:bg-red-500/20"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiMessageSquare className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">No conversations yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Start chatting to see your history
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="p-4 border-t border-white/10">
          <div className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34,197,94,0.3) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiShield className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold text-green-300 uppercase tracking-wide">
                    Subscription
                  </span>
                </div>
                <div
                  className={`relative px-3 py-1 rounded-full text-xs font-bold ${
                    hasActiveSubscription
                      ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border border-green-500/30"
                      : "bg-gradient-to-r from-red-500/30 to-pink-500/30 text-red-300 border border-red-500/30"
                  }`}
                >
                  {hasActiveSubscription && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                  )}
                  <span className="relative">
                    {hasActiveSubscription ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {subscriptionDetails && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      {getTierName(subscriptionDetails[0])} Plan
                    </p>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  {hasActiveSubscription && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Expires:</span>
                      <span className="text-green-300 font-medium">
                        {new Date(
                          Number(subscriptionDetails[2]) * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34,197,94,0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34,197,94,0.7);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
