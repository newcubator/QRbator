import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

interface VCardFormProps {
  firstName: string;
  lastName: string;
  mobile: string;
  phone: string;
  fax: string;
  email: string;
  company: string;
  jobTitle: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  website: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onFaxChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onZipChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
}

export const VCardForm = ({
  firstName,
  lastName,
  mobile,
  phone,
  fax,
  email,
  company,
  jobTitle,
  street,
  city,
  zip,
  state,
  country,
  website,
  onFirstNameChange,
  onLastNameChange,
  onMobileChange,
  onPhoneChange,
  onFaxChange,
  onEmailChange,
  onCompanyChange,
  onJobTitleChange,
  onStreetChange,
  onCityChange,
  onZipChange,
  onStateChange,
  onCountryChange,
  onWebsiteChange,
}: VCardFormProps) => {
  const { t } = useTranslation();

  return (
    <View>
      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("yourName")}
      </Text>
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mr-2"
          value={firstName}
          onChangeText={onFirstNameChange}
          placeholder={t("firstName")}
          placeholderTextColor="#767683"
        />
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
          value={lastName}
          onChangeText={onLastNameChange}
          placeholder={t("lastName")}
          placeholderTextColor="#767683"
        />
      </View>

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("contact")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-2"
        value={mobile}
        onChangeText={onMobileChange}
        placeholder={t("mobile")}
        placeholderTextColor="#767683"
        keyboardType="phone-pad"
      />
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mr-2"
          value={phone}
          onChangeText={onPhoneChange}
          placeholder={t("phone")}
          placeholderTextColor="#767683"
          keyboardType="phone-pad"
        />
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
          value={fax}
          onChangeText={onFaxChange}
          placeholder={t("fax")}
          placeholderTextColor="#767683"
          keyboardType="phone-pad"
        />
      </View>

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("email")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={email}
        onChangeText={onEmailChange}
        placeholder="your@email.com"
        placeholderTextColor="#767683"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("company")}
      </Text>
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mr-2"
          value={company}
          onChangeText={onCompanyChange}
          placeholder={t("company")}
          placeholderTextColor="#767683"
        />
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
          value={jobTitle}
          onChangeText={onJobTitleChange}
          placeholder={t("jobTitle")}
          placeholderTextColor="#767683"
        />
      </View>

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("street")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={street}
        onChangeText={onStreetChange}
        placeholder={t("streetAddress")}
        placeholderTextColor="#767683"
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("city")}
      </Text>
      <View className="flex-row mb-4">
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mr-2"
          value={city}
          onChangeText={onCityChange}
          placeholder={t("city")}
          placeholderTextColor="#767683"
        />
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
          value={zip}
          onChangeText={onZipChange}
          placeholder={t("zip")}
          placeholderTextColor="#767683"
        />
      </View>

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("state")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={state}
        onChangeText={onStateChange}
        placeholder={t("state")}
        placeholderTextColor="#767683"
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("country")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={country}
        onChangeText={onCountryChange}
        placeholder={t("country")}
        placeholderTextColor="#767683"
      />

      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("website")}
      </Text>
      <TextInput
        className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey mb-4"
        value={website}
        onChangeText={onWebsiteChange}
        placeholder="www.your-website.com"
        placeholderTextColor="#767683"
        autoCapitalize="none"
      />
    </View>
  );
};
