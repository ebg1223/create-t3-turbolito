import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@my/api'
/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
import Constants from 'expo-constants'
/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { transformer } from '@my/api/transformer'
import { useAuth } from '@clerk/clerk-expo'
import { Text } from 'react-native'

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>()

const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   */
  const localhost = Constants.manifest?.debuggerHost?.split(':')[0]
  if (!localhost) throw new Error('failed to get localhost, configure it manually')
  return `http://${localhost}:3000`
}

export const TRPCProvider: React.FC<{
  children: React.ReactNode
  authToken: string | null
}> = ({ children, authToken }) => {
  //authToken prop is not used here
  //Instead, useAuth is getting token directly from clerk.
  //Using authToken from saved state in encapsulating TRPCAuthContext causes
  //stale token to be used, as it is saved from the context.

  const { getToken } = useAuth()
  const [queryClient] = React.useState(() => new QueryClient())
  const [trpcClient] = React.useState(() =>
      trpc.createClient({
        transformer,
        links: [
          httpBatchLink({
            async headers() {
              const token = await getToken()
              return {
                Authorization: token || '',
              }
            },
            url: `${getBaseUrl()}/api/trpc`,
          }),
        ],
      })
  )

  return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
  )
}

export const TRPCAuthContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /*
  // get JWT from clerk
  console.log('Getting token')
  const { getToken } = useAuth()
  // minimal example on how to set the token in the provider
  const [authToken, setAuthToken] = React.useState<string | null>(null)
  useEffect(() => {
    getToken()
      .then((token) => {
        setAuthToken(token)
      })
      .catch((err) => {
        console.log('Error getting token', err)
      })
  }, [])

  if (!authToken) return <Text>Loading</Text>
*/

  //this is not used, simply wraps the provider
  //clerk.dev has direct access to the token, so it is not needed here
  //using the clerk.dev getToken() is much easier and more reliable
  //getToken automatically checks for token expiration and refreshes it
  return <TRPCProvider authToken={null}>{children}</TRPCProvider>
}
