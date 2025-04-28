import { render } from "@testing-library/react-native";
import HomeScreen from "../app/home";

jest.mock("~/core/qrCodeStorage", () => ({
  initDB: jest.fn().mockResolvedValue(undefined),
  getAllQRCodes: jest.fn().mockResolvedValue([]),
  getQRCodesByTag: jest.fn().mockResolvedValue([]),
}));

describe("<HomeScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    expect(() => render(<HomeScreen />)).not.toThrow();
  });

  test("renders and matches snapshot", () => {
    const tree = render(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
