import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import {
  Stack,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { Button } from "~/components/Button";
import { QRCodeEntry } from "~/core/qrCode";
import { deleteQRCode, getQRCodeById } from "~/core/qrCodeStorage";

export default function QRCodeDetailScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const [qrCode, setQrCode] = useState<QRCodeEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQRCode = useCallback(async () => {
    if (params.id) {
      setLoading(true);
      try {
        const data = await getQRCodeById(params.id);
        setQrCode(data);
      } catch (error) {
        console.error("Error fetching QR code:", error);
        setQrCode(null);
        Alert.alert(t("error"), t("fetchFailed"));
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No ID provided to details screen.");
      setQrCode(null);
      setLoading(false);
    }
  }, [params.id, t]);

  useFocusEffect(
    useCallback(() => {
      fetchQRCode();
    }, [fetchQRCode])
  );

  const handleCopyContent = async () => {
    if (qrCode) {
      await Clipboard.setStringAsync(qrCode.content);
      Alert.alert(t("success"), t("contentCopied"));
    }
  };

  const handleShare = async () => {
    if (qrCode) {
      try {
        await Share.share({
          message: qrCode.content,
          title: qrCode.name,
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
        Alert.alert(t("error"), t("shareFailed"));
      }
    }
  };

  const handleExport = async (format: "json" | "csv") => {
    if (!qrCode) return;

    try {
      const fileName = `qrcode_${qrCode.id}.${format}`;
      const dir = FileSystem.cacheDirectory;
      if (!dir) {
        Alert.alert(t("error"), "Could not access cache directory.");
        return;
      }
      let content = "";

      if (format === "json") {
        content = JSON.stringify(qrCode, null, 2);
      } else {
        // Simple CSV format
        const headers = "id,name,content,description,createdAt,tags\n";
        const tags = qrCode.tags.join(";");
        content = `${headers}"${qrCode.id}","${qrCode.name}","${
          qrCode.content
        }","${qrCode.description || ""}","${qrCode.createdAt}","${tags}"`;
      }

      const fileUri = `${dir}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(t("error"), t("sharingNotAvailable"));
      }
    } catch (error) {
      console.error("Error exporting QR code:", error);
      Alert.alert(t("error"), t("exportFailed"));
    }
  };

  const handleDelete = () => {
    Alert.alert(t("confirmDelete"), t("deleteConfirmMessage"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          if (qrCode) {
            try {
              await deleteQRCode(qrCode.id);
              router.replace("/home");
            } catch (error) {
              console.error("Error deleting QR code:", error);
              Alert.alert(t("error"), t("deleteFailed"));
            }
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (qrCode) {
      router.push({
        pathname: "/add-edit",
        params: { id: qrCode.id },
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-corp-white">
        <Text>{t("loading")}</Text>
      </SafeAreaView>
    );
  }

  if (!qrCode) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-corp-white">
        <Text>{t("qrCodeNotFound")}</Text>
        <Button
          title={t("goBack")}
          onPress={() => router.replace("/home")}
          className="mt-4"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-corp-white">
      <Stack.Screen
        options={{
          title: qrCode ? qrCode.name : t("qrDetails"),
        }}
      />
      <ScrollView className="flex-1 px-6 py-4">
        <Animated.View
          entering={FadeInDown.duration(400)
            .delay(100)
            .reduceMotion(ReduceMotion.Never)}
          className="mb-8 items-center"
        >
          <View className="rounded-lg bg-corp-white p-4 shadow-md border border-corp-mid-grey">
            <QRCode
              value={qrCode.content || ""}
              size={200}
              backgroundColor="#FFFFFF"
              color="#000000"
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400)
            .delay(200)
            .reduceMotion(ReduceMotion.Never)}
          className="mb-6"
        >
          <Text className="mb-2 text-base font-medium text-corp-grey">
            {t("name")}
          </Text>
          <Text className="text-xl font-bold text-corp-grey">
            {qrCode.name}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400)
            .delay(300)
            .reduceMotion(ReduceMotion.Never)}
          className="mb-6"
        >
          <Text className="mb-2 text-base font-medium text-corp-grey">
            {t("content")}
          </Text>
          <View className="rounded-lg border border-corp-mid-grey bg-white p-4">
            <Text className="text-corp-grey" selectable>
              {qrCode.content}
            </Text>
          </View>
        </Animated.View>

        {qrCode.description && (
          <Animated.View
            entering={FadeInDown.duration(400)
              .delay(400)
              .reduceMotion(ReduceMotion.Never)}
            className="mb-6"
          >
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("description")}
            </Text>
            <Text className="text-corp-grey">{qrCode.description}</Text>
          </Animated.View>
        )}

        {qrCode.tags.length > 0 && (
          <Animated.View
            entering={FadeInDown.duration(400)
              .delay(500)
              .reduceMotion(ReduceMotion.Never)}
            className="mb-8"
          >
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("tags")}
            </Text>
            <View className="flex-row flex-wrap">
              {qrCode.tags.map((tag) => (
                <View
                  key={tag}
                  className="mr-2 mt-1 rounded-full border border-corp-grey bg-white px-2 py-1"
                >
                  <Text className="text-xs text-corp-grey">{tag}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInDown.duration(400)
            .delay(600)
            .reduceMotion(ReduceMotion.Never)}
          className="mb-8"
        >
          <Text className="mb-4 text-lg font-medium text-corp-grey">
            {t("actions")}
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              onPress={handleCopyContent}
              className="mb-4 w-[48%] flex-row items-center justify-center rounded-lg bg-corp-grey p-4"
            >
              <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
              <Text className="ml-2 text-center font-medium text-white">
                {t("copyContent")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="mb-4 w-[48%] flex-row items-center justify-center rounded-lg bg-corp-grey p-4"
            >
              <Ionicons name="share-outline" size={18} color="#FFFFFF" />
              <Text className="ml-2 text-center font-medium text-white">
                {t("shareContent")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleExport("json")}
              className="w-[48%] flex-row items-center justify-center rounded-lg bg-corp-grey p-4"
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#FFFFFF"
              />
              <Text className="ml-2 text-center font-medium text-white">
                {t("exportJson")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleExport("csv")}
              className="w-[48%] flex-row items-center justify-center rounded-lg bg-corp-grey p-4"
            >
              <Ionicons name="grid-outline" size={18} color="#FFFFFF" />
              <Text className="ml-2 text-center font-medium text-white">
                {t("exportCsv")}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400)
            .delay(700)
            .reduceMotion(ReduceMotion.Never)}
          className="mt-4"
        >
          <Button
            title={t("edit")}
            onPress={handleEdit}
            className="mb-4"
            icon="create-outline"
          />

          <Button
            title={t("delete")}
            onPress={handleDelete}
            className="mb-8"
            type="danger"
            icon="trash-outline"
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
