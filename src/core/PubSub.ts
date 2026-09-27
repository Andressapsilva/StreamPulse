import type {
  BrokerEvent,
  EventAction,
  Message,
  Subscriber,
  Topic,
} from '../types';

/**
 * Broker Publish/Subscribe.
 *
 * O Publisher chama `publish(topico, mensagem)` e nunca conhece os Subscribers.
 * O Subscriber chama `subscribe(topico, assinante)` e nunca conhece os Publishers.
 * Todo o acoplamento fica aqui dentro: o Broker é o único que mantém o
 * registro de quem está inscrito em cada tópico.
 */
export class PubSub {
  /** topico -> lista de assinantes inscritos naquele topico */
  private topics = new Map<Topic, Subscriber[]>();

  /** Observadores do Event Log (usados apenas para visualização na UI). */
  private eventListeners: Array<(event: BrokerEvent) => void> = [];

  /** Registra um Subscriber em um tópico. */
  subscribe(topic: Topic, subscriber: Subscriber): void {
    const subscribers = this.topics.get(topic) ?? [];

    if (subscribers.some((s) => s.id === subscriber.id)) {
      return; // já inscrito: evita entregas duplicadas
    }

    this.topics.set(topic, [...subscribers, subscriber]);
    this.emitEvent('SUBSCRIBE', subscriber.name, topic, 'Inscrição registrada');
  }

  /** Remove um Subscriber de um tópico. */
  unsubscribe(topic: Topic, subscriber: Subscriber): void {
    const subscribers = this.topics.get(topic);
    if (!subscribers) return;

    this.topics.set(
      topic,
      subscribers.filter((s) => s.id !== subscriber.id),
    );
    this.emitEvent('UNSUBSCRIBE', subscriber.name, topic, 'Inscrição removida');
  }

  /**
   * Publica uma mensagem em um tópico.
   * A mensagem é entregue SOMENTE aos assinantes inscritos neste momento.
   */
  publish(topic: Topic, message: Message): void {
    const subscribers = this.topics.get(topic) ?? [];
    this.emitEvent('PUBLISH', topic, `${subscribers.length} assinante(s)`, message.title);

    subscribers.forEach((subscriber) => {
      subscriber.onMessage(message);
      this.emitEvent('DELIVERED', topic, subscriber.name, message.title);
    });
  }

  /** Indica se um assinante está inscrito em um tópico. */
  isSubscribed(topic: Topic, subscriberId: string): boolean {
    return (this.topics.get(topic) ?? []).some((s) => s.id === subscriberId);
  }

  /** Quantidade de assinantes de um tópico. */
  countSubscribers(topic: Topic): number {
    return (this.topics.get(topic) ?? []).length;
  }

  /** Permite que a UI acompanhe as operações do Broker (Event Log). */
  onEvent(listener: (event: BrokerEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter((l) => l !== listener);
    };
  }

  private emitEvent(action: EventAction, from: string, to: string, detail?: string): void {
    const event: BrokerEvent = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      action,
      from,
      to,
      detail,
      timestamp: new Date(),
    };
    this.eventListeners.forEach((listener) => listener(event));
  }
}

/** Instância única do Broker usada por toda a aplicação. */
export const pubsub = new PubSub();
