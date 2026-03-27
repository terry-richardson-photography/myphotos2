"use client";

import { useState } from "react";

export default function PasswordGate({
  correctPassword,
  onSuccess,
}: {
  correctPassword: string;
  onSuccess: () => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (input === correctPassword) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="text-center space-y-6">

        <h1 className="text-2xl font-serif tracking-wide">
          Enter Password
        </h1>

        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded"
        />

        <div>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 border border-white/30 rounded hover:bg-white/10"
          >
            Enter
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm">
            Incorrect password
          </p>
        )}

      </div>

    </div>
  );
}