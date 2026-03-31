import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  ReduceMotion,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/components/Button";
import { QRCodeEntry } from "~/core/qrCode";
import { getAllQRCodes, getQRCodesByTag, initDB } from "~/core/qrCodeStorage";

function QuickAction({
  icon,
  label,
  onPress,
  primary = false,
}: {
  icon: keyof (typeof Ionicons)["glyphMap"];
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 rounded-2xl border px-4 py-3 ${
        primary
          ? "border-corp-dark-teal bg-corp-dark-teal"
          : "border-corp-mid-grey bg-corp-white"
      }`}
      style={({ pressed }) => (pressed ? { opacity: 0.84 } : null)}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons
          name={icon}
          size={18}
          color={primary ? "#FFFFFF" : "#50505E"}
        />
        <Text
          className={`ml-2 font-semibold ${
            primary ? "text-white" : "text-corp-grey"
          }`}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const [qrCodes, setQrCodes] = useState<QRCodeEntry[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };
    init();
  }, []);

  const loadQRCodes = useCallback(async () => {
    if (!isInitialized) {
      return;
    }

    try {
      const codes = selectedTag
        ? await getQRCodesByTag(selectedTag)
        : await getAllQRCodes();
      setQrCodes(codes);

      const allCodesForTags = await getAllQRCodes();
      const uniqueTags = Array.from(
        new Set(allCodesForTags.flatMap((code) => code.tags)),
      );
      setAllTags(uniqueTags);
    } catch (error) {
      console.error("Error loading QR codes:", error);
    }
  }, [isInitialized, selectedTag]);

  useFocusEffect(
    useCallback(() => {
      loadQRCodes();
    }, [loadQRCodes]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadQRCodes();
    setRefreshing(false);
  }, [loadQRCodes]);

  const handleSelectTag = (tag: string) => {
    setSelectedTag((currentTag) => (currentTag === tag ? null : tag));
  };

  const renderQRCodeItem = ({ item }: { item: QRCodeEntry }) => (
    <Animated.View
      entering={FadeIn.duration(300).reduceMotion(ReduceMotion.Never)}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.Never)}
      layout={Layout.springify().reduceMotion(ReduceMotion.Never)}
      className="mb-3"
    >
      <Pressable
        onPress={() =>
          router.push({ pathname: "/details", params: { id: item.id } })
        }
        className="rounded-3xl border border-corp-mid-grey bg-corp-white px-4 py-4"
        style={({ pressed }) => (pressed ? { opacity: 0.84 } : null)}
      >
        <View className="flex-row items-center">
          <View className="mr-3 rounded-full bg-corp-teal p-3">
            <Ionicons name="qr-code" size={20} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-corp-grey">
              {item.name}
            </Text>
            <Text className="text-corp-grey" numberOfLines={1} selectable>
              {item.content}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#979797" />
        </View>

        {item.tags.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap">
            {item.tags.map((tag) => (
              <View
                key={tag}
                className="mb-2 mr-2 rounded-full border border-corp-mid-grey bg-corp-white px-3 py-1.5"
              >
                <Text className="text-xs text-corp-grey">{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-corp-white" edges={["top"]}>
      <FlatList
        data={qrCodes}
        keyExtractor={(item) => item.id}
        renderItem={renderQRCodeItem}
        className="flex-1 bg-corp-white"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View className="mb-6">
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="flex-1 pr-4 text-4xl font-bold text-corp-grey">
                {t("qrCodes")}
              </Text>
              <Pressable
                onPress={() => router.push("/settings")}
                hitSlop={10}
                className="h-12 w-12 items-center justify-center rounded-full border border-corp-light-grey bg-corp-white"
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
              >
                <Ionicons name="settings-outline" size={22} color="#50505E" />
              </Pressable>
            </View>

            <View className="mb-4 flex-row gap-3">
              <QuickAction
                icon="scan-outline"
                label={t("tab-scanQR")}
                onPress={() => router.push("/scan")}
              />
              <QuickAction
                icon="add-outline"
                label={t("addQRCodeShort")}
                onPress={() => router.push("/add-edit")}
                primary
              />
            </View>

            {allTags.length > 0 ? (
              <View>
                <Text className="mb-3 text-sm font-medium uppercase tracking-wide text-corp-grey">
                  {t("filterByTag")}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 24 }}
                >
                  <Pressable
                    onPress={() => setSelectedTag(null)}
                    className={`mr-2 rounded-full border px-4 py-2 ${
                      selectedTag === null
                        ? "border-corp-dark-teal bg-corp-dark-teal"
                        : "border-corp-mid-grey bg-corp-white"
                    }`}
                    style={({ pressed }) => (pressed ? { opacity: 0.84 } : null)}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedTag === null ? "text-white" : "text-corp-grey"
                      }`}
                    >
                      {t("qrCodes")}
                    </Text>
                  </Pressable>
                  {allTags.map((tag) => (
                    <Pressable
                      key={tag}
                      onPress={() => handleSelectTag(tag)}
                      className={`mr-2 rounded-full border px-4 py-2 ${
                        selectedTag === tag
                          ? "border-corp-dark-teal bg-corp-dark-teal"
                          : "border-corp-mid-grey bg-corp-white"
                      }`}
                      style={({ pressed }) =>
                        pressed ? { opacity: 0.84 } : null
                      }
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selectedTag === tag
                            ? "text-white"
                            : "text-corp-grey"
                        }`}
                      >
                        {tag}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center rounded-3xl border border-corp-mid-grey bg-corp-white px-5 py-6">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-corp-light-grey">
              <Ionicons name="qr-code-outline" size={24} color="#00A092" />
            </View>
            <Text className="text-lg font-semibold text-corp-grey">
              {selectedTag
                ? t("noQRCodesWithTag", { tag: selectedTag })
                : t("noQRCodes")}
            </Text>
            <View className="mt-5 flex-row gap-3">
              <Button
                title={t("tab-scanQR")}
                icon="scan-outline"
                onPress={() => router.push("/scan")}
                type="secondary"
                className="flex-1"
              />
              <Button
                title={t("addQRCode")}
                icon="add-outline"
                onPress={() => router.push("/add-edit")}
                className="flex-1"
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
