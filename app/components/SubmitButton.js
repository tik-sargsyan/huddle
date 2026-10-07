"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, className, ...rest }) {
  const { pending } = useFormStatus();
  return (
    <button className={`${className} ${pending ? "is-pending" : ""}`} disabled={pending} {...rest}>
      {children}
    </button>
  );
}
