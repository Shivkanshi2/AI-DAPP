import { useContract } from "../../context/ContractContext";

const ContractDebug = () => {
  const {
    subscriptionDetails,
    basicTierPricing,
    premiumTierPricing,
    enterpriseTierPricing,
    contractStats,
    hasActiveSubscription,
    subscribeError,
    cancelError,
    address,
  } = useContract();

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Contract Debug Info</h3>

      <div className="space-y-2">
        <div>
          <strong>Contract Address:</strong>{" "}
          {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "Not set"}
        </div>

        <div>
          <strong>Connected Address:</strong> {address || "Not connected"}
        </div>

        <div>
          <strong>Has Active Subscription:</strong>{" "}
          {hasActiveSubscription ? "Yes" : "No"}
        </div>

        <div>
          <strong>Subscription Details:</strong>
          <pre className="text-xs">
            {JSON.stringify(subscriptionDetails, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Basic Tier Pricing:</strong>
          <pre className="text-xs">
            {JSON.stringify(basicTierPricing, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Premium Tier Pricing:</strong>
          <pre className="text-xs">
            {JSON.stringify(premiumTierPricing, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Enterprise Tier Pricing:</strong>
          <pre className="text-xs">
            {JSON.stringify(enterpriseTierPricing, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Contract Stats:</strong>
          <pre className="text-xs">
            {JSON.stringify(contractStats, null, 2)}
          </pre>
        </div>

        {subscribeError && (
          <div>
            <strong>Subscribe Error:</strong>
            <pre className="text-red-400 text-xs">{subscribeError.message}</pre>
          </div>
        )}

        {cancelError && (
          <div>
            <strong>Cancel Error:</strong>
            <pre className="text-red-400 text-xs">{cancelError.message}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDebug;
