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

## Contas locais de demonstração

Todas as contas usam a senha `123456`:

| Perfil | E-mail |
| --- | --- |
| Espectadora Ana | `ana@streampulse.com` |
| Criador GamerPro | `gamerpro@streampulse.com` |
| Criador TechWorld | `techworld@streampulse.com` |
| Criador CinePlay | `cineplay@streampulse.com` |

A autenticação é uma simulação local, sem backend. Sessão, inscrições, notificações e Event Log usam `localStorage`.

## Estrutura

```
src/
  core/PubSub.ts            # Broker: subscribe, unsubscribe, publish
  data/channels.ts          # Canais fictícios (tópicos)
  data/users.ts             # Contas fictícias locais
  services/storage.ts       # Persistência da simulação no navegador
  types/index.ts            # Tipos compartilhados
  components/
    ChannelCard.tsx         # Card de canal + botão Seguir/Seguindo
    LoginPage.tsx           # Acesso local por perfil
    Header.tsx              # Identidade da sessão e sino
    NotificationCard.tsx    # Toast e item persistente
    NotificationList.tsx    # Central de notificações
    CreatorPanel.tsx        # Publisher: publica no próprio tópico
    EventLog.tsx            # Atividade do Broker em tempo real
  App.tsx
  main.tsx
```


## Escopo

Sem backend, banco de dados ou serviços externos. O `localStorage` persiste a demonstração, mas a distribuição continua sendo decidida pelo Broker `PubSub.publish()` com base nas inscrições ativas em cada tópico.
