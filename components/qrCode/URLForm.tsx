import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

interface URLFormProps {
  url: string;
  onUrlChange: (url: string) => void;
}

export const URLForm = ({ url, onUrlChange }: URLFormProps) => {
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("websiteUrl")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
        value={url}
        onChangeText={onUrlChange}
        placeholder="https://example.com"
        placeholderTextColor="#767683"
        autoCapitalize="none"
        keyboardType="url"
      />
    </View>
  );
};
