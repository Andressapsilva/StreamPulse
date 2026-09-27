/** Identificador de um tópico — no StreamPulse, cada canal é um tópico. */
export type Topic = string;

/** Categorias dos canais fictícios. */
export interface Channel {
  id: Topic;
  name: string;
  category: string;
  icon: string;
  color: string;
}

/** Tipos de publicação que um criador (Publisher) pode enviar. */
export type PublicationType = 'live' | 'video' | 'announcement';

/** Mensagem entregue pelo Broker aos Subscribers de um tópico. */
export interface Message {
  id: string;
  topic: Topic;
  channelName: string;
  type: PublicationType;
  title: string;
  publishedAt: Date;
}

/** Quem recebe as mensagens. O Publisher nunca conhece este objeto. */
export interface Subscriber {
  id: string;
  name: string;
  onMessage: (message: Message) => void;
}

/** Operações registradas pelo Broker para exibição no Event Log. */
export type EventAction = 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'PUBLISH' | 'DELIVERED';

export interface BrokerEvent {
  id: string;
  action: EventAction;
  from: string;
  to: string;
  detail?: string;
  timestamp: Date;
}
