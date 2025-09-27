import { useState, useEffect } from "react";
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiZap,
  FiInbox,
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

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getSubscriptionColor = (tier) => {
    switch (tier) {
      case 3:
        return "from-yellow-500 to-orange-500";
      case 2:
        return "from-purple-500 to-pink-500";
      case 1:
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
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
      {/* Background with gradient and glass effect */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/30 dark:via-transparent dark:to-purple-950/30" />

      {/* Subtle animated background elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-tl from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 border-b border-white/20 dark:border-gray-700/30">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center gap-6">
            {/* Mobile menu button with enhanced styling */}
            <button
              onClick={onMenuClick}
              className="lg:hidden group relative p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FiMenu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Enhanced subscription info */}
            {hasActiveSubscription && subscriptionDetails && (
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
                  {/* Tier indicator */}
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${getSubscriptionColor(
                      subscriptionDetails[0]
                    )} rounded-lg flex items-center justify-center shadow-md`}
                  >
                    <FiZap className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {getTierName(subscriptionDetails[0])}
                      </span>
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <FiActivity className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {/* {formatQueryCount(remainingQueries)} queries */}{" "}
                        Start AI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile subscription info */}
            {hasActiveSubscription && subscriptionDetails && (
              <div className="hidden lg:flex items-center">
                <div
                  className={`w-6 h-6 bg-gradient-to-br ${getSubscriptionColor(
                    subscriptionDetails[0]
                  )} rounded-md flex items-center justify-center shadow-md`}
                >
                  <FiZap className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Enhanced dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="group relative p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="relative z-10">
                {darkMode ? (
                  <FiSun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <FiMoon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </div>
              <div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
                    : "bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                }`}
              />
            </button>

            {/* Enhanced Connect Button wrapper */}
            <div className="relative ">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
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
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={openConnectModal}
                                type="button"
                                className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
                                <span className="relative z-10">
                                  Connect Wallet
                                </span>
                              </button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button
                                onClick={openChainModal}
                                type="button"
                                className="group relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              >
                                <div className="w-2 h-2 bg-white/50 rounded-full animate-ping" />
                                <span className="relative z-10">
                                  Wrong network
                                </span>
                              </button>
                            );
                          }

                          return (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={openChainModal}
                                className="hidden lg:flex group relative  items-center gap-2 px-3 py-2 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg hover:bg-white/60 dark:hover:bg-gray-600/60 transition-all duration-300 hover:scale-105"
                              >
                                {chain.hasIcon && (
                                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white">
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? "Chain icon"}
                                        src={chain.iconUrl}
                                        className="w-5 h-5"
                                      />
                                    )}
                                  </div>
                                )}
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {chain.name}
                                </span>
                              </button>

                              <button
                                onClick={openAccountModal}
                                type="button"
                                className="group relative flex items-center gap-3 px-4 py-2 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg hover:bg-white/60 dark:hover:bg-gray-600/60 transition-all duration-300 hover:scale-105"
                              >
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account.displayName}
                                  {account.displayBalance
                                    ? ` (${account.displayBalance})`
                                    : ""}
                                </span>
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
    </header>
  );
};

export default Header;
