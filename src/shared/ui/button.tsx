import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "paper" | "quiet" };

export function Button({ className = "", tone = "primary", ...props }: ButtonProps) {
  const styles = {
    primary: "border-vermilion-deep bg-vermilion text-paper [clip-path:polygon(0_0,calc(100%_-_8px)_0,100%_8px,100%_100%,0_100%)] hover:bg-vermilion-deep hover:shadow-fold",
    paper: "border-vermilion-deep bg-paper text-vermilion-deep hover:bg-vermilion-deep hover:text-paper",
    quiet: "border-transparent bg-transparent text-sumi hover:bg-paper-grey",
  };
  return <button className={`min-h-11 border px-4 py-2.5 font-[620] transition-[background,color,box-shadow,clip-path] focus-visible:outline-3 focus-visible:outline-sumi focus-visible:outline-offset-3 ${styles[tone]} ${className}`} {...props} />;
}
