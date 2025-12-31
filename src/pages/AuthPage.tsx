// src/pages/AuthPage.tsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Login to Continue
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]} // disable social login if you want email-only
          theme="default"
        />
        <p className="mt-4 text-center text-sm text-gray-500">
          Powered by Supabase Auth
        </p>
      </div>
    </div>
  );
}
