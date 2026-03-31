import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Suspense } from "react";
import "../global.css";
import "../translation";

export default function Layout() {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <GestureHandlerRootView>
        <Stack
          screenOptions={{
            headerTintColor: "#50505E",
          }}
        >
          <Stack.Screen
            name="home"
            options={{
              headerShown: false,
              title: t("qrOrganizer"),
            }}
          />
          <Stack.Screen
            name="scan"
            options={{
              title: t("scanQRCode"),
              headerShown: true,
              presentation: "formSheet",
              sheetGrabberVisible: true,
              contentStyle: {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: t("tab-settings"),
              headerShown: true,
              headerBackTitle: t("back"),
            }}
          />
          <Stack.Screen
            name="add-edit"
            options={{
              title: t("addEditQR"),
              headerShown: true,
              presentation: "formSheet",
              sheetGrabberVisible: true,
              contentStyle: {
                backgroundColor: "#FFFFFF",
              },
            }}
          />
          <Stack.Screen
            name="details"
            options={{
              headerShown: true,
              headerBackTitle: t("back"),
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </Suspense>
  );
}
