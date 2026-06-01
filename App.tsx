import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

// Exemplo simples de app que integra uma WebView com o plugin VLibras
// e faz uma chamada a uma API local para obter uma "glosa" (tradução
// em Libras) que é injetada na WebView para reprodução.

export default function App() {
  // Referência para o componente WebView — usada para injetar JS posteriormente
  const webViewRef = useRef<WebView>(null);

  // Estado simples para mostrar o status da tradução/execução
  const [status, setStatus] = useState('Aguardando Motor...');

  // URL da API que retorna a glosa/objetos JSON com a tradução em Libras.
  // Observação: em emuladores e dispositivos reais pode ser necessário
  // ajustar o endereço (ex.: usar o IP da máquina na rede local).
  const API_URL = 'http://127.0.0.1:3001/translate';

  // Texto de exemplo que será enviado à API para tradução. Substitua
  // por qualquer texto dinâmico vindo do backend ou de props no app.
  const textoNoticia = `O desenvolvimento de sistemas com acessibilidade integrada está mudando o cenário da tecnologia no Brasil. Uma nova arquitetura baseada em microsserviços permite que aplicações enviem textos de notícias e recebam traduções instantâneas. Com a utilização de mensageria e containers, os desenvolvedores conseguem criar pontes eficientes para a comunidade surda, garantindo que a informação chegue a todos de forma rápida e sem depender de servidores de terceiros.`;

  // HTML que roda dentro do WebView
  // - Este HTML carrega o plugin VLibras diretamente do CDN oficial.
  // - A função `window.receberGlosa` é chamada pela app nativa (via
  //   `injectJavaScript`) para pedir que o player do plugin reproduza
  //   a glosa recebida da API.
  const vlibrasHTML = `
    <!DOCTYPE html>
    <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0; background:#0d0d0d;">
        <div vw class="enabled">
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
        </div>
        <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
        <script>
          new window.VLibras.Widget('https://vlibras.gov.br/app');

          // Função exposta dentro da WebView que o app nativo invoca
          // passando a glosa (string). O código tenta reproduzir usando
          // o player do plugin VLibras e retorna true/false conforme ok.
          window.receberGlosa = (glosa) => {
            if (window.plugin && window.plugin.player) {
              window.plugin.player.play(glosa);
              return true;
            }
            return false;
          };
        </script>
      </body>
    </html>
  `;

  const traduzirNoticia = async () => {
    // 1) Sanitização básica do texto para evitar quebras/aspas
    let textoLimpo = textoNoticia.replace(/\s+/g, ' ').trim();
    textoLimpo = textoLimpo.replace(/\.+$/, '').trim();

    if (!textoLimpo) return;

    // 2) Atualiza o status da UI para feedback ao usuário
    setStatus('⏳ Traduzindo via API...');

    try {
      // 3) Chamada à API que retorna a "glosa" em texto puro ou JSON
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textoLimpo })
      });

      // 4) Lê a resposta — tenta decodificar JSON, caso contrário usa o texto bruto
      const respostaBruta = await response.text();
      let glosa = "";

      try {
        const dados = JSON.parse(respostaBruta);
        // Compatibilidade com vários formatos de resposta
        glosa = dados.glosa || dados.gloss || dados.text;
      } catch (e) {
        glosa = respostaBruta;
      }

      // 5) Limpa caracteres que podem quebrar a injeção de JS
      glosa = glosa.replace(/[\n\r"]/g, '').trim();

      if (glosa) {
        // 6) Informa e injeta na WebView: a função `window.receberGlosa`
        // definida no HTML será chamada para reproduzir a tradução.
        setStatus('✅ Executando no Ícaro...');
        const js = `window.receberGlosa("${glosa}");`;
        webViewRef.current?.injectJavaScript(js);
      }
    } catch (erro) {
      setStatus('❌ Erro na API.');
      console.error(erro);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Área do WebView que carrega o player VLibras. Mantemos
          uma altura fixa para demo; ajuste conforme necessário. */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: vlibrasHTML }}
          javaScriptEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          style={styles.webview}
        />
      </View>

      {/* Conteúdo da aplicação: título, texto de exemplo, botão e status */}
      <ScrollView style={styles.conteudo}>
        <Text style={styles.titulo}>Nova API Revoluciona Acessibilidade</Text>
        <Text style={styles.texto}>{textoNoticia}</Text>
        <TouchableOpacity style={styles.botao} onPress={traduzirNoticia}>
          <Text style={styles.textoBotao}>▶️ Ler Notícia em Libras</Text>
        </TouchableOpacity>
        <Text style={styles.status}>{status}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  webviewContainer: { height: 300 },
  webview: { backgroundColor: 'transparent' },
  conteudo: { padding: 20 },
  titulo: { color: '#00ff00', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  texto: { color: '#ccc', fontSize: 16, lineHeight: 24 },
  botao: { backgroundColor: '#00ff00', padding: 15, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  textoBotao: { fontWeight: 'bold' },
  status: { color: '#888', marginTop: 10, textAlign: 'center' }
});