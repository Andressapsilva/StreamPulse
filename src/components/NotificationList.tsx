import type { NotificationItem } from '../types';
import { NotificationCard } from './NotificationCard';

interface NotificationListProps {
  notifications: NotificationItem[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <section className="notification-center-panel">
      <header className="notification-center-panel__header">
        <div>
          <p className="login-eyebrow">CAIXA DE ENTRADA</p>
          <h2 className="panel__title">Notificações</h2>
        </div>
        <span className="notification-center-panel__total">{notifications.length}</span>
      </header>

      {notifications.length === 0 ? (
        <p className="empty">Nenhuma notificação recebida dos canais que você segue.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => {
            return (
              <NotificationCard key={notification.id} notification={notification} />
            );
          })}
        </div>
      )}
    </section>
  );
}
