jest.mock("nativewind", () => ({
  styled: (component) => component,
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    dismiss: jest.fn(),
    navigate: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    dismiss: jest.fn(),
    navigate: jest.fn(),
  },
  useFocusEffect: jest.fn((callback) => callback()),
  Stack: {
    Screen: jest.fn().mockImplementation(() => null),
  },
  Link: jest.fn().mockImplementation(({ children }) => children),
}));

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

jest.mock("expo-font", () => ({
  ...jest.requireActual("expo-font"),
  loadAsync: jest.fn().mockResolvedValue(true),
  isLoaded: jest.fn().mockReturnValue(true),
  Font: {
    isLoaded: jest.fn().mockReturnValue(true),
  },
}));

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

jest.mock("react-native-worklets", () =>
  require("react-native-worklets/lib/module/mock"),
);

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
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

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, left: 0, bottom: 0 }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));
