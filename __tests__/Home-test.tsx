import { render, waitFor } from "@testing-library/react-native";
import HomeScreen from "../app/home";

const mockInitDB = jest.fn().mockResolvedValue(undefined);
const mockGetAllQRCodes = jest.fn().mockResolvedValue([]);
const mockGetQRCodesByTag = jest.fn().mockResolvedValue([]);

jest.mock("~/core/qrCodeStorage", () => ({
  initDB: mockInitDB,
  getAllQRCodes: mockGetAllQRCodes,
  getQRCodesByTag: mockGetQRCodesByTag,
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  useFocusEffect: jest.fn((callback) => {
    callback();
    return undefined;
  }),
}));

describe("<HomeScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders QR code title text", async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(
      () => {
        expect(getByText("qrCodes")).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });
});
