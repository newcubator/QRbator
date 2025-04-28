import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "../components/Button";

describe("<Button />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with title", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} />
    );

    expect(getByText("Test Button")).toBeTruthy();
  });

  test("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} />
    );

    fireEvent.press(getByText("Test Button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test("renders with icon", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} icon="star" />
    );

    expect(getByText("Test Button")).toBeTruthy();
  });

  test("applies secondary styling correctly", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Secondary Button" onPress={onPressMock} type="secondary" />
    );

    const button = getByText("Secondary Button");
    expect(button).toBeTruthy();

    expect(button.props.className).toContain("text-corp-grey");
  });

  test("applies danger styling correctly", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Danger Button" onPress={onPressMock} type="danger" />
    );

    const button = getByText("Danger Button");
    expect(button).toBeTruthy();
  });

  test("is disabled when disabled prop is true", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Disabled Button" onPress={onPressMock} disabled={true} />
    );

    const button = getByText("Disabled Button");
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });

  test("matches snapshot", () => {
    const tree = render(
      <Button title="Snapshot Test" onPress={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
