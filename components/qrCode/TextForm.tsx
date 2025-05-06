import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

interface TextFormProps {
  content: string;
  onContentChange: (content: string) => void;
  isReadOnly?: boolean;
}

export const TextForm = ({
  content,
  onContentChange,
  isReadOnly = false,
}: TextFormProps) => {
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("qrContent")}
      </Text>
      {!isReadOnly ? (
        <TextInput
          className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
          value={content}
          onChangeText={onContentChange}
          placeholder={t("enterQrContentPlaceholder")}
          placeholderTextColor="#767683"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          autoCapitalize="none"
        />
      ) : (
        <View className="rounded-lg border border-corp-mid-grey bg-white p-4">
          <Text className="text-corp-grey">{content}</Text>
        </View>
      )}
    </View>
  );
};
