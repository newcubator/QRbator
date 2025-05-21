import { EMAIL_FIELD_MAX_LENGTH, MAX_LENGTH_INPUT_LENGTH, SUBJECT_FIELD_MAX_LENGTH } from "@/constants/config";
import { PLACEHOLDER_TEXT_COLOR } from "@/constants/colors";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

interface EmailFormProps {
  emailAddress: string;
  emailSubject: string;
  emailMessage: string;
  onEmailAddressChange: (email: string) => void;
  onEmailSubjectChange: (subject: string) => void;
  onEmailMessageChange: (message: string) => void;
}

export const EmailForm = ({
  emailAddress,
  emailSubject,
  emailMessage,
  onEmailAddressChange,
  onEmailSubjectChange,
  onEmailMessageChange,
}: EmailFormProps) => {
  const { t } = useTranslation();
  return (
    <View>
      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("email")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={emailAddress}
        onChangeText={onEmailAddressChange}
        placeholder={t("yourEmail")}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={EMAIL_FIELD_MAX_LENGTH}
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("subject")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={emailSubject}
        onChangeText={onEmailSubjectChange}
        placeholder={t("enterEmailSubject")}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        maxLength={SUBJECT_FIELD_MAX_LENGTH}
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("message")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={emailMessage}
        onChangeText={onEmailMessageChange}
        placeholder={t("enterYourMessage")}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        maxLength={MAX_LENGTH_INPUT_LENGTH}
      />
      <Text className="mt-1 text-xs text-corp-mid-grey text-right">
        {MAX_LENGTH_INPUT_LENGTH - emailMessage.length} /{" "}
        {MAX_LENGTH_INPUT_LENGTH}{" "}
      </Text>
    </View>
  );
};
