"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFetchSignUp } from "../hooks/useFetchSignUp";
import AuthLayout from "../sharedComponents/AuthLayout";
import FormField from "../sharedComponents/FormField";
import SubmitButton from "../sharedComponents/SubmitButton";
import type { SignUpData } from "../utils/types/user";

const fields: { name: keyof SignUpData; label: string; type: string; required: boolean; half?: boolean }[] = [
  { name: "first_name", label: "First name", type: "text", required: true, half: true },
  { name: "last_name", label: "Last name", type: "text", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone_number", label: "Phone number", type: "tel", required: true },
  { name: "country", label: "Country", type: "text", required: false, half: true },
  { name: "organization", label: "Organization", type: "text", required: false, half: true },
  { name: "password", label: "Password", type: "password", required: true },
];

const empty: SignUpData = { first_name: "", last_name: "", email: "", phone_number: "", password: "", country: "", organization: "" };

// Self sign-up is for health professionals; admins are added from the admin dashboard.
export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading, error } = useFetchSignUp();
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState("");
  const [mismatch, setMismatch] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    const result = await signUp(form);
    if (result) {
      router.push("/signin?registered=1");
    }
  }

  return (
    <AuthLayout title="Create account">
      <p className="mt-2 text-brand/70">For health professionals. Save your questions and explore the data.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
            type={field.type}
            placeholder={field.label}
            value={form[field.name]}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
            required={field.required}
            className={field.half ? "col-span-2 sm:col-span-1" : "col-span-2"}
          />
        ))}
        <FormField
          label="Confirm password"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="col-span-2"
        />
        <div className="col-span-2 space-y-4">
          {mismatch && <p role="alert" className="text-sm font-medium text-red-600">Passwords don&apos;t match.</p>}
          {error && <p role="alert" className="text-sm font-medium text-red-600">{error.message}</p>}
          <SubmitButton busy={isLoading} busyLabel="Creating account..." label="Sign up" />
          <p className="text-sm text-brand/70">
            Have an account? <Link href="/signin" className="font-semibold text-brand hover:underline">Log in</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
