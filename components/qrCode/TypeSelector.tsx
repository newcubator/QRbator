import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type QRCodeType = "url" | "vcard" | "text" | "email" | "wifi";

interface TypeSelectorProps {
  selectedType: QRCodeType;
  onTypeSelect: (type: QRCodeType) => void;
}

export const TypeSelector = ({
  selectedType,
  onTypeSelect,
}: TypeSelectorProps) => {
  const { t } = useTranslation();
  const buttonWidth = 65;

  const renderTypeButton = (
    type: QRCodeType,
    iconName: typeof Ionicons.defaultProps.name,
    label: string
  ) => {
    const isSelected = selectedType === type;
    const bgColor = isSelected
      ? type === "wifi"
        ? "bg-corp-teal"
        : "bg-corp-teal"
      : "bg-white border border-corp-mid-grey";
    const textColor = isSelected ? "text-white" : "text-corp-grey";

    return (
      <TouchableOpacity
        onPress={() => onTypeSelect(type)}
        className={`items-center justify-center py-2.5 mx-1 rounded-lg ${bgColor}`}
        style={{
          width: buttonWidth,
          elevation: isSelected ? 2 : 0,
          shadowColor: "#000",
          shadowOffset: isSelected
            ? { width: 0, height: 2 }
            : { width: 0, height: 0 },
          shadowOpacity: isSelected ? 0.1 : 0,
          shadowRadius: isSelected ? 3 : 0,
        }}
      >
        <Ionicons
          name={iconName}
          size={22}
          color={isSelected ? "white" : "#50505E"}
        />
        <Text
          className={`mt-1 font-medium ${textColor} text-xs`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      <Text className="mb-3 text-base font-medium text-corp-grey">
        {t("qrCodeType")}
      </Text>
      <View className="flex-row justify-between mb-4">
        {renderTypeButton("url", "link-outline", "URL")}
        {renderTypeButton("vcard", "person-outline", "VCARD")}
        {renderTypeButton("text", "text-outline", "TEXT")}
        {renderTypeButton("email", "mail-outline", "E-MAIL")}
        {renderTypeButton("wifi", "wifi-outline", "WIFI")}
      </View>
    </View>
  );
};
