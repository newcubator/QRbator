import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { Button } from "~/components/Button";
import { QRCodeEntry } from "~/core/qrCode";
import {
  deleteAllQRCodes,
  getAllQRCodes,
  importQRCodes,
} from "~/core/qrCodeStorage";

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

      let content = "";
      const fileName = `qr_codes_export_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      const dir = FileSystem.cacheDirectory;
      if (!dir) {
        Alert.alert(t("error"), "Could not access cache directory.");
        return;
      }

      if (format === "json") {
        content = JSON.stringify(codes, null, 2);
      } else {
        // CSV format
        const headers = "id,name,content,description,createdAt,tags\n";
        const rows = codes.map((code) => {
          const tags = code.tags.join(";");
          return `"${code.id}","${code.name}","${code.content}","${
            code.description || ""
          }","${code.createdAt}","${tags}"`;
        });
        content = headers + rows.join("\n");
      }

      const fileUri = `${dir}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
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
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      let qrCodes: QRCodeEntry[] = [];

      if (fileName.endsWith(".json")) {
        try {
          qrCodes = JSON.parse(fileContent);
        } catch (e) {
          Alert.alert(t("error"), t("importFailed"));
          return;
        }
      } else if (fileName.endsWith(".csv")) {
        try {
          const results = Papa.parse(fileContent, { header: true });
          qrCodes = results.data.map((row: any) => ({
            id: row.id || Date.now().toString(),
            name: row.name,
            content: row.content,
            type: row.type || "text",
            description: row.description,
            createdAt: row.createdAt || new Date().toISOString(),
            tags: row.tags ? row.tags.split(";") : [],
          }));
        } catch (e) {
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
                  t("importSuccessful", { count: qrCodes.length })
                );
              } catch (error) {
                console.error("Error importing QR codes:", error);
                Alert.alert(t("error"), t("importFailed"));
              }
            },
          },
        ]
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

  const handleOpenOnboarding = () => {
    router.push("/onboarding");
  };

  return (
    <View className="flex-1 bg-corp-white px-6 py-4">
      <Animated.View
        entering={FadeInDown.duration(400)
          .delay(400)
          .reduceMotion(ReduceMotion.Never)}
        className="mb-8"
      >
        <Text className="mb-4 text-lg font-medium text-corp-grey">
          {t("exportData")}
        </Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => handleExportAll("json")}
            className="mb-4 w-[48%] items-center rounded-lg bg-corp-dark-teal p-6"
          >
            <Ionicons name="document-text-outline" size={32} color="#FFFFFF" />
            <Text className="mt-2 text-center font-medium text-white">
              {t("exportAllJson")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleExportAll("csv")}
            className="mb-4 w-[48%] items-center rounded-lg bg-corp-grey p-6"
          >
            <Ionicons name="grid-outline" size={32} color="#FFFFFF" />
            <Text className="mt-2 text-center font-medium text-white">
              {t("exportAllCsv")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400)
          .delay(500)
          .reduceMotion(ReduceMotion.Never)}
        className="mb-8"
      >
        <TouchableOpacity
          onPress={handleImportFile}
          className="mb-4 w-full items-center rounded-lg bg-corp-purple/10 p-6"
        >
          <Ionicons name="cloud-upload-outline" size={32} color="#876CDA" />
          <Text className="mt-2 text-center font-medium text-corp-purple">
            {t("importFromFile")}
          </Text>
          <Text className="mt-1 text-center text-xs text-corp-purple/80">
            {t("supportedFormats")}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400)
          .delay(600)
          .reduceMotion(ReduceMotion.Never)}
        className="mb-8"
      >
        <TouchableOpacity
          onPress={handleOpenOnboarding}
          className="mb-4 w-full items-center rounded-lg bg-corp-teal/20 p-6 border border-corp-teal"
        >
          <Ionicons
            name="information-circle-outline"
            size={32}
            color="#2A8A85"
          />
          <Text className="mt-2 text-center font-medium text-corp-teal-dark">
            {t("settings.viewOnboarding")}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400)
          .delay(700)
          .reduceMotion(ReduceMotion.Never)}
        className="mb-8"
      >
        <Text className="mb-4 text-lg font-medium text-corp-grey">
          {t("dangerZone")}
        </Text>
        <Button
          title={t("deleteAllQRCodes")}
          onPress={handleDeleteAll}
          type="danger"
          icon="trash-outline"
          className="w-full"
        />
      </Animated.View>
    </View>
  );
}
