import { createContext, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import toast from "react-hot-toast";
import { mockQueryUsage } from "../utils/contractHelpers";

const ContractContext = createContext();

// Import your ABI here
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "tier",
        type: "uint8",
      },
    ],
    name: "PaymentProcessed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "remainingQueries",
        type: "uint256",
      },
    ],
    name: "QueryUsed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "SubscriptionCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "tier",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    name: "SubscriptionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "tier",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newEndTime",
        type: "uint256",
      },
    ],
    name: "SubscriptionRenewed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "tier",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "monthlyPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "yearlyPrice",
        type: "uint256",
      },
    ],
    name: "TierUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "FEE_DENOMINATOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MONTH_DURATION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "YEAR_DURATION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "canMakeQuery",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelSubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractStats",
    outputs: [
      {
        internalType: "uint256",
        name: "_totalRevenue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalSubscribers",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_contractBalance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getRemainingQueries",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getSubscriptionDetails",
    outputs: [
      {
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "tier",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "autoRenew",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "remainingQueries",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "_tier",
        type: "uint8",
      },
    ],
    name: "getTierPricing",
    outputs: [
      {
        internalType: "uint256",
        name: "monthlyPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "yearlyPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxQueries",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "unlimited",
        type: "bool",
      },
      {
        internalType: "string",
        name: "features",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "hasActiveSubscription",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "processAutoRenewal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "queryUsage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "_tier",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "_yearly",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_autoRenew",
        type: "bool",
      },
    ],
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "subscriptions",
    outputs: [
      {
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "tier",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastPayment",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "autoRenew",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "",
        type: "uint8",
      },
    ],
    name: "tierPricing",
    outputs: [
      {
        internalType: "uint256",
        name: "monthlyPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "yearlyPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxQueries",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "unlimited",
        type: "bool",
      },
      {
        internalType: "string",
        name: "features",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRevenue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSubscribers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newFee",
        type: "uint256",
      },
    ],
    name: "updateProtocolFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ChatGPTSubscription.SubscriptionTier",
        name: "_tier",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_monthlyPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_yearlyPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxQueries",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_unlimited",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_features",
        type: "string",
      },
    ],
    name: "updateTierPricing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newTreasury",
        type: "address",
      },
    ],
    name: "updateTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "useQuery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
]; // Add your contract ABI here

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within ContractProvider");
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [subscribeArgs, setSubscribeArgs] = useState([]);
  const [subscribeValue, setSubscribeValue] = useState("0");
  const [contractStats, setContractStats] = useState({
    totalRevenue: "0",
    totalSubscribers: 0,
    contractBalance: "0",
  });

  // Read contract data
  const { data: subscriptionDetails, refetch: refetchSubscription } =
    useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getSubscriptionDetails",
      args: [address],
      enabled: !!address && !!CONTRACT_ADDRESS,
    });

  const { data: basicTierPricing } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTierPricing",
    args: [1], // SubscriptionTier.BASIC
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: premiumTierPricing } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTierPricing",
    args: [2], // SubscriptionTier.PREMIUM
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: enterpriseTierPricing } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTierPricing",
    args: [3], // SubscriptionTier.ENTERPRISE
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: contractStatsData, refetch: refetchStats } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getContractStats",
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: remainingQueries } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getRemainingQueries",
    args: [address],
    enabled: !!address && !!CONTRACT_ADDRESS,
  });

  const { data: hasActiveSubscription } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasActiveSubscription",
    args: [address],
    enabled: !!address && !!CONTRACT_ADDRESS,
  });

  const { data: canMakeQuery } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "canMakeQuery",
    args: [address],
    enabled: !!address && !!CONTRACT_ADDRESS,
  });

  // Contract write functions
  const { config: subscribeConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "subscribe",
    args: subscribeArgs,
    value: subscribeValue ? parseEther(subscribeValue) : undefined,
    enabled:
      !!CONTRACT_ADDRESS && subscribeArgs.length > 0 && subscribeValue !== "0",
  });

  const {
    write: writeSubscribe,
    data: subscribeData,
    isLoading: subscribeLoading,
    error: subscribeError,
  } = useContractWrite(subscribeConfig);

  const { config: cancelConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "cancelSubscription",
    enabled: !!CONTRACT_ADDRESS && !!hasActiveSubscription,
  });

  const {
    write: writeCancelSubscription,
    isLoading: cancelLoading,
    error: cancelError,
  } = useContractWrite(cancelConfig);

  // Update contract stats when data changes
  useEffect(() => {
    if (contractStatsData) {
      setContractStats({
        totalRevenue: formatEther(contractStatsData[0] || 0),
        totalSubscribers: Number(contractStatsData[1] || 0),
        contractBalance: formatEther(contractStatsData[2] || 0),
      });
    }
  }, [contractStatsData]);

  // Subscribe function
  const subscribe = async (tier, isYearly, autoRenew, paymentAmount) => {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!CONTRACT_ADDRESS) {
      toast.error("Contract address not configured");
      return;
    }

    setLoading(true);
    try {
      // Set the arguments and value for the contract call
      setSubscribeArgs([tier, isYearly, autoRenew]);
      setSubscribeValue(paymentAmount.toString());

      // Wait a bit for the prepare to complete, then execute
      setTimeout(() => {
        if (writeSubscribe) {
          writeSubscribe();
          toast.success("Subscription transaction initiated!");
        } else {
          toast.success("Preparing Transactions, Completed, Click once Again");
        }
      }, 1000);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to subscribe");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription function
  const cancelSubscription = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!hasActiveSubscription) {
      toast.error("You don't have an active subscription to cancel");
      return;
    }

    setLoading(true);
    try {
      if (writeCancelSubscription) {
        writeCancelSubscription();
        toast.success("Cancellation transaction initiated!");
      } else {
        toast.error("Unable to prepare cancellation. Please try again.");
      }
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error(error.message || "Failed to cancel subscription");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Use query function (this would typically be called by the backend)
  const useQuery = async (userAddress) => {
    try {
      // For development, use mock query tracking
      if (process.env.NODE_ENV === "development") {
        const result = await mockQueryUsage(userAddress);
        console.log("Mock query usage result:", result);
        return result;
      }

      // For production, you would implement actual contract interaction here
      // This would require a proper contract write setup
      console.log("Query usage tracking for:", userAddress);

      return Promise.resolve({
        success: true,
        message: "Query usage tracked",
      });
    } catch (error) {
      console.error("Error tracking query usage:", error);
      // Don't throw error to prevent chat from failing
      return Promise.resolve({
        success: false,
        error: error.message,
      });
    }
  };

  // Get subscription tier name
  const getTierName = (tier) => {
    switch (tier) {
      case 0:
        return "None";
      case 1:
        return "Basic";
      case 2:
        return "Premium";
      case 3:
        return "Enterprise";
      default:
        return "Unknown";
    }
  };

  // Get pricing for tier
  const getTierPricing = (tier) => {
    switch (tier) {
      case 1:
        return basicTierPricing;
      case 2:
        return premiumTierPricing;
      case 3:
        return enterpriseTierPricing;
      default:
        return null;
    }
  };

  const value = {
    // Contract data
    subscriptionDetails,
    basicTierPricing,
    premiumTierPricing,
    enterpriseTierPricing,
    contractStats,
    remainingQueries: remainingQueries ? Number(remainingQueries) : 0,
    hasActiveSubscription: hasActiveSubscription || false,
    canMakeQuery: canMakeQuery || false,

    // Contract functions
    subscribe,
    cancelSubscription,
    useQuery,

    // Helper functions
    getTierName,
    getTierPricing,

    // Refetch functions
    refetchSubscription,
    refetchStats,

    // State
    loading: loading || subscribeLoading || cancelLoading,
    isConnected,
    address,

    // Error states
    subscribeError,
    cancelError,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
