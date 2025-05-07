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
        placeholderTextColor="#767683"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("subject")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={emailSubject}
        onChangeText={onEmailSubjectChange}
        placeholder={t("enterEmailSubject")}
        placeholderTextColor="#767683"
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("message")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={emailMessage}
        onChangeText={onEmailMessageChange}
        placeholder={t("enterYourMessage")}
        placeholderTextColor="#767683"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );
};
