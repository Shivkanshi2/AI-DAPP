import { useState } from "react";
import {
  FiCheck,
  FiX,
  FiCreditCard,
  FiZap,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiCpu,
  FiLock,
  FiGlobe,
} from "react-icons/fi";
import { FaInfinity } from "react-icons/fa";

import toast from "react-hot-toast";
import { useContract } from "../context/ContractContext";
import { formatEther } from "viem";

const SubscriptionPage = () => {
  const [selectedTier, setSelectedTier] = useState(1);
  const [isYearly, setIsYearly] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const {
    subscribe,
    cancelSubscription,
    subscriptionDetails,
    hasActiveSubscription,
    getTierName,
    getTierPricing,
    basicTierPricing,
    premiumTierPricing,
    enterpriseTierPricing,
    loading,
    address,
  } = useContract();

  const tiers = [
    {
      id: 1,
      name: "Basic",
      icon: FiCpu,
      color: "blue",
      description: "Perfect for casual users",
      pricing: basicTierPricing,
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "1,000 queries per month",
        "Basic AI chat",
        "Standard response time",
        "Email support",
        "Mobile access",
      ],
    },
    {
      id: 2,
      name: "Premium",
      icon: FiStar,
      color: "purple",
      description: "For power users and professionals",
      pricing: premiumTierPricing,
      popular: true,
      gradient: "from-purple-500 to-pink-500",
      features: [
        "10,000 queries per month",
        "Advanced AI capabilities",
        "Priority response time",
        "Priority support",
        "API access",
        "Custom prompts",
        "Export conversations",
      ],
    },
    {
      id: 3,
      name: "Enterprise",
      icon: FaInfinity,
      color: "green",
      description: "For teams and businesses",
      pricing: enterpriseTierPricing,
      gradient: "from-yellow-500 to-orange-500",
      features: [
        "Unlimited queries",
        "Advanced AI with custom training",
        "Fastest response time",
        "24/7 dedicated support",
        "Full API access",
        "Custom integrations",
        "Team management",
        "Analytics dashboard",
        "SLA guarantee",
      ],
    },
  ];

  const handleSubscribe = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    const tierPricing = getTierPricing(selectedTier);
    if (!tierPricing) {
      toast.error(
        "Unable to get pricing information. Please make sure the contract is deployed and configured."
      );
      return;
    }

    try {
      const price = isYearly ? tierPricing[1] : tierPricing[0];
      const priceInEth = formatEther(price);

      console.log("Subscribing with:", {
        tier: selectedTier,
        isYearly,
        autoRenew,
        price: priceInEth,
      });

      setIsSubscribing(true);
      await subscribe(selectedTier, isYearly, autoRenew, priceInEth);
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.success("Subscription failed. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!hasActiveSubscription) {
      toast.error("You don't have an active subscription to cancel");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to cancel your subscription? You will still have access until the end of your billing period."
      )
    ) {
      try {
        await cancelSubscription();
      } catch (error) {
        console.error("Failed to cancel subscription:", error);
        toast.error("Failed to cancel subscription. Please try again.");
      }
    }
  };

  const getColorClasses = (color, type = "bg") => {
    const colors = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600",
        border: "border-blue-200",
        gradient: "from-blue-500 to-blue-600",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        border: "border-purple-200",
        gradient: "from-purple-500 to-purple-600",
      },
      green: {
        bg: "bg-green-500",
        text: "text-green-600",
        border: "border-green-200",
        gradient: "from-green-500 to-green-600",
      },
    };
    return colors[color][type];
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <FiZap className="w-8 h-8 text-white relative z-10" />
              </div>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Choose Your AI Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock the power of decentralized AI with our blockchain-secured
              subscription plans. Experience the future of intelligent
              conversations.
            </p>

            {/* Enhanced Billing toggle */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    !isYearly
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Monthly
                </span>
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isYearly
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Yearly
                </span>
              </div>

              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                  isYearly
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                    isYearly ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>

              {isYearly && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                  💰 Save 15%
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Current subscription status */}
          {hasActiveSubscription && subscriptionDetails && (
            <div className="mb-12 max-w-2xl mx-auto">
              <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FiShield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          🎉 Active Subscription
                        </h3>
                        <div className="space-y-1">
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Plan:</span>{" "}
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                              {getTierName(subscriptionDetails[0])}
                            </span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Status:</span>{" "}
                            <span className="text-green-600 dark:text-green-400 font-bold">
                              ✅ Active
                            </span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Expires:</span>{" "}
                            <span className="font-bold">
                              {new Date(
                                Number(subscriptionDetails[2]) * 1000
                              ).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Auto-renew:</span>{" "}
                            <span className="font-bold">
                              {subscriptionDetails[4]
                                ? "🔄 Enabled"
                                : "⏸️ Disabled"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={loading}
                      className="group relative px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      <span className="relative z-10">Cancel Plan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tiers.map((tier) => {
              const pricing = tier.pricing;
              const isSelected = selectedTier === tier.id;
              const monthlyPrice = pricing ? formatEther(pricing[0]) : "0";
              const yearlyPrice = pricing ? formatEther(pricing[1]) : "0";
              const displayPrice = isYearly ? yearlyPrice : monthlyPrice;
              const Icon = tier.icon;

              return (
                <div
                  key={tier.id}
                  className={`group relative cursor-pointer transition-all duration-500 hover:scale-105 ${
                    tier.popular ? "lg:scale-110" : ""
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {/* Glow effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${
                      tier.gradient
                    } rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500 ${
                      isSelected ? "opacity-50" : ""
                    }`}
                  />

                  <div
                    className={`relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-300 ${
                      isSelected
                        ? "border-blue-500/50 shadow-blue-500/25"
                        : "border-white/20 dark:border-gray-700/20"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg animate-pulse">
                          ⭐ Most Popular
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      {/* Enhanced Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${tier.gradient} rounded-2xl flex items-center justify-center shadow-xl`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {tier.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 font-medium">
                            {tier.description}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {displayPrice}
                          </span>
                          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            ETH
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            /{isYearly ? "year" : "month"}
                          </span>
                        </div>
                        {isYearly && (
                          <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 text-sm font-bold px-3 py-1 rounded-full inline-block">
                            💰{" "}
                            {(
                              ((parseFloat(monthlyPrice) * 12 -
                                parseFloat(yearlyPrice)) /
                                (parseFloat(monthlyPrice) * 12)) *
                              100
                            ).toFixed(0)}
                            % savings vs monthly
                          </div>
                        )}
                      </div>

                      {/* Enhanced Features */}
                      <div className="space-y-4 mb-8">
                        {tier.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 group/feature"
                          >
                            <div
                              className={`w-5 h-5 bg-gradient-to-br ${tier.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md`}
                            >
                              <FiCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium group-hover/feature:text-gray-900 dark:group-hover/feature:text-white transition-colors">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Enhanced Select button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTier(tier.id);
                        }}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                          isSelected
                            ? `bg-gradient-to-r ${tier.gradient} text-white shadow-lg`
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {isSelected ? "✅ Selected" : "Select Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Subscription options */}
          <div className="max-w-lg mx-auto mb-12">
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <FiLock className="w-6 h-6 text-blue-500" />
                  Subscription Options
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl backdrop-blur-sm">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRenew}
                        onChange={(e) => setAutoRenew(e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          🔄 Enable Auto-Renewal
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Ensure uninterrupted access to your AI subscription
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      💡 Smart contracts automatically handle renewals securely
                      on the blockchain. You can disable auto-renewal anytime
                      without fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Subscribe button */}
          <div className="text-center mb-16">
            <button
              onClick={handleSubscribe}
              disabled={isSubscribing || loading || !address}
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-400 hover:via-purple-400 hover:to-indigo-500 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative z-10 flex items-center gap-4">
                {isSubscribing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Blockchain Transaction...</span>
                  </>
                ) : (
                  <>
                    <FiZap className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span>
                      Subscribe to{" "}
                      {tiers.find((t) => t.id === selectedTier)?.name} Plan
                    </span>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                  </>
                )}
              </div>
            </button>

            {!address && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 px-6 py-3 rounded-2xl inline-block font-medium">
                🔌 Please connect your wallet to subscribe
              </div>
            )}
          </div>

          {/* Enhanced FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Everything you need to know about our blockchain subscriptions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: FiCreditCard,
                  question: "How does blockchain billing work?",
                  answer:
                    "You pay upfront using cryptocurrency. Your subscription is managed through smart contracts on the blockchain, ensuring complete transparency, security, and immutable records of your payments.",
                },
                {
                  icon: FiShield,
                  question: "Can I cancel anytime?",
                  answer:
                    "Absolutely! You can cancel your subscription at any time directly through the blockchain. You'll continue to have full access until the end of your current billing period with no additional charges.",
                },
                {
                  icon: FiZap,
                  question: "What happens if I exceed my query limit?",
                  answer:
                    "You'll need to wait until your next billing period or upgrade to a higher tier for immediate access. Enterprise users enjoy unlimited queries with no restrictions.",
                },
                {
                  icon: FiLock,
                  question: "Is my data secure?",
                  answer:
                    "Yes! All conversations are stored locally in your browser with end-to-end encryption. We never store your chat data on our servers, ensuring complete privacy and security.",
                },
              ].map((faq, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <faq.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

export default SubscriptionPage;
