import type { BrokerEvent } from '../types';
import { channels } from '../data/channels';

interface EventLogProps {
  events: BrokerEvent[];
  onClear: () => void;
}

export function EventLog({ events, onClear }: EventLogProps) {
  function displayTarget(event: BrokerEvent): string {
    if (event.action === 'SUBSCRIBE' || event.action === 'UNSUBSCRIBE') {
      return channels.find((channel) => channel.id === event.to)?.name ?? event.to;
    }
    return event.to;
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <h2 className="panel__title">📋 Atividade Pub/Sub</h2>
        <button type="button" className="ghost-button" onClick={onClear}>
          Limpar
        </button>
      </header>

      {events.length === 0 ? (
        <p className="empty">Nenhuma operação registrada pelo Broker ainda.</p>
      ) : (
        <ul className="event-log">
          {events.map((event) => (
            <li key={event.id} className={`event event--${event.action.toLowerCase()}`}>
              <time className="event__time">{event.timestamp.toLocaleTimeString('pt-BR')}</time>
              <span className="event__action">{event.action}</span>
              <span className="event__flow">
                {event.from} → {displayTarget(event)}
              </span>
              {event.detail && <span className="event__detail">{event.detail}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
