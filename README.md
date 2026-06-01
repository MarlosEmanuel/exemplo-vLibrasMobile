# Demo VLibras — Mobile

Este projeto é um exemplo de aplicativo React Native que integra o plugin VLibras dentro de uma `WebView` e consome uma API local para obter uma "glosa" (tradução em Libras) que é injetada na WebView para reprodução.

**Arquivo principal**
 - [App.tsx](App.tsx#L1-L200) — implementa o fluxo, com comentários explicativos.

## Requisitos
 - Node.js (versão 16+ recomendada)
 - Yarn ou npm
 - React Native CLI
 - Android Studio (para Android) ou Xcode (para iOS)

## Passo a passo (rápido e bonitinho)

1) Instale dependências

```bash
yarn install
# ou
npm install
```

2) (iOS) Instale pods

```bash
cd ios && bundle install && bundle exec pod install && cd ..
```

3) Inicie a API local

 - O app espera uma rota POST em `/translate` que receba JSON: `{ "text": "..." }` e retorne uma glosa.
 - A resposta pode ser JSON `{ "glosa": "..." }` ou texto simples.

Exemplo rápido com curl:

```bash
curl -X POST http://127.0.0.1:3001/translate \
	-H "Content-Type: application/json" \
	-d '{"text":"Olá, isto é um teste"}'
```

4) Ajuste `API_URL` se necessário

 - Se estiver rodando o app num dispositivo físico, substitua `http://127.0.0.1:3001` pelo IP da sua máquina (ex.: `http://192.168.0.10:3001`).

5) Inicie o Metro bundler

```bash
npx react-native start
```

6) Rode o app

 - Android

```bash
npx react-native run-android
```

 - iOS

```bash
npx react-native run-ios
```

7) Teste

 - Abra o app, aguarde o carregamento da WebView (o plugin VLibras é carregado via CDN).
 - Toque em "Ler Notícia em Libras" para enviar o texto de exemplo à API.
 - Observe o status na tela e verifique se o player da WebView reproduz a glosa.

## Dicas de depuração
 - Verifique logs do Metro e do dispositivo para erros de rede ou JS.
 - Se o app não conseguir reproduzir a glosa, verifique a função `window.receberGlosa` definida dentro da WebView.
 - Ajuste `API_URL` para apontar corretamente ao backend a partir do emulador/dispositivo.

## Observações
 - Os comentários explicativos foram adicionados em `App.tsx` para facilitar a leitura do fluxo: sanitização do texto, chamada à API e injeção de JS na WebView.

Quer que eu também crie um servidor de exemplo em Node.js para a rota `/translate`? Posso gerar isso rapidamente.
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
