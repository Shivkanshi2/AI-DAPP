import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
import { config, chains } from "../config/wagmi";
import Layout from "../components/Layout/Layout";
import { ChatProvider } from "../context/ChatContext";
import { ContractProvider } from "../context/ContractContext";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <ContractProvider>
            <ChatProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
            </ChatProvider>
          </ContractProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
