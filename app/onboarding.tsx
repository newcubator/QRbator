import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, Text, View } from "react-native";
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

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      await AsyncStorage.setItem("onboardingComplete", "true");
      router.replace({ pathname: "/home" });
    }
  };

  const currentStep = steps[step];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between p-6">
        <View className="flex-1 items-center justify-center pb-16">
          <View className="mb-10">
            <View
              className={`${currentStep.bgColor} rounded-full justify-center items-center p-10`}
            >
              <Ionicons
                name={currentStep.icon as any}
                size={100}
                color={currentStep.iconColor}
              />
            </View>
          </View>

          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-700 text-center mb-4">
              {t(currentStep.titleKey)}
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6">
              {t(currentStep.descriptionKey)}
            </Text>
          </View>
        </View>

        <View className="pb-4">
          <View className="flex-row justify-center items-center mb-4">
            {steps.map((_, i) => (
              <View
                key={i}
                className={`h-2.5 w-2.5 rounded-full mx-1.5 ${
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
            className="w-full mt-8"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
