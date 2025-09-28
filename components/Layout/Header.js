import { useState, useEffect } from "react";
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiZap,
  FiActivity,
} from "react-icons/fi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContract } from "../../context/ContractContext";

const Header = ({ onMenuClick }) => {
  const [darkMode, setDarkMode] = useState(false);
  const {
    remainingQueries,
    hasActiveSubscription,
    getTierName,
    subscriptionDetails,
  } = useContract();

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getSubscriptionColor = (tier) => {
    switch (tier) {
      case 3:
        return "from-yellow-400 to-orange-400";
      case 2:
        return "from-purple-400 to-pink-400";
      case 1:
        return "from-blue-400 to-cyan-400";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const formatQueryCount = (count) => {
    if (count === Number.MAX_SAFE_INTEGER) return "∞";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <header className="relative overflow-hidden">
      {/* Neon background streaks */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-gray-900/90" />
      <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-600/30 blur-3xl animate-light-streak" />
      <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full bg-gradient-to-tl from-pink-400/20 to-purple-500/20 blur-3xl animate-light-streak delay-500" />

      <div className="relative z-10 border-b border-gray-700/50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Menu & Subscription */}
          <div className="flex items-center gap-6">
            <button
              onClick={onMenuClick}
              className="lg:hidden group relative p-2 rounded-xl bg-black/70 border border-blue-500/50 text-blue-400 hover:text-blue-200 shadow-lg hover:shadow-blue-500/50 transition-transform duration-300 hover:scale-105"
            >
              <FiMenu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {hasActiveSubscription && subscriptionDetails && (
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-xl border border-blue-500/40 shadow-lg">
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${getSubscriptionColor(
                      subscriptionDetails[0]
                    )} rounded-lg flex items-center justify-center shadow-md animate-neon-glow`}
                  >
                    <FiZap className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                        {getTierName(subscriptionDetails[0])}
                      </span>
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <FiActivity className="w-3 h-3 text-blue-300" />
                      <span className="text-sm font-bold text-white">
                        Start AI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Dark Mode & Connect */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="group relative p-3 rounded-xl bg-black/60 border border-blue-500/40 text-blue-400 hover:text-white shadow-lg hover:shadow-blue-400/50 transition-transform duration-300 hover:scale-105"
            >
              {darkMode ? (
                <FiSun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <FiMoon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              )}
              <div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                    : "bg-gradient-to-r from-indigo-400/20 to-purple-400/20"
                }`}
              />
            </button>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <div className="relative bg-black/60 rounded-xl border border-blue-500/40 shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === "authenticated");

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
                        {!connected ? (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
                            <span className="relative z-10">Connect Wallet</span>
                          </button>
                        ) : chain.unsupported ? (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="group relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
                          >
                            <div className="w-2 h-2 bg-white/50 rounded-full animate-ping" />
                            <span className="relative z-10">Wrong network</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={openChainModal}
                              className="hidden lg:flex group relative items-center gap-2 px-3 py-2 bg-black/40 border border-blue-500/40 rounded-lg hover:bg-black/60 hover:scale-105 transition-all duration-300"
                            >
                              {chain.hasIcon && chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  className="w-5 h-5 rounded-full"
                                />
                              )}
                              <span className="text-sm font-medium text-white">
                                {chain.name}
                              </span>
                            </button>
                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="group relative flex items-center gap-3 px-4 py-2 bg-black/40 border border-blue-500/40 rounded-lg hover:bg-black/60 hover:scale-105 transition-all duration-300"
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-sm font-medium text-white">
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ""}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom neon streak */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-light-streak" />
      </div>
    </header>
  );
};

export default Header;
