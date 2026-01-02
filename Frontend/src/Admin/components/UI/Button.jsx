import React from "react";
import { useThemeColors } from "../../AdminContext";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  const colors = useThemeColors();

  // ✅ FLEX ADDED HERE
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50";

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.accent,
          color: "white",
          border: "none",
        };
      case "secondary":
        return {
          backgroundColor: colors.bgSecondary,
          color: colors.textPrimary,
          border: `1px solid ${colors.border}`,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: colors.textPrimary,
          border: `1px solid ${colors.border}`,
        };
      case "danger":
        return {
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
        };
      case "success":
        return {
          backgroundColor: "#16a34a",
          color: "white",
          border: "none",
        };
      default:
        return {
          backgroundColor: colors.accent,
          color: "white",
          border: "none",
        };
    }
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const classes = `
    ${baseClasses}
    ${sizes[size]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  return (
    <button
      type="button"
      className={classes}
      style={getVariantStyles()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
