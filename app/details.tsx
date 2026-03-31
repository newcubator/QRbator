import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { File, Paths } from "expo-file-system";
import * as Linking from "expo-linking";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, Share, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { Button } from "~/components/Button";
import { QRCodeEntry } from "~/core/qrCode";
import { deleteQRCode, getQRCodeById } from "~/core/qrCodeStorage";
import {
  MAX_QR_CONTENT_LENGTH,
  normalizeOpenableUrl,
  serializeQRCodesToCsv,
} from "~/core/qrCodeUtils";

function DetailSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-sm font-medium uppercase tracking-wide text-corp-grey">
        {label}
      </Text>
      <View className="rounded-3xl border border-corp-mid-grey bg-corp-white p-4">
        {children}
      </View>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof (typeof Ionicons)["glyphMap"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-4"
      style={({ pressed }) => (pressed ? { opacity: 0.78 } : null)}
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-corp-light-grey">
        <Ionicons name={icon} size={18} color="#50505E" />
      </View>
      <Text className="flex-1 font-medium text-corp-grey">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#979797" />
    </Pressable>
  );
}

export default function QRCodeDetailScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const [qrCode, setQrCode] = useState<QRCodeEntry | null>(null);
  const [isContentTooLarge, setIsContentTooLarge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canOpenUrl, setCanOpenUrl] = useState(false);

  const fetchQRCode = useCallback(async () => {
    if (!params.id) {
      setQrCode(null);
      return;
    }

    setLoading(true);
    try {
      const data = await getQRCodeById(params.id);
      setIsContentTooLarge(
        Boolean(data?.content && data.content.length >= MAX_QR_CONTENT_LENGTH),
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
  }, [params.id, t]);

  useFocusEffect(
    useCallback(() => {
      fetchQRCode();
    }, [fetchQRCode]),
  );

  const isValidUrl = useCallback(
    async (text: string, type?: string): Promise<boolean> => {
      if (!text || type === "text") {
        return false;
      }

      try {
        return await Linking.canOpenURL(normalizeOpenableUrl(text));
      } catch {
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    if (qrCode?.content) {
      isValidUrl(qrCode.content, qrCode.type).then(setCanOpenUrl);
    } else {
      setCanOpenUrl(false);
    }
  }, [isValidUrl, qrCode]);

  const handleOpenUrl = async () => {
    if (!qrCode?.content) {
      return;
    }

    try {
      await Linking.openURL(normalizeOpenableUrl(qrCode.content));
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert(t("error"), t("failedToOpenUrl"));
    }
  };

  const handleCopyContent = async () => {
    if (!qrCode) {
      return;
    }

    await Clipboard.setStringAsync(qrCode.content);
    Alert.alert(t("success"), t("contentCopied"));
  };

  const handleShare = async () => {
    if (!qrCode) {
      return;
    }

    try {
      await Share.share({
        message: qrCode.content,
        title: qrCode.name,
      });
    } catch (error) {
      console.error("Error sharing QR code:", error);
      Alert.alert(t("error"), t("shareFailed"));
    }
  };

  const handleExport = async (format: "json" | "csv") => {
    if (!qrCode) {
      return;
    }

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
          if (!qrCode) {
            return;
          }

          try {
            await deleteQRCode(qrCode.id);
            router.replace("/home");
          } catch (error) {
            console.error("Error deleting QR code:", error);
            Alert.alert(t("error"), t("deleteFailed"));
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-corp-white">
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  if (!qrCode) {
    return (
      <View className="flex-1 items-center justify-center bg-corp-white px-6">
        <Text>{t("qrCodeNotFound")}</Text>
        <Button
          title={t("goBack")}
          onPress={() => router.replace("/home")}
          className="mt-4"
        />
      </View>
    );
  }

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
        <View className="mb-8 items-center">
          {isContentTooLarge ? (
            <View className="w-full rounded-3xl border border-corp-mid-grey bg-corp-light-grey p-4">
              <Text className="text-center text-corp-grey" selectable>
                {t("contentTooLarge", { maxLength: MAX_QR_CONTENT_LENGTH })}
              </Text>
            </View>
          ) : (
            <View className="rounded-3xl border border-corp-mid-grey bg-corp-white p-4">
              <QRCode
                value={qrCode.content || ""}
                size={200}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>
          )}
        </View>

        <DetailSection label={t("name")}>
          <Text className="text-xl font-semibold text-corp-grey" selectable>
            {qrCode.name}
          </Text>
        </DetailSection>

        <DetailSection label={t("qrCodeType")}>
          <View className="flex-row items-center">
            <Ionicons
              name={
                qrCode.type === "url"
                  ? "link-outline"
                  : qrCode.type === "vcard"
                    ? "person-outline"
                    : qrCode.type === "email"
                      ? "mail-outline"
                      : qrCode.type === "wifi"
                        ? "wifi-outline"
                        : "text-outline"
              }
              size={18}
              color="#50505E"
              style={{ marginRight: 8 }}
            />
            <Text className="font-medium uppercase text-corp-grey">
              {qrCode.type || "text"}
            </Text>
          </View>
        </DetailSection>

        <DetailSection label={t("content")}>
          <Text className="text-corp-grey" selectable>
            {qrCode.content}
          </Text>
        </DetailSection>

        {qrCode.description ? (
          <DetailSection label={t("description")}>
            <Text className="text-corp-grey" selectable>
              {qrCode.description}
            </Text>
          </DetailSection>
        ) : null}

        {qrCode.tags.length > 0 ? (
          <DetailSection label={t("tags")}>
            <View className="flex-row flex-wrap">
              {qrCode.tags.map((tag) => (
                <View
                  key={tag}
                  className="mb-2 mr-2 rounded-full border border-corp-mid-grey bg-corp-white px-3 py-1.5"
                >
                  <Text className="text-xs text-corp-grey">{tag}</Text>
                </View>
              ))}
            </View>
          </DetailSection>
        ) : null}

        <View className="mb-8">
          <Text className="mb-2 text-sm font-medium uppercase tracking-wide text-corp-grey">
            {t("actions")}
          </Text>
          <View className="overflow-hidden rounded-3xl border border-corp-mid-grey bg-corp-white">
            <ActionRow
              icon="copy-outline"
              label={t("copyContent")}
              onPress={handleCopyContent}
            />
            <View className="border-b border-corp-light-grey" />
            <ActionRow
              icon="share-outline"
              label={t("shareContent")}
              onPress={handleShare}
            />
            <View className="border-b border-corp-light-grey" />
            <ActionRow
              icon="document-text-outline"
              label={t("exportJson")}
              onPress={() => handleExport("json")}
            />
            <View className="border-b border-corp-light-grey" />
            <ActionRow
              icon="grid-outline"
              label={t("exportCsv")}
              onPress={() => handleExport("csv")}
            />
            {canOpenUrl ? (
              <>
                <View className="border-b border-corp-light-grey" />
                <ActionRow
                  icon="open-outline"
                  label={t("open")}
                  onPress={handleOpenUrl}
                />
              </>
            ) : null}
          </View>
        </View>

        <Button
          title={t("edit")}
          onPress={() =>
            router.push({
              pathname: "/add-edit",
              params: { id: qrCode.id },
            })
          }
          className="mb-3"
          icon="create-outline"
        />
        <Button
          title={t("delete")}
          onPress={handleDelete}
          type="danger"
          icon="trash-outline"
        />
      </ScrollView>
      <Stack.Screen
        options={{
          title: qrCode.name,
          headerShadowVisible: false,
        }}
      />
    </>
  );
}
