"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "../sharedComponents/AuthLayout";
import FormField from "../sharedComponents/FormField";
import SubmitButton from "../sharedComponents/SubmitButton";
import { requestOtp, resetPassword, verifyOtp } from "../utils/fetchPasswordReset";

type Step = "email" | "otp" | "password";

const titles: Record<Step, string> = { email: "Forgot password", otp: "Check your email", password: "New password" };

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === "email") {
      run(async () => {
        await requestOtp(email);
        setStep("otp");
      });
    } else if (step === "otp") {
      run(async () => {
        await verifyOtp(email, otp);
        setStep("password");
      });
    } else if (password !== confirm) {
      setError("Passwords don't match.");
    } else {
      run(async () => {
        await resetPassword(email, password);
        router.push("/signin");
      });
    }
  }

  return (
    <AuthLayout title={titles[step]}>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {step === "email" && (
          <>
            <p className="text-brand/70">Enter your email and we&apos;ll send you a 4-digit code.</p>
            <FormField label="Email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </>
        )}
        {step === "otp" && (
          <>
            <p className="text-brand/70">We sent a code to <strong>{email}</strong>. It expires in 10 minutes.</p>
            <FormField
              label="Code"
              inputMode="numeric"
              maxLength={4}
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
          </>
        )}
        {step === "password" && (
          <>
            <FormField label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <FormField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </>
        )}
        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
        <SubmitButton
          busy={busy}
          busyLabel="Please wait..."
          label={step === "email" ? "Send code" : step === "otp" ? "Verify code" : "Reset password"}
        />
        <p className="text-sm text-brand/70">
          Remembered it? <Link href="/signin" className="font-semibold text-brand hover:underline">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
