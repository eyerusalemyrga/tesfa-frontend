"use client";
import { useId, useState, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const inputClass =
  "h-12 w-full rounded-lg border border-accent px-4 text-brand placeholder:italic placeholder:text-brand/50 focus:outline-none focus:ring-4 focus:ring-accent/20";

export default function FormField({ label, type = "text", className = "", ...props }: Props) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={className}>
      <label htmlFor={id} className="block font-semibold text-brand">
        {label}
      </label>
      <div className="relative mt-2">
        <input id={id} type={isPassword && visible ? "text" : type} className={`${inputClass} ${isPassword ? "pr-16" : ""}`} {...props} />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute inset-y-0 right-3 text-sm text-brand/70 hover:text-brand"
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}
