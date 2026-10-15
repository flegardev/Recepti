import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getPublicEnvironment, hasSupabaseEnvironment } from "@/lib/env";
import type { Database } from "@/types/database";

export async function refreshSession(
  request: NextRequest,
  requestHeaders = request.headers,
) {
  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!hasSupabaseEnvironment()) return response;

  const environment = getPublicEnvironment();

  const client = createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  await client.auth.getClaims();
  return response;
}
