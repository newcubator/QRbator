import { Alert } from "react-native";
import { render, waitFor } from "@testing-library/react-native";
import QRCodeDetailScreen from "@/app/details";
import { deleteQRCode, getQRCodeById } from "../core/qrCodeStorage";

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ id: '123' })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  useFocusEffect: jest.fn((cb) => cb()),
  Stack: {
    Screen: jest.fn().mockImplementation(() => null),
  },
}));

jest.mock('../core/qrCodeStorage', () => ({
  getQRCodeById: jest.fn(),
  deleteQRCode: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
      ...actualNav,
      useFocusEffect: jest.fn((cb) => {
        const React = require('react');
        React.useEffect(cb, []);
      }),
    };
  });

describe("<QRCodeDetailScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should show loading state", async () => {
    // simulate pending fetch
    (getQRCodeById as jest.Mock).mockReturnValue(new Promise(() => {}));

    const { getByText } = render(
        <QRCodeDetailScreen />
    );

    await waitFor(() => {
        expect(getByText("loading")).toBeTruthy();
      });
  });

  test("does not delete entries whose content is too large to render as a qr code", async () => {
    jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    (getQRCodeById as jest.Mock).mockResolvedValue({
      id: "123",
      name: "Large QR",
      content: "x".repeat(5000),
      type: "text",
      tags: [],
      createdAt: "2026-03-31T12:00:00.000Z",
    });

    const { getByText } = render(<QRCodeDetailScreen />);

    await waitFor(() => {
      expect(getByText("contentTooLarge")).toBeTruthy();
    });

    expect(deleteQRCode).not.toHaveBeenCalled();
  });
});
