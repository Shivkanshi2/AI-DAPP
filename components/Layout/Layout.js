import { useState } from "react";
import { useAccount } from "wagmi";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ConnectWallet from "../ConnectWallet/ConnectWallet";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectWallet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 transition-all duration-300">
      {/* Mobile sidebar backdrop with enhanced blur */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile sidebar container with slide animation */}
        <div
          className={`fixed inset-y-0 left-0 flex w-full max-w-xs flex-col transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative flex flex-col h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Desktop sidebar with enhanced styling */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        <div className="relative flex flex-col h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/30 dark:border-gray-700/30 shadow-lg">
          {/* Sidebar gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-indigo-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-indigo-400/10 pointer-events-none" />

          {/* Blockchain-themed border accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-r-full" />

          <div className="relative z-10 h-full">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main content area with enhanced layout */}
      <div className="lg:pl-64 relative">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Header with enhanced styling */}
        <div className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-sm">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Main content container */}
        <main className="relative z-10 flex-1 min-h-[calc(100vh-4rem)]">
          <div className="h-full bg-gradient-to-b from-transparent via-white/30 to-transparent dark:via-gray-900/30">
            {/* Content wrapper with subtle inner shadow */}
            <div className="h-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-950/30 dark:via-transparent dark:to-indigo-950/30 pointer-events-none" />
              <div className="relative z-10 h-full">{children}</div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating blockchain network indicator */}
      <div className="fixed bottom-6 right-6 z-30 hidden lg:block">
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300" />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Connected
          </span>
        </div>
      </div>

      {/* Enhanced mobile responsive indicators */}
      <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-1 px-2 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-md">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-150" />
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-300" />
        </div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
