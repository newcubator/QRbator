import { render } from "@testing-library/react-native";
import Index from "../app/index";

describe("<Index />", () => {
  test("renders without crashing", () => {
    expect(render(<Index />)).toBeTruthy();
  });
});
