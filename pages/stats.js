import { useEffect, useState } from "react";
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiMessageSquare,
  FiActivity,
  FiClock,
  FiUser,
  FiCalendar,
  FiBarChart,
  FiPieChart,
  FiTarget,
  FiZap,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
import { useContract } from "../context/ContractContext";
import { useChat } from "../context/ChatContext";

const StatsPage = () => {
  const {
    contractStats,
    subscriptionDetails,
    remainingQueries,
    hasActiveSubscription,
    getTierName,
    refetchStats,
  } = useContract();

  const { conversations } = useChat();
  const [personalStats, setPersonalStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    averageMessagesPerConversation: 0,
    oldestConversation: null,
    newestConversation: null,
    mostActiveDay: null,
  });

  // Calculate personal statistics
  useEffect(() => {
    if (conversations.length > 0) {
      const totalMessages = conversations.reduce(
        (acc, conv) => acc + conv.messages.length,
        0
      );
      const averageMessages = totalMessages / conversations.length;

      const sortedConversations = [...conversations].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      // Calculate daily message distribution
      const dailyMessages = {};
      conversations.forEach((conv) => {
        conv.messages.forEach((msg) => {
          const day = new Date(msg.timestamp).toDateString();
          dailyMessages[day] = (dailyMessages[day] || 0) + 1;
        });
      });

      const mostActiveDay = Object.entries(dailyMessages).reduce(
        (max, [day, count]) =>
          count > (max.count || 0) ? { day, count } : max,
        {}
      );

      setPersonalStats({
        totalConversations: conversations.length,
        totalMessages,
        averageMessagesPerConversation: Math.round(averageMessages * 10) / 10,
        oldestConversation: sortedConversations[0],
        newestConversation: sortedConversations[sortedConversations.length - 1],
        mostActiveDay: mostActiveDay.day ? mostActiveDay : null,
      });
    }
  }, [conversations]);

  // Refresh contract stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetchStats]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    gradient,
    subtitle,
    trend,
    large = false,
  }) => (
    <div
      className={`group relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
        large ? "md:col-span-2" : ""
      }`}
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${gradient} rounded-full animate-pulse opacity-60`}
        />
        <div
          className={`absolute bottom-6 left-6 w-1 h-1 bg-gradient-to-r ${gradient} rounded-full animate-ping delay-1000 opacity-40`}
        />
      </div>

      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                trend.positive
                  ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
              }`}
            >
              <FiTrendingUp
                className={`w-4 h-4 ${
                  !trend.positive && "transform rotate-180"
                }`}
              />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div>
          <h3
            className={`font-bold text-gray-900 dark:text-white mb-2 ${
              large ? "text-4xl" : "text-3xl"
            }`}
          >
            {value}
          </h3>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
            {title}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Decorative gradient line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
        />
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateWithTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <FiBarChart className="w-10 h-10 text-white relative z-10" />
              </div>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Track your AI conversations, subscription usage, and platform
              metrics in real-time
            </p>
          </div>

          {/* Personal Statistics */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Your Activity
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Personal usage statistics and insights
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <StatCard
                title="Total Conversations"
                value={personalStats.totalConversations.toLocaleString()}
                icon={FiMessageSquare}
                gradient="from-blue-500 to-cyan-500"
                subtitle="All time discussions"
              />

              <StatCard
                title="Total Messages"
                value={personalStats.totalMessages.toLocaleString()}
                icon={FiActivity}
                gradient="from-green-500 to-emerald-500"
                subtitle="Sent and received"
              />

              <StatCard
                title="Avg Messages per Chat"
                value={personalStats.averageMessagesPerConversation}
                icon={FiTrendingUp}
                gradient="from-purple-500 to-pink-500"
                subtitle="Conversation depth"
              />

              <StatCard
                title="Queries Remaining"
                value={
                  remainingQueries === Number.MAX_SAFE_INTEGER
                    ? "∞"
                    : remainingQueries.toLocaleString()
                }
                icon={FiTarget}
                gradient="from-orange-500 to-red-500"
                subtitle="This billing period"
              />
            </div>

            {/* Enhanced Personal Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Conversation Timeline */}
              <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FiClock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Conversation Timeline
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {personalStats.oldestConversation && (
                      <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl backdrop-blur-sm">
                        <FiClock className="w-6 h-6 text-blue-500" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            🚀 First Conversation
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDateWithTime(
                              personalStats.oldestConversation.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {personalStats.newestConversation && (
                      <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl backdrop-blur-sm">
                        <FiCalendar className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            ⭐ Latest Conversation
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDateWithTime(
                              personalStats.newestConversation.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {personalStats.mostActiveDay && (
                      <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl backdrop-blur-sm">
                        <FiActivity className="w-6 h-6 text-purple-500" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            🔥 Most Active Day
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {personalStats.mostActiveDay.day} (
                            {personalStats.mostActiveDay.count} messages)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Subscription Info */}
              <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FiShield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Subscription Details
                    </h3>
                  </div>

                  {hasActiveSubscription && subscriptionDetails ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Plan
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {getTierName(subscriptionDetails[0])}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-bold bg-green-500/20 text-green-700 dark:text-green-300 rounded-full border border-green-500/30">
                          ✅ Active
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Started
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatDate(
                            new Date(
                              Number(subscriptionDetails[1]) * 1000
                            ).toISOString()
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Expires
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatDate(
                            new Date(
                              Number(subscriptionDetails[2]) * 1000
                            ).toISOString()
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Auto-renew
                        </span>
                        <span
                          className={`font-bold ${
                            subscriptionDetails[4]
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {subscriptionDetails[4]
                            ? "🔄 Enabled"
                            : "⏸️ Disabled"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                        <FiZap className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                        No active subscription
                      </p>
                      <a
                        href="/subscription"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <FiZap className="w-5 h-5" />
                        Subscribe Now
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FiGlobe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Platform Metrics
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time blockchain statistics and network data
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard
                title="Total Revenue"
                value={`${parseFloat(contractStats.totalRevenue).toFixed(
                  4
                )} ETH`}
                icon={FiDollarSign}
                gradient="from-green-500 to-emerald-500"
                subtitle="All time platform earnings"
                large={false}
              />

              <StatCard
                title="Total Subscribers"
                value={contractStats.totalSubscribers.toLocaleString()}
                icon={FiUsers}
                gradient="from-blue-500 to-cyan-500"
                subtitle="Active and past users"
                large={false}
              />

              <StatCard
                title="Contract Balance"
                value={`${parseFloat(contractStats.contractBalance).toFixed(
                  4
                )} ETH`}
                icon={FiPieChart}
                gradient="from-purple-500 to-pink-500"
                subtitle="Current contract funds"
                large={false}
              />
            </div>
          </div>

          {/* Enhanced Recent Activity */}
          {conversations.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiActivity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your latest AI conversations and interactions
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
                <div className="relative z-10 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Latest Conversations
                  </h3>
                  <div className="space-y-4">
                    {conversations.slice(0, 5).map((conversation, index) => (
                      <div
                        key={conversation.id}
                        className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-2xl backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-600/50 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white truncate">
                              {conversation.title || "Untitled Conversation"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              💬 {conversation.messages.length} messages
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDateWithTime(conversation.updatedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
      `}</style>
    </div>
  );
};

export default StatsPage;
