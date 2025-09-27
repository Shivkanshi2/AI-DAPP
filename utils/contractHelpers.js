import { useContractWrite, usePrepareContractWrite } from "wagmi";
import toast from "react-hot-toast";

// Helper hook for using queries (if you need actual contract interaction)
export const useQueryContract = (contractAddress, abi) => {
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "useQuery",
    enabled: false, // Only enable when needed
  });

  const { write, isLoading, error } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      toast.success("Query used successfully!");
      console.log("Query transaction:", data);
    },
    onError: (error) => {
      toast.error("Failed to use query: " + error.message);
      console.error("Query error:", error);
    },
  });

  const executeQuery = async (userAddress) => {
    if (!write) {
      throw new Error("Contract write not prepared");
    }

    try {
      write({
        args: [userAddress],
      });
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  };

  return {
    executeQuery,
    isLoading,
    error,
  };
};

// Simple query tracker for development/testing
export const mockQueryUsage = (userAddress) => {
  console.log(`Mock query usage for address: ${userAddress}`);

  // Simulate query tracking in localStorage for development
  const queryKey = `queries_used_${userAddress}`;
  const currentQueries = parseInt(localStorage.getItem(queryKey) || "0");
  const newQueryCount = currentQueries + 1;

  localStorage.setItem(queryKey, newQueryCount.toString());

  console.log(`Total queries used: ${newQueryCount}`);

  return Promise.resolve({
    success: true,
    queriesUsed: newQueryCount,
  });
};

// Get mock query count
export const getMockQueryCount = (userAddress) => {
  const queryKey = `queries_used_${userAddress}`;
  return parseInt(localStorage.getItem(queryKey) || "0");
};
