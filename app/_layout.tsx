import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Platform } from "react-native";

import { DB_NAME } from "@/core/qrCodeStorage";
import * as SQLite from "expo-sqlite";
import { Suspense } from "react";
import "../global.css";
import "../translation";

const dbPromise = SQLite.openDatabaseSync(DB_NAME);

export default function Layout() {
  const { t } = useTranslation();

  // useDrizzleStudio(dbPromise);

  return (
    <Suspense fallback={<ActivityIndicator />}>
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
            presentation: Platform.OS === "ios" ? "formSheet" : "modal",
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
            presentation: Platform.OS === "ios" ? "formSheet" : "modal",
            contentStyle: {
              backgroundColor: "#FFFFFF",
              height: "100%",
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
    </Suspense>
  );
}
