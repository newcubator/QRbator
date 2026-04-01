import { Alert } from "react-native";
import { act, fireEvent, render } from "@testing-library/react-native";
import AddEditQRCodeScreen from "../app/add-edit";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    dismiss: jest.fn(),
  },
  Stack: {
    Screen: jest.fn().mockImplementation(() => null),
  },
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock("~/core/qrCodeStorage", () => ({
  addQRCode: jest.fn(),
  getQRCodeById: jest.fn(),
  updateQRCode: jest.fn(),
}));

jest.mock("~/core/storeReview", () => ({
  checkAndRequestStoreReview: jest.fn(),
}));

describe("<AddEditQRCodeScreen />", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test("keeps typed text when switching from text to url type", () => {
    const typedUrl = "https://ncub.de/joerg-herbst-30min";
    const { getByPlaceholderText, getByText, getByDisplayValue } = render(
      <AddEditQRCodeScreen />,
    );

    fireEvent.changeText(
      getByPlaceholderText("enterQrContentPlaceholder"),
      typedUrl,
    );

    fireEvent.press(getByText("URL"));

    expect(getByDisplayValue(typedUrl)).toBeTruthy();
  });

  test("keeps text and url inputs in sync in both directions", () => {
    const initialUrl = "https://ncub.de/joerg-herbst-30min";
    const updatedUrl = "";
    const { getByPlaceholderText, getByText } = render(<AddEditQRCodeScreen />);

    fireEvent.changeText(
      getByPlaceholderText("enterQrContentPlaceholder"),
      initialUrl,
    );
    fireEvent.press(getByText("URL"));

    fireEvent.changeText(getByPlaceholderText("https://example.com"), updatedUrl);
    fireEvent.press(getByText("TEXT"));

    expect(
      getByPlaceholderText("enterQrContentPlaceholder").props.value,
    ).toBe(updatedUrl);
  });

  test("warns before switching to an incompatible empty type", () => {
    const typedText = "https://ncub.de/joerg-herbst-30min";
    const { getByPlaceholderText, getByText, queryByPlaceholderText } = render(
      <AddEditQRCodeScreen />,
    );

    fireEvent.changeText(
      getByPlaceholderText("enterQrContentPlaceholder"),
      typedText,
    );

    fireEvent.press(getByText("VCARD"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "switchQrTypeTitle",
      expect.stringContaining("switchQrTypeMessage"),
      expect.any(Array),
    );
    expect(queryByPlaceholderText("firstName")).toBeNull();
  });

  test("switches after confirming the incompatible type change", () => {
    const typedText = "https://ncub.de/joerg-herbst-30min";
    const { getByPlaceholderText, getByText } = render(<AddEditQRCodeScreen />);

    fireEvent.changeText(
      getByPlaceholderText("enterQrContentPlaceholder"),
      typedText,
    );

    fireEvent.press(getByText("VCARD"));

    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];

    act(() => {
      buttons[1].onPress();
    });

    expect(getByPlaceholderText("firstName")).toBeTruthy();
  });
});
