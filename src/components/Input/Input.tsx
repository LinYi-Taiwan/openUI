import React from "react";

const BASE_CLASSES =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground";

export interface InputProps extends React.ComponentProps<"input"> {}

export function Input({ className, type = "text", ...props }: InputProps) {
  const classes = [BASE_CLASSES, className].filter(Boolean).join(" ");
  return <input type={type} className={classes} {...props} />;
}
