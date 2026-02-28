"use client";

import { useState } from "react";

export default function PasswordGate({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit() {
    const res = await fetch("/api/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md px-6 text-center">
        <h1 className="text-3xl font-serif mb-6">Private Session</h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black border border-white/30 px-4 py-3 rounded-lg text-center text-white outline-none"
        />

        {error && (
          <p className="text-red-400 text-sm mt-4">
            Incorrect password
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full border border-white/30 px-6 py-3 rounded-lg text-xs tracking-widest uppercase hover:bg-white hover:text-black transition"
        >
          Enter
        </button>
      </div>
    </div>
  );
}