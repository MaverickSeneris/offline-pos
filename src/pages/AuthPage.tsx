// src/pages/AuthPage.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("❌ " + error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          name,
        },
        { onConflict: "id" }
      );
    }

    alert("📧 Check your email to confirm your account.");
    setLoading(false);
  };


  const handleSignin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ " + error.message);
    }

    setLoading(false);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {isSignup ? "Sign Up" : "Sign In"}
        </h1>

        {isSignup && (
          <input
            className="w-full border p-2 rounded"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={isSignup ? handleSignup : handleSignin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-black py-2 px-4 rounded"
          disabled={loading}
        >
          {loading
            ? isSignup
              ? "Signing up..."
              : "Signing in..."
            : isSignup
            ? "Sign Up"
            : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600"
                onClick={() => setIsSignup(false)}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                className="text-blue-600"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
