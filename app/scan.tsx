import { Camera, CameraView } from "expo-camera";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { HeaderHeightContext } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/Button";
import { inferQRCodeTypeFromContent } from "~/core/qrCodeUtils";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { t } = useTranslation();
  const headerHeight = useContext(HeaderHeightContext) ?? 0;


  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);

    router.navigate({
      pathname: "/add-edit",
      params: {
        content: data,
        type: inferQRCodeTypeFromContent(data),
        origin: "scan",
      },
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

  if (!hasPermission) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-corp-white px-6"
        edges={["left", "right", "bottom"]}
      >
        <Text className="mb-4 text-center text-lg text-corp-grey">
          {t("noCameraPermission")}
        </Text>
        <Button title={t("goBack")} onPress={() => router.replace("/home")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-corp-white" edges={["left", "right", "bottom"]}>
      <View className="flex-1" style={{ marginTop: headerHeight }}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "qr",
              "pdf417",
              "aztec",
              "datamatrix",
              "code128",
              "code39",
              "code93",
              "ean13",
              "ean8",
              "itf14",
              "upc_e",
            ],
          }}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="absolute bottom-8 left-0 right-0 items-center px-6">
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
            onPress={() => router.replace("/home")}
            type="secondary"
          />
        </View>

        <View className="absolute left-0 right-0 top-0 items-center bg-black/50 px-4 py-3">
          <Text className="text-center text-corp-white">
            {t("positionQRCode")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
