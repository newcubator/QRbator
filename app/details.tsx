import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import * as Linking from "expo-linking";
import {
  Stack,
  router,
  useLocalSearchParams,
} from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { Button } from "~/components/Button";
import { QRCodeEntry } from "~/core/qrCode";
import { deleteQRCode, getQRCodeById } from "~/core/qrCodeStorage";
import {
  MAX_QR_CONTENT_LENGTH,
  normalizeOpenableUrl,
  serializeQRCodesToCsv,
} from "~/core/qrCodeUtils";

export default function QRCodeDetailScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const [qrCode, setQrCode] = useState<QRCodeEntry | null>(null);
  const [isContentTooLarge, setIsContentTooLarge] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQRCode = useCallback(async () => {
    if (params.id) {
      setLoading(true);
      try {
        const data = await getQRCodeById(params.id);

        setIsContentTooLarge(
          Boolean(
            data?.content && data.content.length >= MAX_QR_CONTENT_LENGTH,
          ),
        );
        setQrCode(data);
      } catch (error) {
        console.error("Error fetching QR code:", error);
        setQrCode(null);
        setIsContentTooLarge(false);
        Alert.alert(t("error"), t("fetchFailed"));
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No ID provided to details screen.");
      setQrCode(null);
    }
  }, [params.id, t]);

  useFocusEffect(
    useCallback(() => {
      fetchQRCode();
    }, [fetchQRCode]),
  );

  const isValidUrl = useCallback(
    async (text: string, type?: string): Promise<boolean> => {
      if (type === "text") return false;

      if (!text) return false;

      const hasHttpProtocol =
        text.startsWith("http://") || text.startsWith("https://");

      const textToCheck = hasHttpProtocol ? text : `https://${text}`;

      try {
        return await Linking.canOpenURL(textToCheck);
      } catch {
        return false;
      }
    },
    [],
  );

  const [canOpenUrl, setCanOpenUrl] = useState(false);

  useEffect(() => {
    if (qrCode?.content) {
      isValidUrl(qrCode.content, qrCode.type).then(setCanOpenUrl);
    } else {
      setCanOpenUrl(false);
    }
  }, [qrCode, isValidUrl]);

  const handleOpenUrl = async () => {
    if (qrCode?.content) {
      try {
        await Linking.openURL(normalizeOpenableUrl(qrCode.content));
      } catch (error) {
        console.error("Error opening URL:", error);
        Alert.alert(t("error"), t("failedToOpenUrl"));
      }
    }
  };

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
      const content =
        format === "json"
          ? JSON.stringify(qrCode, null, 2)
          : serializeQRCodesToCsv([qrCode]);

      const file = new File(Paths.cache, fileName);
      file.create({ overwrite: true });
      file.write(content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
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

  if (isContentTooLarge) {
    return (
      <SafeAreaView className="flex-1 bg-corp-white pb-4">
        <Stack.Screen
          options={{
            title: qrCode.name,
          }}
        />
        <ScrollView
          className="flex-1 px-6 py-4"
          contentInsetAdjustmentBehavior="automatic"
        >
          <View className="mb-6 rounded-lg border border-corp-mid-grey bg-corp-light-grey p-4">
            <Text className="text-center text-corp-grey" selectable>
              {t("contentTooLarge", { maxLength: MAX_QR_CONTENT_LENGTH })}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("name")}
            </Text>
            <Text className="text-xl font-bold text-corp-grey" selectable>
              {qrCode.name}
            </Text>
          </View>

          <View className="mb-8">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("content")}
            </Text>
            <View className="rounded-lg border border-corp-mid-grey bg-white p-4">
              <Text className="text-corp-grey" selectable>
                {qrCode.content}
              </Text>
            </View>
          </View>

          <Button title={t("edit")} onPress={handleEdit} className="mb-4" />
          <Button title={t("goBack")} onPress={() => router.replace("/home")} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-corp-white pb-4">
      <Stack.Screen
        options={{
          title: qrCode ? qrCode.name : t("qrDetails"),
        }}
      />
      <ScrollView
        className="flex-1 px-6 py-4"
        contentInsetAdjustmentBehavior="automatic"
      >
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
            .delay(250)
            .reduceMotion(ReduceMotion.Never)}
          className="mb-6"
        >
          <Text className="mb-2 text-base font-medium text-corp-grey">
            {t("qrCodeType")}
          </Text>
          <View className="flex-row items-center">
            <Ionicons
              name={
                qrCode.type === "url"
                  ? "link"
                  : qrCode.type === "vcard"
                    ? "person"
                    : qrCode.type === "email"
                      ? "mail"
                      : "text"
              }
              size={20}
              color="#50505E"
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-medium text-corp-grey uppercase">
              {qrCode.type || "text"}
            </Text>
          </View>
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
              className="mb-4 w-[48%] flex-row items-start justify-center rounded-lg bg-corp-grey p-4"
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

            {canOpenUrl && (
              <TouchableOpacity
                onPress={handleOpenUrl}
                className="mt-4 w-full flex-row items-center justify-center rounded-lg bg-corp-grey p-4"
              >
                <Ionicons name="open-outline" size={18} color="#FFFFFF" />
                <Text className="ml-2 text-center font-medium text-white">
                  {t("open")}
                </Text>
              </TouchableOpacity>
            )}
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
