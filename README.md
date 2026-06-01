# 🤟 Demo VLibras — React Native (Mobile)

Este projeto é um exemplo prático e "hardcode" de um aplicativo React Native que integra o avatar 3D do VLibras usando uma `WebView`. Ele consome a infraestrutura oficial do governo rodando localmente na sua máquina para traduzir textos (notícias, parágrafos, etc.) para **Glosas de Libras** e injeta o resultado diretamente no motor 3D do aplicativo.

## 🏗️ Entendendo a Arquitetura (Para Estudantes)

Para que a tradução funcione de ponta a ponta sem depender de servidores externos, você precisa rodar **três peças fundamentais** na sua máquina. Não basta rodar só o App!

1. **`vlibras-translator-text-core` (O Cérebro):** É o motor em Python/C++ que faz o processamento de linguagem natural (PLN). Ele escuta filas de mensagens (RabbitMQ) e transforma Português em Glosa de Libras.
2. **`vlibras-translator-api` (A Ponte):** Uma API em Node.js. O nosso App React Native faz um `POST` para cá. Esta API pega o texto, joga na fila do RabbitMQ para o *Core* traduzir, pega a resposta e devolve pro App.
3. **`App React Native` (O Frontend):** A interface onde o usuário interage e onde o motor 3D (Ícaro) é renderizado.

## 🛠️ Requisitos Préximos
- **Node.js** (versão 16+ recomendada)
- **Yarn** ou **npm**
- **Docker e Docker Compose** (Obrigatório para rodar os bancos e mensageria do backend)
- **Android Studio** (para Android) ou **Xcode** (para iOS / Mac)

---

## 🚀 Passo a Passo da Configuração

### Passo 1: Subindo a Infraestrutura (Text Core e Bancos)
Primeiro, precisamos ligar o motor de tradução e os bancos de dados (MongoDB, Redis, Postgres e RabbitMQ).

1. Clone o repositório do Text Core:
	`git clone https://github.com/spbgovbr-vlibras/vlibras-translator-text-core.git`
	`cd vlibras-translator-text-core`
2. Suba a infraestrutura via Docker:
	`docker-compose up -d`
	*(Aguarde os containers subirem. O RabbitMQ ficará disponível para a API se conectar).*

### Passo 2: Ligando a API (Node.js)
Agora, vamos ligar o servidor que vai receber as requisições do nosso aplicativo.

1. Em outro terminal, clone a API:
	`git clone https://github.com/spbgovbr-vlibras/vlibras-translator-api.git`
	`cd vlibras-translator-api`
	`npm install`
2. **Atenção às Variáveis de Ambiente!** Para evitar conflitos de portas (como a porta 3000 que costuma ser muito usada) e conectar corretamente ao RabbitMQ do Docker, rode o servidor passando estas credenciais exatas:
	`AMQP_HOST=127.0.0.1 AMQP_PORT=5673 AMQP_USER=vlibras AMQP_PASS=vlibras PORT=3001 npm run dev`
	*Se tudo der certo, você verá o log `Listening on port 3001`.*

### Passo 3: Configurando o App React Native
Com o backend inteiro rodando, vamos para o aplicativo.

1. Instale as dependências:
	`yarn install`
2. Instale os Pods do iOS:
	`cd ios && pod install && cd ..`
3. Verifique o arquivo `App.tsx` e certifique-se de que a `API_URL` está apontando para o lugar certo:
	- **Emulador iOS:** `http://127.0.0.1:3001/translate`
	- **Emulador Android:** `http://10.0.2.2:3001/translate`
	- **Dispositivo Físico:** IP da sua rede WiFi (ex: `http://192.168.0.15:3001/translate`)

### Passo 4: Rodando a Aplicação!
Inicie o Metro Bundler:
`npx react-native start`

Em um novo terminal, abra o emulador:
`npx react-native run-ios` ou `npx react-native run-android`

Abra o app, aguarde o Ícaro carregar no fundo escuro e toque em **"Ler Notícia em Libras"**. O texto fará a viagem do React Native -> API Node -> RabbitMQ -> Text Core Python -> e voltará como glosa para o Avatar sinalizar!

---

## 🐛 Dicas de Depuração e Erros Comuns (Troubleshooting)

Estudante, se quebrar, não se desespere. Aqui estão os erros mais comuns desta arquitetura e como resolvê-los:

* **O App não renderiza o Ícaro (Tela preta):** Verifique se o atributo `mediaPlaybackRequiresUserAction={false}` está configurado na sua `WebView`. Celulares bloqueiam mídias de iniciarem sozinhas sem essa flag.
* **Erro `ValidationError: Path 'text' is required` na API:** O MongoDB recusa salvar textos vazios. Se o seu HTML ou React Native enviar espaços em branco ou parágrafos terminando com um ponto final perdido, o banco crasha. **Solução:** O código no `App.tsx` já possui uma "sanitarização" que usa Regex para limpar a string antes de dar o `fetch`.
* **API crashando em loop assim que liga (Poison Message):** Se uma requisição ruim quebrou a API, a mensagem fica presa no cache do **Redis**. Para destravar a API, limpe o cache rodando: `docker exec -it redis-vlibras redis-cli FLUSHALL` e reinicie a API.
* **Porta em uso:** Se rodar apenas `npm run dev`, a API tentará usar a porta `3000`. Utilize sempre o comando completo do *Passo 2* para forçar a porta `3001`.
