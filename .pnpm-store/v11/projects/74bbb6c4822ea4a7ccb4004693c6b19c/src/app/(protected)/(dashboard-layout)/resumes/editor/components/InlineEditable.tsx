"use client";

import { useEffect, useRef } from "react";

interface InlineInputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

interface InlineTextareaProps extends InlineInputProps {
  rows?: number;
}

export function InlineInput({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  disabled = false,
}: InlineInputProps) {
  const classes = [
    "w-full min-w-0 bg-transparent outline-none transition placeholder:text-current/40",
    "border border-transparent rounded-md px-1 -mx-1",
    "focus:border-cyan-400/40 focus:bg-white/40",
    disabled ? "pointer-events-none" : "",
    className || "",
    inputClassName || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={classes}
    />
  );
}

export function InlineTextarea({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  rows = 1,
  disabled = false,
}: InlineTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const classes = [
    "w-full resize-none overflow-hidden bg-transparent outline-none transition placeholder:text-current/40",
    "border border-transparent rounded-md px-1 -mx-1",
    "focus:border-cyan-400/40 focus:bg-white/40",
    disabled ? "pointer-events-none" : "",
    className || "",
    inputClassName || "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={rows}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      onInput={(e) => {
        const target = e.currentTarget;
        target.style.height = "auto";
        target.style.height = `${target.scrollHeight}px`;
      }}
      placeholder={placeholder}
      className={classes}
    />
  );
}
