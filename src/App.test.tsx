import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
import App from "./App";

// TODOを書ける (テストケースを書き出す)
describe("<App> Test", () => {
  it.todo("初期状態は0である");
  it.todo("ボタンを押すと１つカウントアップする");
});

// テスト実行後にDOMをunmount, cleanupします
afterEach(cleanup);

describe("<App> Test", () => {
  it("初期値は0である", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("result")).toHaveTextContent("0");
  });

  it("ボタンを押すと１つカウントアップする", () => {
    const { getByTestId, getByText } = render(<App />);
    fireEvent.click(getByText("Click me"));
    expect(getByTestId("result")).toHaveTextContent("1");
  });
});
