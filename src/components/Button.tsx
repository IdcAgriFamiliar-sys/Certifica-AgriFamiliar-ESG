import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "dark" | "outline" | "ghost" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = "",
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 focus:ring-green-500",
        dark: "bg-stone-900 hover:bg-stone-800 text-white shadow-lg shadow-stone-300 focus:ring-stone-900",
        outline: "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 focus:ring-stone-200",
        ghost: "bg-transparent hover:bg-stone-100 text-stone-600 focus:ring-stone-200",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
        success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:ring-emerald-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm gap-1.5",
        md: "px-5 py-2.5 text-sm gap-2",
        lg: "px-8 py-4 text-base gap-3",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && leftIcon}
            <span>{children}</span>
            {!isLoading && rightIcon}
        </button>
    );
};

export default Button;
