import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getOwnerEmails,
  getPublicEnvironment,
  getSiteUrl,
  hasSupabaseEnvironment,
  parseOwnerEmails,
} from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("environment validation", () => {
  it("normalizes, lowercases, and deduplicates the server-only owner list", () => {
    vi.stubEnv(
      "OWNER_EMAILS",
      " primary-owner@example.test, SECOND-OWNER@EXAMPLE.TEST, third-owner@example.test, primary-owner@example.test ",
    );
    expect(getOwnerEmails()).toEqual([
      "primary-owner@example.test",
      "second-owner@example.test",
      "third-owner@example.test",
    ]);
  });

  it.each([
    undefined,
    "",
    "owner@example.test,",
    "owner@example.test,,other@example.test",
    "not-an-email",
  ])("fails closed for missing or malformed allowlists: %j", (input) => {
    expect(() => parseOwnerEmails(input)).toThrow(/OWNER_EMAILS/);
  });

  it("accepts an origin and rejects paths for the public site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://recipes.example/");
    expect(getSiteUrl()).toBe("https://recipes.example");

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://recipes.example/private");
    expect(() => getSiteUrl()).toThrow(/without a path/);
  });

  it("fails closed when either public Supabase OAuth variable is missing", () => {
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://lfrwpxkbsnqabmhymjaa.supabase.co",
    );
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", undefined);

    expect(hasSupabaseEnvironment()).toBe(false);
    expect(() => getPublicEnvironment()).toThrow(/Supabase configuration/);
  });

  it("prefers a publishable key and supports legacy anon configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy-public-anon-test-key");
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "sb_publishable_example_public_test",
    );
    expect(hasSupabaseEnvironment()).toBe(true);
    expect(getPublicEnvironment().NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
      "sb_publishable_example_public_test",
    );
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    expect(hasSupabaseEnvironment()).toBe(true);
    expect(getPublicEnvironment().NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
      "sb_publishable_example_public_test",
    );
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy-public-anon-test-key");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", undefined);
    expect(getPublicEnvironment().NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
      "legacy-public-anon-test-key",
    );
  });

  it.each([
    "sb_secret_example_test_private",
    "eyJhbGciOiJIUzI1NiJ9." +
      btoa(JSON.stringify({ role: "service_role" })) +
      ".test",
  ])("rejects privileged public configuration without revealing it", (key) => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", key);
    expect(hasSupabaseEnvironment()).toBe(false);
    expect(() => getPublicEnvironment()).toThrow(
      /public Supabase configuration/,
    );
    try {
      getPublicEnvironment();
    } catch (error) {
      expect(String(error)).not.toContain(key);
    }
  });
});
