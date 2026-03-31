import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/components/Button";

const steps = [
  {
    titleKey: "onboarding.welcomeTitle",
    descriptionKey: "onboarding.welcomeDescription",
    icon: "scan-outline",
    bgColor: "bg-corp-teal",
    iconColor: "#FFFFFF",
  },
  {
    titleKey: "onboarding.tagsTitle",
    descriptionKey: "onboarding.tagsDescription",
    icon: "pricetags-outline",
    bgColor: "bg-corp-yellow",
    iconColor: "#50505E",
  },
  {
    titleKey: "onboarding.shareTitle",
    descriptionKey: "onboarding.shareDescription",
    icon: "share-social-outline",
    bgColor: "bg-corp-purple",
    iconColor: "#FFFFFF",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("onboardingComplete", "true");
    router.dismissTo("/home");
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    await finishOnboarding();
  };

  const currentStep = steps[step];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 px-6 pb-6 pt-4">
        <View className="mb-6 flex-row justify-end">
          <Pressable
            onPress={finishOnboarding}
            style={({ pressed }) => (pressed ? { opacity: 0.72 } : null)}
          >
            <Text className="font-medium text-corp-grey">{t("skip")}</Text>
          </Pressable>
        </View>

        <View className="flex-1 justify-between">
          <View className="items-center pt-10">
            <View
              className={`${currentStep.bgColor} mb-8 rounded-full items-center justify-center p-9`}
            >
              <Ionicons
                name={currentStep.icon as any}
                size={80}
                color={currentStep.iconColor}
              />
            </View>

            <View className="items-center">
              <Text className="mb-4 text-center text-3xl font-bold text-gray-700">
                {t(currentStep.titleKey)}
              </Text>
              <Text className="px-4 text-center text-base leading-6 text-gray-500">
                {t(currentStep.descriptionKey)}
              </Text>
            </View>
          </View>

          <View className="pb-2">
            <View className="mb-4 flex-row items-center justify-center">
              {steps.map((_, i) => (
                <View
                  key={i}
                  className={`mx-1.5 h-2.5 w-2.5 rounded-full ${
                    i === step ? "bg-corp-teal" : "bg-gray-500"
                  }`}
                />
              ))}
            </View>

            <Button
              title={
                step === steps.length - 1
                  ? t("onboarding.getStarted")
                  : t("onboarding.next")
              }
              icon={step === steps.length - 1 ? "checkmark-outline" : undefined}
              onPress={handleNext}
              className="w-full"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
