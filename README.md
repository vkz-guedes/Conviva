# Conviva — site de salas para ficar junto

Projeto web com interface responsiva, salas por nome/link, câmera, microfone, compartilhamento de tela, chat em tempo real e jogo da velha sincronizado.

## Rodar localmente

Requisitos: Node.js 20 ou mais recente.

1. Extraia o ZIP e abra a pasta `conviva` no VS Code.
2. No terminal, execute `npm install`.
3. Execute `npm run dev`.
4. Abra o endereço Vite mostrado no terminal (normalmente `http://localhost:5173`).
5. Abra o mesmo endereço em outra janela ou dispositivo e use o mesmo nome de sala.

O `vite.config.js` encaminha o Socket.IO ao servidor local na porta 3000 durante o desenvolvimento.

## Publicar para usar com outra pessoa pela internet

O projeto precisa ser hospedado como **Web Service Node** (não apenas GitHub Pages), porque usa Socket.IO e sinalização WebRTC. Você pode enviar esta pasta para um repositório GitHub e conectá-lo ao Render. Configure:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Runtime: Node

O servidor escuta a porta definida pela variável `PORT`, como esperado pelo Render.

## Limitações importantes

- É um MVP, não uma plataforma pronta para produção.
- WebRTC usa STUN público; algumas redes exigem TURN para conectar de forma confiável.
- O navegador precisa de HTTPS para câmera/microfone e compartilhamento de tela quando publicado.
- Salas são identificadas pelo nome e não têm autenticação: não use nomes previsíveis para conversas privadas.
- Não reproduz automaticamente serviços de streaming; para assistir juntos, compartilhe a tela.
- Para muitas pessoas por sala, use uma arquitetura SFU como LiveKit ou mediasoup.

## Tecnologias

React, Vite, Express, Socket.IO e WebRTC.
