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
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-gradient-to-b from-[#0b1e3c] to-[#14294f] overflow-hidden">
      {/* Soft animated shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[#00c2cb]/30 to-[#ffd97d]/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-16 w-80 h-80 bg-gradient-to-tr from-[#ffd97d]/25 to-[#00c2cb]/15 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-[#4ade80]/20 to-[#14b8a6]/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-xl w-full">
        {/* Logo section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-5">
            <div className="absolute -inset-3 bg-gradient-to-r from-[#ffd97d] via-[#00c2cb] to-[#4ade80] rounded-full blur-xl opacity-50 animate-pulse-slow" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-[#0b1e3c] via-[#14294f] to-[#0b1e3c] rounded-full flex items-center justify-center shadow-lg">
              <FiZap className="w-10 h-10 text-[#ffd97d] animate-bounce" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-2 border-[#0b1e3c] rounded-full animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-[#ffd97d] mb-2">
            BlockChat AI
          </h1>
          <p className="text-[#00c2cb] text-lg">
            Decentralized AI Intelligence
          </p>
        </div>

        {/* Connect Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ffd97d]/30 via-[#00c2cb]/30 to-[#4ade80]/30 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
          <div className="relative bg-[#0f2345]/80 backdrop-blur-xl rounded-3xl border border-[#ffd97d]/20 shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#ffd97d] mb-2">
                🔗 Connect Your Wallet
              </h2>
              <p className="text-[#00c2cb] text-sm">
                Securely access the blockchain AI ecosystem
              </p>
            </div>

            {/* Connect Button */}
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
                      {!connected && (
                        <button
                          onClick={openConnectModal}
                          className="group relative w-full overflow-hidden bg-gradient-to-r from-[#00c2cb] via-[#4ade80] to-[#ffd97d] hover:from-[#00b8bf] hover:via-[#3ed178] hover:to-[#fcd670] text-white py-4 px-6 rounded-2xl font-bold text-lg transition-transform duration-300 transform hover:scale-[1.03] shadow-lg hover:shadow-2xl"
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300" />
                          <div className="relative flex items-center justify-center gap-3">
                            <FiZap className="w-5 h-5 animate-bounce" />
                            <span>Connect Wallet</span>
                          </div>
                        </button>
                      )}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-5">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#14294f]/60 backdrop-blur-sm border border-[#ffd97d]/20 hover:bg-[#14294f]/80 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ffd97d] to-[#00c2cb] rounded-xl flex items-center justify-center shadow-lg">
                  <FiShield className="w-6 h-6 text-[#0b1e3c]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#ffd97d] text-lg mb-1">
                    🛡️ Secure & Private
                  </h3>
                  <p className="text-[#00c2cb] text-sm">
                    End-to-end encryption with decentralized storage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#14294f]/60 backdrop-blur-sm border border-[#ffd97d]/20 hover:bg-[#14294f]/80 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00c2cb] to-[#4ade80] rounded-xl flex items-center justify-center shadow-lg">
                  <FiCpu className="w-6 h-6 text-[#0b1e3c]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#ffd97d] text-lg mb-1">
                    ⚡ Advanced AI Models
                  </h3>
                  <p className="text-[#00c2cb] text-sm">
                    Access multiple AI models based on your subscription tier.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#14294f]/60 backdrop-blur-sm border border-[#ffd97d]/20 hover:bg-[#14294f]/80 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4ade80] to-[#ffd97d] rounded-xl flex items-center justify-center shadow-lg">
                  <FiGlobe className="w-6 h-6 text-[#0b1e3c]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#ffd97d] text-lg mb-1">
                    🌐 Blockchain Powered
                  </h3>
                  <p className="text-[#00c2cb] text-sm">
                    Transparent smart contracts and secure AI usage tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-5 border-t border-[#ffd97d]/30 flex justify-center gap-6 text-sm text-[#00c2cb]">
              <div className="flex items-center gap-2">
                <FiLock className="w-4 h-4" /> Zero-Trust
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4" /> 10K+ Users
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-[#00c2cb]">
          <p className="text-sm">
            Powered by <span className="font-semibold text-[#ffd97d]">Ethereum</span> • Built with <span className="font-semibold text-[#4ade80]">Next.js</span> • Secured by Smart Contracts
          </p>
          <div className="mt-3 flex justify-center gap-4 text-xs">
            <span>🔒 SSL Encrypted</span>
            <span>⚡ Gas Optimized</span>
            <span>🛡️ Audited Contracts</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          33% { transform: translate(20px,-25px) rotate(60deg); }
          66% { transform: translate(-15px,20px) rotate(120deg); }
        }
        @keyframes float-slower {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          33% { transform: translate(-25px,-30px) rotate(-60deg); }
          66% { transform: translate(20px,15px) rotate(-120deg); }
        }
        .animate-float-slow { animation: float-slow 22s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 28s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ConnectWallet;
