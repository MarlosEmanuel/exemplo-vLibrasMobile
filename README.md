# 🤟 Demo VLibras — React Native (Mobile)

Guia didático de um app React Native que usa a WebView para exibir o avatar 3D do VLibras e conversar com a infraestrutura local de tradução. A ideia aqui é mostrar o fluxo completo, de ponta a ponta, sem depender de serviços externos.

## Visão geral da arquitetura

Para a tradução funcionar, você precisa subir três partes na sua máquina. O app sozinho não faz a tradução.

1. `vlibras-translator-text-core`: motor em Python/C++ que processa o texto e produz a glosa em Libras.
2. `vlibras-translator-api`: API em Node.js que recebe o texto do app, publica na fila e devolve a resposta.
3. `App React Native`: interface do usuário e camada que injeta a glosa na WebView do VLibras.

## Requisitos

- Node.js 16 ou superior
- Yarn ou npm
- Docker e Docker Compose
- Android Studio para Android ou Xcode para iOS

## Como executar

### 1. Suba o Text Core e a infraestrutura local

O Text Core depende de serviços auxiliares como MongoDB, Redis, Postgres e RabbitMQ.

```bash
git clone https://github.com/spbgovbr-vlibras/vlibras-translator-text-core.git
cd vlibras-translator-text-core
docker-compose up -d
```

Espere os containers subirem antes de continuar. O RabbitMQ precisa estar disponível para a API se conectar.

### 2. Suba a API Node.js

Em outro terminal:

```bash
git clone https://github.com/spbgovbr-vlibras/vlibras-translator-api.git
cd vlibras-translator-api
npm install
AMQP_HOST=127.0.0.1 AMQP_PORT=5673 AMQP_USER=vlibras AMQP_PASS=vlibras PORT=3001 npm run dev
```

Se tudo estiver certo, o terminal deve mostrar algo como `Listening on port 3001`.

### 3. Configure o app React Native

```bash
yarn install
cd ios && pod install && cd ..
```

O arquivo [App.tsx](App.tsx) usa atualmente a URL abaixo:

```ts
http://127.0.0.1:3001/translate
```

Se você estiver no Android emulador ou em um dispositivo físico, ajuste esse endereço no `App.tsx`:

- iOS emulador: `http://127.0.0.1:3001/translate`
- Android emulador: `http://10.0.2.2:3001/translate`
- Dispositivo físico: IP da sua máquina na rede local, por exemplo `http://192.168.0.15:3001/translate`

### 4. Rode a aplicação

```bash
npx react-native start
```

Em outro terminal:

```bash
npx react-native run-ios
# ou
npx react-native run-android
```

Abra o app, aguarde o avatar carregar e toque em **Ler Notícia em Libras**. O fluxo esperado é:

React Native -> API Node -> RabbitMQ -> Text Core -> glosa -> WebView

## Troubleshooting

- Tela preta no VLibras: confirme se `mediaPlaybackRequiresUserAction={false}` está setado na WebView.
- Erro `ValidationError: Path 'text' is required`: revise se o texto enviado não está vazio. O `App.tsx` já faz uma sanitização básica antes do `fetch`.
- API entrando em loop: limpe o Redis com `docker exec -it redis-vlibras redis-cli FLUSHALL` e reinicie a API.
- Porta 3000 em uso: use sempre o comando com `PORT=3001` mostrado acima.

## Observação importante

Este README foi escrito para estudantes entenderem o fluxo completo da arquitetura local do VLibras. Se você quiser, eu também posso adaptar o texto para um tom mais técnico, mais curto, ou mais acadêmico.
