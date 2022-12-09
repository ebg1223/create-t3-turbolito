import { api } from "@acme/api/src/client/index.native";
/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
import Constants from "expo-constants";
/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { transformer } from "@acme/api/transformer";
import { useAuth } from "@clerk/clerk-expo";
import { Text } from "react-native";

/**
 * A set of typesafe hooks for consuming your API.
 */

const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   */
  const localhost = Constants.manifest?.debuggerHost?.split(":")[0];
  if (!localhost)
    throw new Error("failed to get localhost, configure it manually");
  return `http://${localhost}:3000`;
};

export const TRPCProvider: React.FC<{
  children: React.ReactNode;
  authToken: string | null;
}> = ({ children, authToken }) => {
  const [queryClient] = React.useState(() => new QueryClient());
  const [trpcClient] = React.useState(() =>
    api.createClient({
      transformer,
      links: [
        httpBatchLink({
          headers() {
            return {
              Authorization: authToken || "",
            };
          },
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
};

export const TRPCAuthContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // get JWT from clerk
  const { getToken } = useAuth();
  // minimal example on how to set the token in the provider
  const [authToken, setAuthToken] = React.useState<string | null>(null);
  useEffect(() => {
    getToken().then((token) => {
      setAuthToken(token);
    });
  }, []);

  if (!authToken) return <Text>Loading</Text>;

  return <TRPCProvider authToken={authToken}>{children}</TRPCProvider>;
};
