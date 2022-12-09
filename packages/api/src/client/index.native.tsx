import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../router";
/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
