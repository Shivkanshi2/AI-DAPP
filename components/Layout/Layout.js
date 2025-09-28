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

  // INTERNAL STYLE OBJECTS
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #f8fafc, #e0f2fe, #e0e7ff)",
      transition: "all 0.3s ease",
      position: "relative",
    },
    mobileBackdrop: (open) => ({
      position: "fixed",
      inset: 0,
      zIndex: 50,
      opacity: open ? 1 : 0,
      visibility: open ? "visible" : "hidden",
      transition: "all 0.3s ease",
    }),
    mobileSidebarOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.2)",
      backdropFilter: "blur(8px)",
    },
    mobileSidebarContainer: (open) => ({
      position: "fixed",
      insetY: 0,
      left: 0,
      display: "flex",
      width: "100%",
      maxWidth: 320,
      flexDirection: "column",
      transform: open ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s ease-in-out",
    }),
    sidebarCard: {
      position: "relative",
      flexDirection: "column",
      height: "100%",
      backgroundColor: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(16px)",
      borderRight: "1px solid rgba(209,213,219,0.5)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      display: "flex",
    },
    desktopSidebarContainer: {
      position: "fixed",
      insetY: 0,
      display: "flex",
      width: 256,
      flexDirection: "column",
      zIndex: 40,
    },
    sidebarGradientOverlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to bottom, rgba(59,130,246,0.05), transparent, rgba(129,140,248,0.05))",
      pointerEvents: "none",
    },
    sidebarAccentBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 4,
      height: "100%",
      borderRadius: 9999,
      background: "linear-gradient(to bottom, #3b82f6, #6366f1, #8b5cf6)",
    },
    mainContent: {
      marginLeft: 256,
      position: "relative",
      flex: 1,
      minHeight: "calc(100vh - 64px)",
    },
    animatedCircle: (top, left, size, fromColor, toColor, delay) => ({
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${fromColor} 0%, ${toColor} 100%)`,
      filter: "blur(80px)",
      animation: `pulse 6s ${delay || 0}s infinite alternate`,
      top,
      left,
    }),
    headerWrapper: {
      position: "relative",
      zIndex: 10,
      backgroundColor: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(203,213,225,0.3)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    contentWrapper: {
      position: "relative",
      height: "100%",
    },
    gridOverlay: {
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      opacity: 0.015,
      backgroundImage: `
        linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)
      `,
      backgroundSize: "50px 50px",
    },
    floatingIndicator: {
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 30,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      backgroundColor: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(12px)",
      borderRadius: 9999,
      border: "1px solid rgba(203,213,225,0.5)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    },
    floatingDots: (color, delay) => ({
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: color,
      animation: `pulse 1.5s ${delay || 0}s infinite`,
    }),
    mobileIndicatorWrapper: {
      position: "fixed",
      bottom: 16,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 30,
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 8px",
      backgroundColor: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(12px)",
      borderRadius: 9999,
      border: "1px solid rgba(203,213,225,0.5)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    pulseKeyframes: `
      @keyframes pulse {
        0% { transform: translateY(0) scale(1); opacity: 0.4; }
        50% { transform: translateY(-10px) scale(1.1); opacity: 0.6; }
        100% { transform: translateY(0) scale(1); opacity: 0.4; }
      }
    `,
  };

  return (
    <div style={styles.container}>
      <style>{styles.pulseKeyframes}</style>

      {/* Mobile Sidebar */}
      <div style={styles.mobileBackdrop(sidebarOpen)}>
        <div
          style={styles.mobileSidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
        <div style={styles.mobileSidebarContainer(sidebarOpen)}>
          <div style={styles.sidebarCard}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div style={styles.desktopSidebarContainer}>
        <div style={{ ...styles.sidebarCard, position: "relative" }}>
          <div style={styles.sidebarGradientOverlay} />
          <div style={styles.sidebarAccentBorder} />
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Animated background */}
        <div style={styles.animatedCircle("-160px", "60%", "320px", "rgba(59,130,246,0.2)", "rgba(79,70,229,0.2)", 0)} />
        <div style={styles.animatedCircle("calc(100% - 320px)", "10%", "320px", "rgba(139,92,246,0.2)", "rgba(236,72,153,0.2)", 1)} />

        {/* Header */}
        <div style={styles.headerWrapper}>
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Content */}
        <main style={{ flex: 1, position: "relative", minHeight: "calc(100vh - 64px)" }}>
          <div style={styles.contentWrapper}>{children}</div>
        </main>
      </div>

      {/* Floating desktop indicator */}
      <div style={styles.floatingIndicator}>
        <div style={styles.floatingDots("green")}></div>
        <div style={styles.floatingDots("blue", 0.15)}></div>
        <div style={styles.floatingDots("purple", 0.3)}></div>
        <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Connected</span>
      </div>

      {/* Floating mobile indicator */}
      <div style={styles.mobileIndicatorWrapper}>
        <div style={styles.floatingDots("green", 0)}></div>
        <div style={styles.floatingDots("blue", 0.15)}></div>
        <div style={styles.floatingDots("purple", 0.3)}></div>
      </div>

      {/* Grid overlay */}
      <div style={styles.gridOverlay}></div>
    </div>
  );
};

export default Layout;
