import { act, render } from "@testing-library/react-native";
import { router } from "expo-router";
import ScanScreen from "../app/scan";

jest.mock("expo-camera", () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(),
  },
  CameraView: jest.fn().mockImplementation(({ children }) => children),
}));

describe("<ScanScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("expo-camera").Camera.requestCameraPermissionsAsync.mockReset();
  });

  test("renders permission denied state", async () => {
    require("expo-camera").Camera.requestCameraPermissionsAsync.mockResolvedValue(
      {
        status: "denied",
      },
    );

    const renderResult = render(<ScanScreen />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(renderResult.getByText("noCameraPermission")).toBeTruthy();
  });

  test("renders with camera when permission granted", async () => {
    require("expo-camera").Camera.requestCameraPermissionsAsync.mockResolvedValue(
      {
        status: "granted",
      },
    );

    const renderResult = render(<ScanScreen />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(renderResult.getByText("positionQRCode")).toBeTruthy();
  });

  test("maps scanned content to an app qr type before navigating", async () => {
    require("expo-camera").Camera.requestCameraPermissionsAsync.mockResolvedValue(
      {
        status: "granted",
      },
    );

    render(<ScanScreen />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const cameraProps = require("expo-camera").CameraView.mock.calls.at(-1)[0];

    await act(async () => {
      cameraProps.onBarcodeScanned({
        type: "qr",
        data: "https://example.com",
      });
    });

    expect(router.navigate).toHaveBeenCalledWith({
      pathname: "/add-edit",
      params: {
        content: "https://example.com",
        type: "url",
        origin: "scan",
      },
    });
  });

  test("matches snapshot with permission denied", async () => {
    require("expo-camera").Camera.requestCameraPermissionsAsync.mockResolvedValue(
      {
        status: "denied",
      },
    );

    const component = render(<ScanScreen />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
