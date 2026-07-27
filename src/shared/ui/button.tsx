import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "paper" | "quiet" };

export function Button({ className = "", tone = "primary", ...props }: ButtonProps) {
  const styles = {
    primary: "border-vermilion-deep bg-vermilion text-paper hover:bg-vermilion-deep",
    paper: "border-vermilion-deep bg-paper text-vermilion-deep hover:bg-vermilion-deep hover:text-paper",
    quiet: "border-transparent bg-transparent text-sumi hover:bg-paper-grey",
  };
  return <button className={`min-h-11 border px-4 py-2 font-semibold transition focus-visible:outline-3 focus-visible:outline-sumi focus-visible:outline-offset-3 ${styles[tone]} ${className}`} {...props} />;
}
