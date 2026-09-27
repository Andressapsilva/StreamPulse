import { publicationTypes } from '../data/channels';
import type { Message } from '../types';

interface NotificationListProps {
  notifications: Message[];
}

function typeInfo(type: Message['type']) {
  return publicationTypes.find((t) => t.value === type)!;
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <section className="panel">
      <h2 className="panel__title">🔔 Notificações</h2>

      {notifications.length === 0 ? (
        <p className="empty">
          Nenhuma notificação. Siga um canal e publique algo no Painel do Criador.
        </p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => {
            const info = typeInfo(notification.type);
            return (
              <li key={notification.id} className="notification">
                <strong className="notification__title">
                  {info.icon} {notification.channelName} — {info.label}
                </strong>
                <span className="notification__body">{notification.title}</span>
                <time className="notification__time">
                  {notification.publishedAt.toLocaleTimeString('pt-BR')}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
