import { publicationTypes } from '../data/channels';
import type { NotificationItem } from '../types';

interface NotificationCardProps {
  notification: NotificationItem;
  toast?: boolean;
  onDismiss?: () => void;
}

function relativeTime(date: Date): string {
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  return `${Math.floor(hours / 24)} d`;
}

function notificationTitle(notification: NotificationItem): string {
  switch (notification.type) {
    case 'live':
      return `${notification.channelName} iniciou uma live!`;
    case 'video':
      return `${notification.channelName} publicou um novo vídeo!`;
    case 'announcement':
      return `Novo comunicado de ${notification.channelName}`;
  }
}

export function NotificationCard({ notification, toast = false, onDismiss }: NotificationCardProps) {
  const publication = publicationTypes.find((item) => item.value === notification.type)!;

  return (
    <article
      className={`notification-card ${notification.read ? '' : 'notification-card--unread'} ${toast ? 'notification-card--toast' : ''}`}
      aria-live={toast ? 'polite' : undefined}
    >
      <div className="notification-card__top">
        <span className="notification-card__icon" aria-hidden="true">{publication.icon}</span>
        <strong>{notificationTitle(notification)}</strong>
        {onDismiss && (
          <button type="button" className="notification-card__dismiss" onClick={onDismiss} aria-label="Dispensar notificação">
            ×
          </button>
        )}
      </div>
      <p>{notification.title}</p>
      <time dateTime={notification.publishedAt.toISOString()}>{relativeTime(notification.publishedAt)}</time>
    </article>
  );
}
