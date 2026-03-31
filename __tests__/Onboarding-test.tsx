import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import OnboardingScreen from "../app/onboarding";

const mockDismissTo = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    dismissTo: mockDismissTo,
  }),
  Stack: {
    Screen: jest.fn().mockImplementation(() => null),
  },
}));

describe("<OnboardingScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("finishing onboarding dismisses back to home", async () => {
    const { getByText } = render(<OnboardingScreen />);

    fireEvent.press(getByText("skip"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "onboardingComplete",
        "true",
      );
      expect(mockDismissTo).toHaveBeenCalledWith("/home");
    });
  });
});
