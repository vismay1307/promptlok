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

      const response = await api.get("/auth-test/test");

      setResponse(JSON.stringify(response.data, null, 2));
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

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Please sign in first.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        PromptLok
      </h1>

      <p>You are authenticated.</p>

      <UserButton />

      <button
        onClick={testBackend}
        disabled={loading}
        className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {loading
          ? "Testing..."
          : "Test Backend Authentication"}
      </button>

      {response && (
        <pre className="rounded-md border p-4 text-left">
          {response}
        </pre>
      )}
    </main>
  );
}