# Cyber Cyclone

Jogo web integrado ao conector universal do Projeto Daniel.

## Arquitetura ativa

- `src/main.js`: composição do runtime e comandos públicos.
- `src/game/rules.js`: fonte única de regras, tamanhos, gravidade, multiplicadores e parâmetros físicos.
- `src/game/physics.js`: geometria Matter.js, pinos, divisórias, sensor e timestep fixo.
- `src/game/pin-deflector.js`: resposta determinística de colisão bola × pino; não teleporta nem pontua.
- `src/game/ball-telemetry.js`: trilha de spawn, colisões, deflexões, slot e remoção.
- `src/game/ball-watchdog.js`: somente diagnóstico de stall e remoção fora do mapa; não altera trajetória.
- `src/game/renderer.js`: desenho do canvas, separado da mecânica.
- `src/game/commands.js`: tradução de likes, comentários e presentes em ações do jogo.
- `src/game/runtime.js`: orquestra estado, pontuação, boss e módulos.
- `src/ui/viewport.js`: viewport mobile.
- `config.js`, `live-actions.js`, `panel-bridge.js`, `lifecycle.js`: integração ativa com o painel universal.
- `tests/`: QA funcional, visual e partidas automatizadas em iPhone/WebKit, Android e tablet.

## Invariantes da física

Pinos são defletores: contato deve separar a bola imediatamente. O watchdog não pode empurrar, reposicionar ou pontuar bolas. Pontos só são concedidos após colisão física com `floorSensor`. Os multiplicadores são `2x / 5x / 15x / 5x / 2x`.

<!-- deployment trigger: latest validated layout -->
