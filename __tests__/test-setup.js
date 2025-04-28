// This file sets up any global mocks or configurations needed for Jest tests

// Mock NativeWind/tailwind styles
jest.mock("nativewind", () => ({
  styled: (component) => component,
}));

// Mock the expo-router module instead of jester
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    dismiss: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    dismiss: jest.fn(),
  },
  useFocusEffect: jest.fn((callback) => callback()),
  Stack: {
    Screen: jest.fn().mockImplementation(() => null),
  },
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (params) {
        return `${key} ${JSON.stringify(params)}`;
      }
      return key;
    },
  }),
}));

// Mock expo-font and Font.isLoaded
jest.mock("expo-font", () => ({
  ...jest.requireActual("expo-font"),
  loadAsync: jest.fn().mockResolvedValue(true),
  isLoaded: jest.fn().mockReturnValue(true),
  Font: {
    isLoaded: jest.fn().mockReturnValue(true),
  },
}));

// Mock @expo/vector-icons and all icon sets
jest.mock("@expo/vector-icons", () => {
  const iconMock = () => "Icon";
  return {
    Ionicons: iconMock,
    AntDesign: iconMock,
    Feather: iconMock,
    MaterialIcons: iconMock,
    MaterialCommunityIcons: iconMock,
    FontAwesome: iconMock,
    FontAwesome5: iconMock,
    createIconSet: () => iconMock,
  };
});

// Mock reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  // Extending the mock with additional functionalities used in the app
  Reanimated.FadeIn = {
    duration: () => ({
      delay: () => ({
        reduceMotion: () => ({}),
      }),
      reduceMotion: () => ({}),
    }),
  };
  Reanimated.FadeOut = {
    duration: () => ({
      reduceMotion: () => ({}),
    }),
  };
  Reanimated.FadeInDown = {
    duration: () => ({
      delay: () => ({
        reduceMotion: () => ({}),
      }),
    }),
  };
  Reanimated.Layout = {
    springify: () => ({
      reduceMotion: () => ({}),
    }),
  };
  Reanimated.ReduceMotion = {
    Never: "never",
  };
  Reanimated.createAnimatedComponent = (component) => component;
  return Reanimated;
});

// Mock safe area context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, left: 0, bottom: 0 }),
}));

// Mock async storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Using module name mapper in package.json is a better approach for path aliases
// than trying to mock them directly in the setup file.

// Add more mocks as needed
