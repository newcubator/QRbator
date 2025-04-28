import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const onboarded = await AsyncStorage.getItem("onboardingComplete");
        if (onboarded === "true") {
          router.replace("/home");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Navigation error:", error);
        router.replace("/home");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return null;
}
