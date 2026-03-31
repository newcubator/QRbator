import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { Stack, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { QRCodeEntry } from "~/core/qrCode";
import {
  deleteAllQRCodes,
  getAllQRCodes,
  importQRCodes,
} from "~/core/qrCodeStorage";
import { parseQRCodesFromCsv, serializeQRCodesToCsv } from "~/core/qrCodeUtils";

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
}: {
  icon: keyof (typeof Ionicons)["glyphMap"];
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-4"
      style={({ pressed }) => (pressed ? { opacity: 0.78 } : null)}
    >
      <View
        className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${
          destructive ? "bg-corp-red" : "bg-corp-light-grey"
        }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? "#FFFFFF" : "#50505E"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`font-semibold ${
            destructive ? "text-corp-dark-red" : "text-corp-grey"
          }`}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-sm text-corp-grey">{subtitle}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#979797" />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleExportAll = async (format: "json" | "csv") => {
    try {
      const codes = await getAllQRCodes();

      if (codes.length === 0) {
        Alert.alert(t("error"), t("noQRCodesToExport"));
        return;
      }

      const fileName = `qr_codes_export_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      const content =
        format === "json"
          ? JSON.stringify(codes, null, 2)
          : serializeQRCodesToCsv(codes);

      const file = new File(Paths.cache, fileName);
      file.create({ overwrite: true });
      file.write(content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        Alert.alert(t("error"), t("sharingNotAvailable"));
      }
    } catch (error) {
      console.error("Error exporting QR codes:", error);
      Alert.alert(t("error"), t("exportFailed"));
    }
  };

  const handleImportFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "text/csv"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;
      const fileContent = await new File(fileUri).text();

      let qrCodes: QRCodeEntry[] = [];

      if (fileName.endsWith(".json")) {
        try {
          qrCodes = JSON.parse(fileContent);
        } catch {
          Alert.alert(t("error"), t("importFailed"));
          return;
        }
      } else if (fileName.endsWith(".csv")) {
        try {
          qrCodes = parseQRCodesFromCsv(fileContent);
        } catch {
          Alert.alert(t("error"), t("importFailed"));
          return;
        }
      } else {
        Alert.alert(t("error"), t("unsupportedFileFormat"));
        return;
      }

      if (qrCodes.length === 0) {
        Alert.alert(t("error"), t("noQRCodesToImport"));
        return;
      }

      Alert.alert(
        t("importQRCodes"),
        t("importConfirmMessage", { count: qrCodes.length }),
        [
          {
            text: t("cancel"),
            style: "cancel",
          },
          {
            text: t("import"),
            onPress: async () => {
              try {
                await importQRCodes(qrCodes);
                Alert.alert(
                  t("success"),
                  t("importSuccessful", { count: qrCodes.length }),
                );
              } catch (error) {
                console.error("Error importing QR codes:", error);
                Alert.alert(t("error"), t("importFailed"));
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert(t("error"), t("filePicker"));
    }
  };

  const handleDeleteAll = () => {
    Alert.alert(t("deleteAllQRCodes"), t("deleteAllConfirmMessage"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("deleteAll"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAllQRCodes();
            Alert.alert(t("success"), t("deleteAllSuccess"));
          } catch (error) {
            console.error("Error deleting all QR codes:", error);
            Alert.alert(t("error"), t("deleteAllFailed"));
          }
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-corp-white"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        <View className="mb-8">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wide text-corp-grey">
            {t("exportData")}
          </Text>
          <View className="overflow-hidden rounded-3xl border border-corp-mid-grey bg-corp-white">
            <SettingsRow
              icon="document-text-outline"
              title={t("exportAllJson")}
              subtitle="JavaScript Object Notation"
              onPress={() => handleExportAll("json")}
            />
            <View className="border-b border-corp-light-grey" />
            <SettingsRow
              icon="grid-outline"
              title={t("exportAllCsv")}
              subtitle="Comma-separated values"
              onPress={() => handleExportAll("csv")}
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wide text-corp-grey">
            {t("appSettings")}
          </Text>
          <View className="overflow-hidden rounded-3xl border border-corp-mid-grey bg-corp-white">
            <SettingsRow
              icon="cloud-upload-outline"
              title={t("importFromFile")}
              subtitle={t("supportedFormats")}
              onPress={handleImportFile}
            />
            <View className="border-b border-corp-light-grey" />
            <SettingsRow
              icon="information-circle-outline"
              title={t("settings.viewOnboarding")}
              subtitle={t("about")}
              onPress={() => router.push("/onboarding")}
            />
          </View>
        </View>

        <View>
          <Text className="mb-3 text-sm font-medium uppercase tracking-wide text-corp-grey">
            {t("dangerZone")}
          </Text>
          <View className="overflow-hidden rounded-3xl border border-corp-red bg-corp-white">
            <SettingsRow
              icon="trash-outline"
              title={t("deleteAllQRCodes")}
              subtitle={t("deleteAllConfirmMessage")}
              onPress={handleDeleteAll}
              destructive
            />
          </View>
        </View>
      </ScrollView>
      <Stack.Screen
        options={{
          title: t("tab-settings"),
          headerLargeTitle: true,
          headerShadowVisible: false,
        }}
      />
    </>
  );
}
