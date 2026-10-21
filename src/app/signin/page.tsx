"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchLogin } from "../hooks/useFetchLogin";
import AuthLayout from "../sharedComponents/AuthLayout";
import FormField from "../sharedComponents/FormField";
import SubmitButton from "../sharedComponents/SubmitButton";

export default function SignInPage() {
  const router = useRouter();
  const { login, isLoading, error } = useFetchLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setRegistered(new URLSearchParams(window.location.search).has("registered"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await login(email, password);
    if (result) {
      router.push(result.user.user_type === "Admin" ? "/admin" : "/");
    }
  }

  return (
    <AuthLayout title="Log in">
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <FormField label="Email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div>
          <FormField label="Password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="mt-2 flex justify-end">
            <Link href="/forgot-password" className="text-sm font-semibold text-brand hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        {registered && !error && (
          <p className="text-sm font-medium text-emerald-700">Account created. Log in to continue.</p>
        )}
        {error && <p role="alert" className="text-sm font-medium text-red-600">{error.message}</p>}
        <SubmitButton busy={isLoading} busyLabel="Logging in..." label="Log in" />
        <p className="text-sm text-brand/70">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand hover:underline">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
