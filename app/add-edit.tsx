import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "~/components/Button";
import { QRCodeEntry } from "~/core/qrCode";
import { addQRCode, getQRCodeById, updateQRCode } from "~/core/qrCodeStorage";

export default function AddEditQRCodeScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    id?: string;
    content?: string;
    type?: string;
    origin?: string;
  }>();

  const [name, setName] = useState("");
  const [content, setContent] = useState(params.content || "");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      // If we have an ID, we're editing an existing QR code
      if (params.id) {
        setIsEditing(true);
        setLoading(true);
        try {
          const qrCode = await getQRCodeById(params.id);
          if (qrCode) {
            setName(qrCode.name);
            setContent(qrCode.content);
            setDescription(qrCode.description || "");
            setTags(qrCode.tags);
          }
        } catch (error) {
          console.error("Error fetching QR code:", error);
          Alert.alert(t("error"), t("fetchFailed"));
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQRCode();
  }, [params.id, t]);

  const handleSave = async () => {
    if (!name) {
      Alert.alert(t("error"), t("nameRequired"));
      return;
    }

    if (!content) {
      Alert.alert(t("error"), t("contentRequired"));
      return;
    }

    try {
      const qrCode: QRCodeEntry = {
        id: params.id || Date.now().toString(),
        name,
        content,
        tags,
        description,
        createdAt: new Date().toISOString(),
      };

      if (isEditing) {
        await updateQRCode(qrCode);
      } else {
        await addQRCode(qrCode);
      }

      if (params.origin === "scan") {
        router.dismissAll();
      } else {
        router.dismiss();
      }
    } catch (error) {
      console.error("Error saving QR code:", error);
      Alert.alert(t("error"), t("saveFailed"));
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-corp-white">
        <Text>{t("loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-corp-white">
      <Stack.Screen
        options={{
          title: isEditing ? t("editQRCode") : t("addQRCode"),
          presentation: "formSheet",
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 px-6 py-4">
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("name")}
            </Text>
            <TextInput
              className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
              value={name}
              onChangeText={setName}
              placeholder={t("enterName")}
              placeholderTextColor="#767683"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("tags")}
            </Text>
            <View className="mb-2 flex-row flex-wrap">
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => removeTag(tag)}
                  className="m-1 flex-row items-center rounded-full border border-corp-teal bg-white px-3 py-1"
                >
                  <Text className="mr-1 text-corp-grey">{tag}</Text>
                  <Ionicons name="close-circle" size={16} color="#50505E" />
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row">
              <TextInput
                className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
                value={newTag}
                onChangeText={setNewTag}
                placeholder={t("addTag")}
                placeholderTextColor="#767683"
                onSubmitEditing={addTag}
              />
              <TouchableOpacity
                className="ml-2 items-center justify-center rounded-lg bg-corp-teal px-4"
                onPress={addTag}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("description")}
            </Text>
            <TextInput
              className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
              value={description}
              onChangeText={setDescription}
              placeholder={t("enterDescription")}
              placeholderTextColor="#767683"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View className="mb-8">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("qrContent")}
            </Text>
            {!isEditing && !params.content ? (
              <TextInput
                className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
                value={content}
                onChangeText={setContent}
                placeholder={t("enterQrContentPlaceholder")}
                placeholderTextColor="#767683"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoCapitalize="none"
              />
            ) : (
              <View className="rounded-lg border border-corp-mid-grey bg-white p-4">
                <Text className="text-corp-grey">{content}</Text>
              </View>
            )}
          </View>

          <View className="mb-8 flex-row">
            <Button
              title={isEditing ? t("update") : t("save")}
              onPress={handleSave}
              className="mr-2 flex-1 bg-corp-dark-teal"
            />
            <Button
              title={t("cancel")}
              onPress={() => router.dismiss()}
              type="secondary"
              className="ml-2 flex-1 border border-corp-grey bg-white"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
