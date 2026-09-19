import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost" | "danger" | "quiet";
    size?: "sm" | "md";
    children: ReactNode;
}

/**
 * Chrome is ember. Buttons are flat-ish with a hairline lit edge — physical
 * switch, not a glowing SaaS CTA.
 */
const variantClasses = {
    primary:
        "bg-ember-500 text-surface-900 font-semibold hover:bg-ember-400 active:bg-ember-600 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] disabled:opacity-40",
    ghost:
        "border border-surface-300 bg-surface-200/70 text-surface-700 hover:bg-surface-300 hover:text-surface-900 disabled:opacity-40",
    quiet:
        "text-surface-500 hover:text-surface-900 hover:bg-surface-200/70 disabled:opacity-40",
    danger:
        "bg-red-600 text-surface-900 hover:bg-red-500 disabled:opacity-40",
};

const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
};

export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            type="button"
            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg transition-all duration-150 ease-out disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
