import { render, waitFor } from "@testing-library/react-native";
import QRCodeDetailScreen from "@/app/details";
import { getQRCodeById } from "../core/qrCodeStorage";

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ id: '123' })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  useFocusEffect: jest.fn((cb) => cb()),
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
});
