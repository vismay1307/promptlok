"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { createAuthenticatedApi } from "@/lib/api";

export default function Home() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    try {
      setLoading(true);
      setResponse("");

      const api = createAuthenticatedApi(getToken);

      const response = await api.get("/auth/me");

      setResponse(
        JSON.stringify(response.data, null, 2)
      );
    } catch (error) {
      console.error("Backend request failed:", error);

      setResponse("Backend request failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold">
              PromptLok
            </h1>

            <p className="text-xs text-gray-500">
              AI Prompt Management
            </p>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome back
                </span>

                <UserButton />
              </>
            ) : (
              <a
                href="/sign-in"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        {!isSignedIn ? (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">
              Manage your AI prompts
              <br />
              in one place.
            </h2>

            <p className="mt-4 text-gray-600">
              Create, organize and manage your prompts
              across different AI models.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <a
                href="/sign-in"
                className="rounded-md bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
              >
                Sign In
              </a>

              <a
                href="/sign-up"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium hover:bg-gray-100"
              >
                Create Account
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  Dashboard
                </h2>

                <p className="mt-1 text-gray-600">
                  Welcome to PromptLok.
                </p>
              </div>

              <button
                onClick={testBackend}
                disabled={loading}
                className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Testing..."
                  : "Test Backend"}
              </button>
            </div>

            {/* Dashboard cards */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Prompts
                </p>

                <p className="mt-2 text-3xl font-bold">
                  0
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Your saved prompts
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Collections
                </p>

                <p className="mt-2 text-3xl font-bold">
                  0
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Organized prompt groups
                </p>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">
                  Account
                </p>

                <p className="mt-2 text-lg font-semibold">
                  Authenticated
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Clerk authentication active
                </p>
              </div>
            </div>

            {/* Backend response */}
            {response && (
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Backend Response
                  </h3>

                  <button
                    onClick={() => setResponse("")}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Clear
                  </button>
                </div>

                <pre className="overflow-x-auto rounded-xl border bg-gray-900 p-5 text-sm text-white">
                  {response}
                </pre>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}