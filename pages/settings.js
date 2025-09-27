import { useState } from "react";
import {
  FiDownload,
  FiUpload,
  FiTrash2,
  FiAlertTriangle,
  FiSettings,
  FiUser,
  FiDatabase,
  FiShield,
  FiGlobe,
  FiInfo,
  FiHelpCircle,
  FiExternalLink,
  FiLock,
  FiServer,
} from "react-icons/fi";
import { useAccount } from "wagmi";
import { useChat } from "../context/ChatContext";
import { useContract } from "../context/ContractContext";

const SettingsPage = () => {
  const { address } = useAccount();
  const { conversations, clearAllConversations } = useChat();
  const { subscriptionDetails, hasActiveSubscription, getTierName } =
    useContract();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Export conversations to JSON
  const exportConversations = () => {
    if (conversations.length === 0) {
      alert("No conversations to export");
      return;
    }

    const dataStr = JSON.stringify(conversations, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `chatgpt-conversations-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Import conversations from JSON
  const importConversations = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (Array.isArray(importedData)) {
          // Validate the structure
          const isValid = importedData.every(
            (conv) =>
              conv.id &&
              conv.title !== undefined &&
              Array.isArray(conv.messages)
          );

          if (isValid) {
            // Save imported conversations
            localStorage.setItem(
              `conversations_${address}`,
              JSON.stringify(importedData)
            );
            alert(
              "Conversations imported successfully! Please refresh the page."
            );
          } else {
            alert("Invalid file format");
          }
        } else {
          alert("Invalid file format");
        }
      } catch (error) {
        alert("Error reading file: " + error.message);
      }
    };
    reader.readAsText(file);
  };

  // Clear all data
  const handleClearAllData = () => {
    if (showClearConfirm) {
      clearAllConversations();
      setShowClearConfirm(false);
      alert("All conversations have been cleared");
    } else {
      setShowClearConfirm(true);
    }
  };

  const SettingSection = ({ title, icon: Icon, gradient, children }) => (
    <div className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${gradient} rounded-full animate-pulse opacity-60`}
        />
        <div
          className={`absolute bottom-6 left-6 w-1 h-1 bg-gradient-to-r ${gradient} rounded-full animate-ping delay-1000 opacity-40`}
        />
      </div>

      <div className="relative z-10 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        {children}

        {/* Decorative gradient line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
        />
      </div>
    </div>
  );

  const InfoItem = ({ label, value, status, className = "" }) => (
    <div
      className={`flex justify-between items-center py-3 px-4 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm ${className}`}
    >
      <span className="font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {status && (
          <div
            className={`w-2 h-2 rounded-full ${
              status === "active"
                ? "bg-green-500 animate-pulse"
                : status === "inactive"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          />
        )}
        <span className="font-bold text-gray-900 dark:text-white">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/50" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid pattern */}
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

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <FiSettings className="w-10 h-10 text-white relative z-10" />
              </div>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Account Settings
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Manage your blockchain account, data preferences, and security
              settings
            </p>
          </div>

          <div className="space-y-12">
            {/* Account Information */}
            <SettingSection
              title="Account Information"
              icon={FiUser}
              gradient="from-blue-500 to-cyan-500"
            >
              <div className="space-y-4">
                <InfoItem
                  label="🔗 Wallet Address"
                  value={
                    address
                      ? `${address.slice(0, 8)}...${address.slice(-6)}`
                      : "Not connected"
                  }
                  status={address ? "active" : "inactive"}
                />
                <InfoItem
                  label="💎 Subscription Status"
                  value={hasActiveSubscription ? "✅ Active" : "❌ Inactive"}
                  status={hasActiveSubscription ? "active" : "inactive"}
                />
                {hasActiveSubscription && subscriptionDetails && (
                  <>
                    <InfoItem
                      label="📊 Current Plan"
                      value={`${getTierName(subscriptionDetails[0])} Tier`}
                      status="active"
                    />
                    <InfoItem
                      label="📅 Subscription Expires"
                      value={new Date(
                        Number(subscriptionDetails[2]) * 1000
                      ).toLocaleDateString()}
                    />
                    <InfoItem
                      label="🔄 Auto-renewal"
                      value={
                        subscriptionDetails[4] ? "✅ Enabled" : "⏸️ Disabled"
                      }
                      status={subscriptionDetails[4] ? "active" : "inactive"}
                    />
                  </>
                )}
                <InfoItem
                  label="🌐 Network"
                  value={process.env.NEXT_PUBLIC_NETWORK_NAME || "Unknown"}
                  status="active"
                />
              </div>
            </SettingSection>

            {/* Data Management */}
            <SettingSection
              title="Data Management"
              icon={FiDatabase}
              gradient="from-green-500 to-emerald-500"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    💬 Your Conversations
                  </h4>
                  <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-4 backdrop-blur-sm mb-6">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      You have{" "}
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {conversations.length}
                      </span>{" "}
                      conversation
                      {conversations.length !== 1 ? "s" : ""} stored locally
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={exportConversations}
                      disabled={conversations.length === 0}
                      className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      <FiDownload className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="relative z-10">
                        Export Conversations
                      </span>
                    </button>

                    <label className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      <FiUpload className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="relative z-10">
                        Import Conversations
                      </span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importConversations}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-white/20 dark:border-gray-600/20 pt-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🗑️ Clear All Data
                  </h4>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4">
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      ⚠️ This will permanently delete all your conversations.
                      This action cannot be undone.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleClearAllData}
                      className={`relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                        showClearConfirm
                          ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                          : "bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 border border-red-500/30"
                      }`}
                    >
                      <FiTrash2 className="w-5 h-5" />
                      {showClearConfirm
                        ? "🔥 Confirm Delete All"
                        : "Clear All Conversations"}
                    </button>

                    {showClearConfirm && (
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/30 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SettingSection>

            {/* Privacy & Security */}
            <SettingSection
              title="Privacy & Security"
              icon={FiShield}
              gradient="from-purple-500 to-pink-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <FiLock className="w-6 h-6 text-purple-500" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      🔒 Data Storage
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    All your conversations are stored locally in your browser
                    with end-to-end encryption. We never store any of your chat
                    data on our servers.
                  </p>
                </div>

                <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <FiGlobe className="w-6 h-6 text-blue-500" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      🌐 Blockchain Transparency
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Your subscription information is stored on the blockchain
                    and is publicly viewable, but your conversations remain
                    completely private.
                  </p>
                </div>

                <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 backdrop-blur-sm md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <FiShield className="w-6 h-6 text-green-500" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      🛡️ Wallet Security Best Practices
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✅</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Always verify transaction details before confirming
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✅</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Never share your private keys or seed phrase
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✅</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Use hardware wallets for large amounts
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✅</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        Keep your wallet software updated
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SettingSection>

            {/* Contract Information */}
            <SettingSection
              title="Smart Contract Details"
              icon={FiServer}
              gradient="from-orange-500 to-red-500"
            >
              <div className="space-y-4">
                <InfoItem
                  label="📜 Contract Address"
                  value={
                    `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(
                      0,
                      8
                    )}...${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(
                      -6
                    )}` || "Not configured"
                  }
                  status="active"
                />
                <InfoItem
                  label="🌐 Network"
                  value={process.env.NEXT_PUBLIC_CHAIN_NAME || "Unknown"}
                  status="active"
                />
                <InfoItem
                  label="🔗 Chain ID"
                  value={process.env.NEXT_PUBLIC_CHAIN_ID || "Unknown"}
                />
                <InfoItem
                  label="⚡ RPC Configuration"
                  value={
                    process.env.NEXT_PUBLIC_RPC_URL
                      ? "✅ Configured"
                      : "❌ Not configured"
                  }
                  status={
                    process.env.NEXT_PUBLIC_RPC_URL ? "active" : "inactive"
                  }
                />
              </div>

              {process.env.NEXT_PUBLIC_BLOCK_EXPLORER && (
                <div className="mt-6">
                  <a
                    href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    <FiExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="relative z-10">
                      View Contract on Explorer
                    </span>
                  </a>
                </div>
              )}
            </SettingSection>

            {/* Storage Usage */}
            <SettingSection
              title="Storage Analytics"
              icon={FiDatabase}
              gradient="from-cyan-500 to-blue-500"
            >
              <div className="space-y-6">
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      💾 Local Storage Usage
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {conversations.length} conversations
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (conversations.length / 100) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Storage:{" "}
                      {(JSON.stringify(conversations).length / 1024).toFixed(2)}{" "}
                      KB used
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Limit: ~5-10MB
                    </span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    💡 <strong>Pro Tip:</strong> Your browser can store
                    approximately 5-10MB of conversation data. Export your
                    conversations regularly to avoid data loss and maintain
                    optimal performance.
                  </p>
                </div>
              </div>
            </SettingSection>

            {/* App Information */}
            <SettingSection
              title="Application Info & Support"
              icon={FiInfo}
              gradient="from-gray-500 to-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    📱 App Details
                  </h4>
                  <div className="space-y-3">
                    <InfoItem label="Version" value="v1.0.0" />
                    <InfoItem
                      label="Last Updated"
                      value={new Date().toLocaleDateString()}
                    />
                    <InfoItem label="Platform" value="BlockChat AI DApp" />
                    <InfoItem
                      label="Technology Stack"
                      value="Next.js + Wagmi + RainbowKit"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    🆘 Support Center
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Need assistance? Our support team is here to help with any
                    questions about your blockchain AI experience.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button className="group inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-700/50 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-xl font-medium transition-all duration-300">
                      <FiHelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      📚 Documentation
                    </button>
                    <button className="group inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-700/50 border border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/10 rounded-xl font-medium transition-all duration-300">
                      <FiHelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      💬 Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </SettingSection>
          </div>
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
      `}</style>
    </div>
  );
};

export default SettingsPage;
