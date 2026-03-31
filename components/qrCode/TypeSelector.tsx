import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

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

  const renderTypeButton = (
    type: QRCodeType,
    iconName: typeof Ionicons.defaultProps.name,
    label: string,
  ) => {
    const isSelected = selectedType === type;
    const bgColor = isSelected
      ? "bg-corp-teal border-corp-teal"
      : "bg-white border-corp-mid-grey";
    const textColor = isSelected ? "text-white" : "text-corp-grey";

    return (
      <Pressable
        onPress={() => onTypeSelect(type)}
        className={`w-[31%] items-center justify-center rounded-2xl border px-2 py-3 ${bgColor}`}
        style={({ pressed }) => (pressed ? { opacity: 0.82 } : null)}
      >
        <Ionicons
          name={iconName}
          size={20}
          color={isSelected ? "white" : "#50505E"}
        />
        <Text
          className={`mt-1 font-medium ${textColor} text-xs`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="mb-6">
      <Text className="mb-3 text-base font-medium text-corp-grey">
        {t("qrCodeType")}
      </Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {renderTypeButton("url", "link-outline", "URL")}
        {renderTypeButton("vcard", "person-outline", "VCARD")}
        {renderTypeButton("text", "text-outline", "TEXT")}
        {renderTypeButton("email", "mail-outline", "E-MAIL")}
        {renderTypeButton("wifi", "wifi-outline", "WIFI")}
      </View>
    </View>
  );
};
