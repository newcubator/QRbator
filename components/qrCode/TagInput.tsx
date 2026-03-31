import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";

interface TagInputProps {
  tags: string[];
  newTag: string;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const TagInput = ({
  tags,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
}: TagInputProps) => {
  const { t } = useTranslation();

  return (
    <View className="mb-4">
      <Text className="mb-2 text-base font-medium text-corp-grey">
        {t("tags")}
      </Text>
      <View className="mb-3 flex-row flex-wrap">
        {tags.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => onRemoveTag(tag)}
            className="mb-2 mr-2 flex-row items-center rounded-full border border-corp-mid-grey bg-corp-white px-3 py-2"
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : null)}
          >
            <Text className="mr-1 text-corp-grey">{tag}</Text>
            <Ionicons name="close-circle" size={16} color="#50505E" />
          </Pressable>
        ))}
      </View>
      <View className="flex-row">
        <TextInput
          className="flex-1 rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
          value={newTag}
          onChangeText={onNewTagChange}
          placeholder={t("addTag")}
          placeholderTextColor="#767683"
          onSubmitEditing={onAddTag}
        />
        <Pressable
          className="ml-2 items-center justify-center rounded-2xl bg-corp-teal px-4"
          onPress={onAddTag}
          style={({ pressed }) => (pressed ? { opacity: 0.84 } : null)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
};
