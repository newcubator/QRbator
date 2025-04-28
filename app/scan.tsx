import { Camera, CameraView } from "expo-camera";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "~/components/Button";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    router.push({
      pathname: "/add-edit",
      params: { content: data, type, origin: "scan" },
    });
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-corp-white">
        <Text className="text-corp-grey">
          {t("requestingCameraPermission")}
        </Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-corp-white px-6">
        <Text className="mb-4 text-center text-lg text-corp-grey">
          {t("noCameraPermission")}
        </Text>
        <Button title={t("goBack")} onPress={() => router.dismiss()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-corp-white">
      <Stack.Screen
        options={{
          title: t("scanQRCode"),
          presentation: "modal",
        }}
      />
      <View className="flex-1">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="absolute bottom-8 left-0 right-0 items-center">
          {scanned && (
            <Button
              title={t("scanAgain")}
              onPress={() => setScanned(false)}
              icon="scan"
              className="mb-4"
            />
          )}
          <Button
            title={t("cancel")}
            onPress={() => router.dismiss()}
            type="secondary"
          />
        </View>

        <View className="absolute left-0 right-0 top-0 items-center bg-black/50 p-4">
          <Text className="text-center text-corp-white">
            {t("positionQRCode")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
