import { render } from "@testing-library/react-native";
import { Alert } from "react-native";
import SettingsScreen from "../app/settings";

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-file-system", () => ({
  cacheDirectory: "file://test-cache-dir/",
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  readAsStringAsync: jest.fn().mockResolvedValue("[]"),
}));

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({
    canceled: true,
    assets: [],
  }),
}));

jest.mock("~/core/qrCodeStorage", () => ({
  getAllQRCodes: jest.fn().mockResolvedValue([]),
  importQRCodes: jest.fn(),
  deleteAllQRCodes: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("<SettingsScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with export options", () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText("exportData")).toBeTruthy();
    expect(getByText("exportAllJson")).toBeTruthy();
    expect(getByText("exportAllCsv")).toBeTruthy();
  });

  test("matches snapshot", () => {
    const tree = render(<SettingsScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
