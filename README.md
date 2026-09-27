# StreamPulse

Aplicação web acadêmica que demonstra o padrão arquitetural **Publish/Subscribe (Pub/Sub)**.

Disciplina: *Sistemas Computacionais Distribuídos e Computação em Nuvem*.

## Ideia

Plataforma fictícia de streaming onde:

| Conceito Pub/Sub | No StreamPulse |
| --- | --- |
| Publisher | Criador de conteúdo (Painel do Criador) |
| Subscriber | Usuário que segue canais |
| Tópico | Cada canal (`gamerpro`, `techworld`, `cineplay`) |
| Broker | `src/core/PubSub.ts` |

O Publisher **não conhece** os Subscribers: toda comunicação passa pelo Broker.

## Como executar

Requer [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

## Estrutura

```
src/
  core/PubSub.ts            # Broker: subscribe, unsubscribe, publish
  data/channels.ts          # Canais fictícios (tópicos)
  types/index.ts            # Tipos compartilhados
  components/
    ChannelCard.tsx         # Card de canal + botão Seguir/Seguindo
    NotificationList.tsx    # Notificações recebidas pelo Subscriber
    CreatorPanel.tsx        # Publisher: publica no tópico
    EventLog.tsx            # Atividade do Broker em tempo real
  App.tsx
  main.tsx
```

## Roteiro de apresentação

1. Abrir a aplicação na visão **Usuário**.
2. Seguir **GamerPro** → Broker registra `SUBSCRIBE`.
3. Ir para a visão **Criador**, selecionar GamerPro, tipo `🔴 Nova Live`, título "Ranked Valorant até Imortal!" e publicar.
4. Broker registra `PUBLISH` e `DELIVERED`.
5. Voltar à visão Usuário: a notificação apareceu.
6. Deixar de seguir GamerPro → `UNSUBSCRIBE`.
7. Publicar novamente → o Event Log mostra `PUBLISH` com 0 assinantes e **nenhum** `DELIVERED`; o usuário não recebe a notificação.

## Escopo

Sem backend, banco de dados, autenticação ou serviços externos. Toda a simulação roda no navegador.