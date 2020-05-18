# はじめに

テストコードは極力書きたくないのですが、どうやって書けば良いかも踏まえ、備忘録として整理してみました。

[Reactのテスト方針](https://qiita.com/naoking99/items/3fd211deb8711fae8204)

- 常に"what user should see"（ユーザーから見えるもの）という視点でテストを書く
- 細かく分割されがちな React Componentでは、Unitテストが Implementation Detailsになりがち
- 基本的にはIntegrationテストをメインで書くように

[idやclassを使ってテストを書くのは、もはやアンチパターンである](https://qiita.com/akameco/items/519f7e4d5442b2a9d2da)

- idやclassはスタイルのためのものなので、テストでそれを使うのはやめましょう
- カスタムデータ属性を使いましょう。
- idやclassはスタイルのためだけではないという意見はごもっともです！

# 初期構築

環境バージョン

```console
$ node -v
v14.2.0
```

```console
$ npm -v
6.14.4
```

## create-react-app

`testing-app1`と言うプロジェクトを作成します。

```console
$ npx create-react-app testing-app1 --template typescript
```

## テストライブラリの追加

```console
$ yarn add -D @testing-library/react @testing-library/jest-dom
```

## メインのソースを書く

公式サイトを参考にして、メインのソースコードを記述します。
後述するテストで使うので、divタグに```data-testid```を追記してください。

https://ja.reactjs.org/docs/hooks-overview.html

```typescript:App.tsx
import React, { useState } from "react";

function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <div data-testid="result">{count}</div>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default App;
```

## テストコードを書く

ここでは、初期値とボタンを押した時のカウントアップをテストします。
今回のテストでは、waitForとscreenを使っていないので、書かなくても大丈夫です。

```typescript:App.test.tsx
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
```

## テスト実行

コンソールからコマンドを実行してみます。

```console
$ npm run test

 PASS  src/App.test.tsx
  <App> Test
    ✓ 初期値は0である (32ms)
    ✓ ボタンを押すと１つカウントアップする (15ms)
    ✎ todo 初期状態は0である
    ✎ todo ボタンを押すと１つカウントアップする

Test Suites: 1 passed, 1 total
Tests:       2 todo, 2 passed, 4 total
Snapshots:   0 total
Time:        4.666s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```

テストが上手く行きましたね。


## プロダクションビルドではカスタムデータ属性を取り除く

`data-testid`が出力されるので、それを抑止する方法です。
あっても別に悪さはしないのだけど、トラフィックの観点でメリットがあるそうです。

```console
$ yarn add -D react-app-rewired
$ yarn add -D customize-cra
$ yarn add -D babel-plugin-react-remove-properties
```

- customize-cra には、babel および Webpack 構成のほぼすべての側面を構成するために使用できるさまざまなユーティリティ関数があります。

package.json を書き換える (抜粋)

```
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
```

を

```
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test"
```

に書き換えてください。

次に```config-overrides.js```ファイルを作成します。

```javascript:config-overrides.js
const { override, addBabelPlugins } = require("customize-cra");
module.exports = override(
  addBabelPlugins("babel-plugin-react-remove-properties")
);
```

# 参考記事

React テスト概要
https://ja.reactjs.org/docs/testing.html

Reactのテスト方針
https://qiita.com/naoking99/items/3fd211deb8711fae8204

フロントエンドでTDDを実践する（react-testing-libraryを使った実践編）
https://qiita.com/taneba/items/b21f5fee17eb593b30c8

idやclassを使ってテストを書くのは、もはやアンチパターンである
https://qiita.com/akameco/items/519f7e4d5442b2a9d2da

React Hooks Testing
https://kumaaaaa.com/react-testing/
