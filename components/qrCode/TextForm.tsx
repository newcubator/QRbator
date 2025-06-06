import { MAX_LENGTH_INPUT_LENGTH, PLACEHOLDER_TEXT_COLOR } from "@/constants/config";
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
        <>
          <TextInput
            className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
            value={content}
            onChangeText={onContentChange}
            placeholder={t("enterQrContentPlaceholder")}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            multiline
            numberOfLines={4}
            maxLength={MAX_LENGTH_INPUT_LENGTH}
            textAlignVertical="top"
            autoCapitalize="none"
          />
          <Text className="mt-1 text-xs text-corp-mid-grey text-right">
            {MAX_LENGTH_INPUT_LENGTH - content.length} / {MAX_LENGTH_INPUT_LENGTH}{" "}
          </Text>
        </>
      ) : (
        <View className="rounded-lg border border-corp-mid-grey bg-white p-4">
          <Text className="text-corp-grey">{content}</Text>
        </View>
      )}
    </View>
  );
};
