import { Ionicons } from "@expo/vector-icons"; // Assuming Ionicons are used based on home.tsx
import React from "react";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof (typeof Ionicons)["glyphMap"];
  iconColor?: string;
  iconSize?: number;
  className?: string;
  type?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  iconColor,
  iconSize = 18,
  className,
  type = "primary",
  disabled = false,
}) => {
  const isSecondary = type === "secondary";
  const isDanger = type === "danger";

  let bgColor = "bg-corp-dark-teal";
  let textColor = "text-corp-white";
  let defaultIconColor = "#FFFFFF";
  let border = "";

  if (isSecondary) {
    bgColor = "bg-corp-white";
    textColor = "text-corp-grey";
    defaultIconColor = "#50505E";
    border = "border border-corp-grey";
  } else if (isDanger) {
    bgColor = "bg-corp-dark-red";
    textColor = "text-corp-white";
    defaultIconColor = "#FFFFFF";
  }

  const finalIconColor = iconColor || defaultIconColor;
  const opacity = disabled ? "opacity-50" : "opacity-100";

  return (
    <Pressable
      style={({ pressed }) => [
        style,
        !disabled && pressed ? { opacity: 0.84 } : null,
      ]}
      className={`flex-row items-center justify-center rounded-lg px-4 py-3 ${bgColor} ${border} ${opacity} ${
        className || ""
      }`}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <Ionicons name={icon} size={iconSize} color={finalIconColor} />}
      <Text
        style={[textStyle]}
        className={`${icon ? "ml-2" : ""} font-semibold ${textColor}`}
      >
        {title}
      </Text>
    </Pressable>
  );
};
