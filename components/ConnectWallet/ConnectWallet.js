import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  FiZap,
  FiShield,
  FiGlobe,
  FiLock,
  FiCpu,
  FiUsers,
} from "react-icons/fi";

const ConnectWallet = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-500/30 to-pink-600/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Logo and title section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full blur-xl opacity-50 animate-pulse" />

            {/* Main logo container */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
              <FiZap className="w-10 h-10 text-white relative z-10 animate-pulse" />

              {/* Connection status indicator */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            BlockChat AI
          </h1>
          <p className="text-xl text-blue-200 font-medium mb-2">
            Decentralized Intelligence Network
          </p>
          <p className="text-gray-400 leading-relaxed">
            Connect your wallet to access the future of AI-powered conversations
            secured by blockchain technology
          </p>
        </div>

        {/* Main connect card */}
        <div className="relative group">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />

          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
            {/* Card header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-3">
                🔗 Connect Your Wallet
              </h2>
              <p className="text-blue-200">
                Secure access to the decentralized AI ecosystem
              </p>
            </div>

            {/* Enhanced connect button */}
            <div className="mb-8">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-400 hover:via-purple-400 hover:to-indigo-500 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative flex items-center justify-center gap-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                                <span>Connect Wallet</span>
                                <FiZap className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                              </div>
                              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            </button>
                          );
                        }
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Enhanced features grid */}
            <div className="grid grid-cols-1 gap-6">
              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiShield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">
                    🛡️ Military-Grade Security
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    End-to-end encryption with decentralized storage ensures
                    your conversations remain private and secure
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiCpu className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">
                    ⚡ Multi-Tier AI Models
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Access GPT-3.5 Turbo, Enhanced, and GPT-4 models based on
                    your subscription tier
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiGlobe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">
                    🌐 Blockchain Infrastructure
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Transparent smart contract subscriptions with automatic
                    renewal and usage tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-6 text-sm text-blue-300">
                <div className="flex items-center gap-2">
                  <FiLock className="w-4 h-4" />
                  <span>Zero-Trust Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  <span>10K+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-blue-300 font-medium">
              Network Status: Online
            </span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500" />
          </div>

          <p className="text-gray-400 text-sm">
            Powered by{" "}
            <span className="text-blue-400 font-semibold">Ethereum</span> •
            Built with{" "}
            <span className="text-purple-400 font-semibold">Next.js</span> •
            Secured by{" "}
            <span className="text-green-400 font-semibold">
              Smart Contracts
            </span>
          </p>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>🔒 SSL Encrypted</span>
            <span>⚡ Gas Optimized</span>
            <span>🛡️ Audited Contracts</span>
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

export default ConnectWallet;
