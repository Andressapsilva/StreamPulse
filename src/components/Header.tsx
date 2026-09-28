import type { User } from '../types';

interface HeaderProps {
  user: User;
  unreadCount: number;
  onLogout: () => void;
  onToggleNotifications?: () => void;
}

export function Header({ user, unreadCount, onLogout, onToggleNotifications }: HeaderProps) {
  return (
    <header className="app__header">
      <div className="brand">
        <span className="brand__logo" aria-hidden="true">▶</span>
        <div>
          <h1 className="brand__name">StreamPulse</h1>
          <p className="brand__tagline">Demonstração do padrão Publish/Subscribe</p>
        </div>
      </div>
      <div className="account-bar">
        <div className="account-identity">
          <span className="account-identity__name">{user.name}</span>
          <span className="account-identity__role">
            {user.role === 'subscriber' ? 'Espectador' : 'Criador'}
          </span>
        </div>
        {user.role === 'subscriber' && onToggleNotifications && (
          <button
            type="button"
            className="notification-toggle"
            onClick={onToggleNotifications}
            aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ''}`}
            title="Notificações"
          >
            <span className="notification-toggle__bell" aria-hidden="true">🔔</span>
            {unreadCount > 0 && <span className="notification-toggle__count">{unreadCount}</span>}
          </button>
        )}
        <button type="button" className="logout-button" onClick={onLogout}>
          Sair <span aria-hidden="true">↗</span>
        </button>
      </div>
    </header>
  );
}
