import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { Button } from "~/components/Button";
import { QRCodeEntry } from "~/core/qrCode";
import {
  deleteAllQRCodes,
  getAllQRCodes,
  importQRCodes,
} from "~/core/qrCodeStorage";
import { parseQRCodesFromCsv, serializeQRCodesToCsv } from "~/core/qrCodeUtils";

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

      if (format === "json") {
        content = JSON.stringify(codes, null, 2);
      } else {
        content = serializeQRCodesToCsv(codes);
      }

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

  const handleOpenOnboarding = () => {
    router.push("/onboarding");
  };

  return (
    <ScrollView
      className="flex-1 bg-corp-white px-6 py-4"
      contentInsetAdjustmentBehavior="automatic"
    >
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
    </ScrollView>
  );
}
