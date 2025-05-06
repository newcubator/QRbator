import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import { Platform, Switch, Text, TextInput, View } from "react-native";

interface WiFiFormProps {
  ssid: string;
  password: string;
  isHidden: boolean;
  encryption: "WPA" | "WEP" | "nopass";
  onSsidChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onIsHiddenChange: (value: boolean) => void;
  onEncryptionChange: (value: "WPA" | "WEP" | "nopass") => void;
}

export const WiFiForm = ({
  ssid,
  password,
  isHidden,
  encryption,
  onSsidChange,
  onPasswordChange,
  onIsHiddenChange,
  onEncryptionChange,
}: WiFiFormProps) => {
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <View className="mb-5">
        <Text className="mb-2 text-base font-medium text-corp-grey">
          {t("networkName")}
        </Text>
        <View className="flex-row items-center relative">
          <TextInput
            className="w-full rounded-lg border border-corp-mid-grey px-4 py-3.5 text-corp-grey bg-white"
            value={ssid}
            onChangeText={onSsidChange}
            placeholder={t("enterNetworkName")}
            placeholderTextColor="#9999A5"
            autoCapitalize="none"
            style={{ fontSize: 16 }}
          />
          {ssid ? (
            <Ionicons
              name="wifi-outline"
              size={20}
              color="#6B6B76"
              style={{ position: "absolute", right: 14 }}
            />
          ) : null}
        </View>
      </View>

      <View className="mb-5">
        <Text className="mb-2 text-base font-medium text-corp-grey">
          {t("password")}
        </Text>
        <View className="flex-row items-center relative">
          <TextInput
            className="w-full rounded-lg border border-corp-mid-grey px-4 py-3.5 text-corp-grey bg-white"
            value={password}
            onChangeText={onPasswordChange}
            placeholder={t("enterPassword")}
            placeholderTextColor="#9999A5"
            secureTextEntry={encryption !== "nopass"}
            autoCapitalize="none"
            style={{ fontSize: 16 }}
          />
          {password ? (
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6B6B76"
              style={{ position: "absolute", right: 14 }}
            />
          ) : null}
        </View>
      </View>

      <View className="mb-5">
        <Text className="mb-2 text-base font-medium text-corp-grey">
          {t("encryption")}
        </Text>
        {Platform.OS === "ios" ? (
          <View className="border border-corp-mid-grey rounded-lg overflow-hidden bg-white">
            <Picker
              selectedValue={encryption}
              onValueChange={(itemValue) =>
                onEncryptionChange(itemValue as "WPA" | "WEP" | "nopass")
              }
              itemStyle={{ fontSize: 16, height: 110, color: "#000000" }}
            >
              <Picker.Item label={t("none")} value="nopass" />
              <Picker.Item label="WPA/WPA2" value="WPA" />
              <Picker.Item label="WEP" value="WEP" />
            </Picker>
          </View>
        ) : (
          <View className="border border-corp-mid-grey rounded-lg overflow-hidden bg-white">
            <Picker
              selectedValue={encryption}
              onValueChange={(itemValue) =>
                onEncryptionChange(itemValue as "WPA" | "WEP" | "nopass")
              }
              dropdownIconColor="#6B6B76"
              mode="dropdown"
              style={{ color: "#000000" }}
            >
              <Picker.Item label={t("none")} value="nopass" color="#000000" />
              <Picker.Item label="WPA/WPA2" value="WPA" color="#000000" />
              <Picker.Item label="WEP" value="WEP" color="#000000" />
            </Picker>
          </View>
        )}
      </View>

      <View className="mb-4 flex-row items-center justify-between p-3 bg-gray-50 rounded-lg border border-corp-mid-grey">
        <View className="flex-row items-center">
          <Ionicons
            name="eye-off-outline"
            size={20}
            color="#6B6B76"
            style={{ marginRight: 8 }}
          />
          <Text className="text-base font-medium text-corp-grey">
            {t("hidden")}
          </Text>
        </View>
        <Switch
          value={isHidden}
          onValueChange={onIsHiddenChange}
          trackColor={{ false: "#E0E0E6", true: "#3E6A79" }}
          thumbColor={isHidden ? "#3E9EBF" : "#FFFFFF"}
          ios_backgroundColor="#E0E0E6"
        />
      </View>
    </View>
  );
};
