import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

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
      <View className="mb-2 flex-row flex-wrap">
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => onRemoveTag(tag)}
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
          onChangeText={onNewTagChange}
          placeholder={t("addTag")}
          placeholderTextColor="#767683"
          onSubmitEditing={onAddTag}
        />
        <TouchableOpacity
          className="ml-2 items-center justify-center rounded-lg bg-corp-teal px-4"
          onPress={onAddTag}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
