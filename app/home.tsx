import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
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

const ACCENT_COLOR = "#FF8552";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

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
      } catch (error) {}
    };
    init();
  }, []);

  const loadQRCodes = useCallback(async () => {
    if (!isInitialized) {
      return;
    }
    try {
      let codes: QRCodeEntry[];
      if (selectedTag) {
        codes = await getQRCodesByTag(selectedTag);
      } else {
        codes = await getAllQRCodes();
      }
      setQrCodes(codes);

      const allCodesForTags = await getAllQRCodes();
      const uniqueTags = Array.from(
        new Set(allCodesForTags.flatMap((code) => code.tags))
      );
      setAllTags(uniqueTags);
    } catch (error) {
      console.error("Error loading QR codes:", error);
    }
  }, [selectedTag, isInitialized]);

  useFocusEffect(
    useCallback(() => {
      loadQRCodes();
    }, [loadQRCodes])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadQRCodes();
    setRefreshing(false);
  }, [loadQRCodes]);

  const handleSelectTag = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const renderQRCodeItem = ({ item }: { item: QRCodeEntry }) => (
    <AnimatedTouchableOpacity
      entering={FadeIn.duration(300).reduceMotion(ReduceMotion.Never)}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.Never)}
      layout={Layout.springify().reduceMotion(ReduceMotion.Never)}
      className="mb-4 rounded-xl bg-corp-white p-4 shadow-sm border border-corp-mid-grey"
      onPress={() =>
        router.push({ pathname: "/details", params: { id: item.id } })
      }
    >
      <View className="flex-row items-center">
        <View className="mr-3 rounded-full bg-corp-teal p-2">
          <Ionicons name="qr-code" size={24} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-corp-grey">{item.name}</Text>
          <Text className="text-corp-grey" numberOfLines={1}>
            {item.content}
          </Text>
        </View>
      </View>

      {item.tags.length > 0 && (
        <View className="mt-2 flex-row flex-wrap">
          {item.tags.map((tag) => (
            <View
              key={tag}
              className="mr-2 mt-1 rounded-full border border-corp-grey bg-white px-2 py-1"
            >
              <Text className="text-xs text-corp-grey">{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </AnimatedTouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-corp-white px-6 pt-4">
      <View className="mb-4 items-center">
        <View className="rounded-full bg-corp-teal p-5">
          <Ionicons name="qr-code" size={48} color="#FFFFFF" />
        </View>
      </View>
      <Text className="mb-4 text-center text-2xl font-extrabold text-corp-grey">
        {t("qrCodes")}
      </Text>

      <View className="mb-4 flex-row justify-between">
        <TouchableOpacity
          onPress={() => router.push("/scan")}
          className="w-[31%] items-center rounded-lg bg-corp-grey p-3"
        >
          <Ionicons name="scan" size={24} color="#FFFFFF" />
          <Text className="mt-1 text-center text-xs text-white">
            {t("tab-scanQR")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/add-edit")}
          className="w-[31%] items-center rounded-lg bg-corp-grey p-3"
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text className="mt-1 text-center text-xs text-white">
            {t("addEditQR")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings")}
          className="w-[31%] items-center rounded-lg bg-corp-grey p-3"
        >
          <Ionicons name="settings" size={24} color="#FFFFFF" />
          <Text className="mt-1 text-center text-xs text-white">
            {t("tab-settings")}
          </Text>
        </TouchableOpacity>
      </View>

      {allTags.length > 0 && (
        <View className="mb-4">
          <Text className="mb-2 text-corp-grey">{t("filterByTag")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {allTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => handleSelectTag(tag)}
                className={`mr-2 rounded-full border px-3 py-2 ${
                  selectedTag === tag
                    ? "border-corp-dark-teal bg-corp-dark-teal"
                    : "border-corp-grey bg-white"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedTag === tag ? "text-corp-white" : "text-corp-grey"
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={qrCodes}
        keyExtractor={(item) => item.id}
        renderItem={renderQRCodeItem}
        contentContainerClassName="pb-5"
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center rounded-2xl border border-corp-mid-grey bg-white p-6">
            <Text className="text-corp-grey">
              {selectedTag
                ? t("noQRCodesWithTag", { tag: selectedTag })
                : t("noQRCodes")}
            </Text>
            <Button
              title={t("scanNewQRCode")}
              icon="scan"
              onPress={() => router.push("/scan")}
              className="mt-4"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
