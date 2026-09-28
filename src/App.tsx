import { useEffect, useMemo, useState } from 'react';
import { ChannelCard } from './components/ChannelCard';
import { CreatorPanel } from './components/CreatorPanel';
import { EventLog } from './components/EventLog';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { NotificationCard } from './components/NotificationCard';
import { NotificationList } from './components/NotificationList';
import { pubsub } from './core/PubSub';
import { channels } from './data/channels';
import { users } from './data/users';
import {
  addNotification,
  getEvents,
  getNotifications,
  getSessionId,
  getSubscriptions,
  markNotificationsRead,
  saveEvents,
  saveSession,
  saveSubscriptions,
} from './services/storage';
import type { BrokerEvent, Channel, Message, NotificationItem, Subscriber, User, PublicationType } from './types';

function createSubscriber(account: User, onReceived: (item: NotificationItem) => void): Subscriber {
  return {
    id: account.id,
    name: account.name,
    onMessage: (message) => {
      const [notification] = addNotification(account.id, message);
      onReceived(notification);
    },
  };
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const sessionId = getSessionId();
    return users.find((candidate) => candidate.id === sessionId) ?? null;
  });
  const [followed, setFollowed] = useState<string[]>(() => {
    const sessionId = getSessionId();
    return sessionId ? getSubscriptions()[sessionId] ?? [] : [];
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const sessionId = getSessionId();
    return sessionId ? getNotifications(sessionId) : [];
  });
  const [events, setEvents] = useState<BrokerEvent[]>(getEvents);
  const [loginError, setLoginError] = useState('');
  const [centerOpen, setCenterOpen] = useState(false);
  const [toast, setToast] = useState<NotificationItem | null>(null);
  const [brokerReady, setBrokerReady] = useState(false);

  useEffect(() => {
    const stopListening = pubsub.onEvent((event) => {
      setEvents((current) => {
        const next = [event, ...current].slice(0, 100);
        saveEvents(next);
        return next;
      });
    });

    const subscriptions = getSubscriptions();
    users.filter((account) => account.role === 'subscriber').forEach((account) => {
      const subscriber = createSubscriber(account, (notification) => {
        if (getSessionId() === account.id) {
          setNotifications((current) => [notification, ...current]);
          setToast(notification);
        }
      });
      (subscriptions[account.id] ?? []).forEach((topic) => {
        pubsub.subscribe(topic, subscriber, false);
      });
    });
    setBrokerReady(true);

    return stopListening;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  function handleLogin(email: string, password: string) {
    const account = users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password,
    );
    if (!account) {
      setLoginError('E-mail ou senha inválidos. Use uma das contas de demonstração.');
      return;
    }

    saveSession(account.id);
    setUser(account);
    setFollowed(getSubscriptions()[account.id] ?? []);
    const accountNotifications = getNotifications(account.id);
    setNotifications(accountNotifications);
    setToast(account.role === 'subscriber' ? accountNotifications.find((item) => !item.read) ?? null : null);
    setCenterOpen(false);
    setLoginError('');
  }

  function handleLogout() {
    saveSession(null);
    setUser(null);
    setFollowed([]);
    setNotifications([]);
    setToast(null);
    setCenterOpen(false);
  }

  function handleToggleFollow(channel: Channel) {
    if (!user || user.role !== 'subscriber') return;
    const subscriber = createSubscriber(user, (notification) => {
      if (getSessionId() === user.id) {
        setNotifications((current) => [notification, ...current]);
        setToast(notification);
      }
    });
    const subscriptions = getSubscriptions();
    const current = subscriptions[user.id] ?? [];

    if (pubsub.isSubscribed(channel.id, user.id)) {
      pubsub.unsubscribe(channel.id, subscriber);
      const next = current.filter((topic) => topic !== channel.id);
      saveSubscriptions({ ...subscriptions, [user.id]: next });
      setFollowed(next);
    } else {
      pubsub.subscribe(channel.id, subscriber);
      const next = [...current, channel.id];
      saveSubscriptions({ ...subscriptions, [user.id]: next });
      setFollowed(next);
    }
  }

  function handlePublish(channel: Channel, type: PublicationType, title: string) {
    const message: Message = {
      id: `${Date.now()}-${channel.id}`,
      topic: channel.id,
      channelName: channel.name,
      type,
      title,
      publishedAt: new Date(),
    };
    pubsub.publish(channel.id, message);
  }

  function toggleNotificationCenter() {
    const opening = !centerOpen;
    setCenterOpen(opening);
    if (opening && user) setNotifications(markNotificationsRead(user.id));
  }

  if (!user) return <LoginPage error={loginError} onLogin={handleLogin} />;

  const publisherChannel = user.channelId
    ? channels.find((channel) => channel.id === user.channelId)
    : undefined;

  return (
    <div className="app">
      <Header
        user={user}
        unreadCount={unreadCount}
        onLogout={handleLogout}
        onToggleNotifications={user.role === 'subscriber' ? toggleNotificationCenter : undefined}
      />

      {centerOpen && user.role === 'subscriber' && (
        <div className="notification-center">
          <NotificationList notifications={notifications} />
        </div>
      )}

      <main className="app__main">
        <div className="column">
          {user.role === 'subscriber' ? (
            <>
              <section className="panel">
                <div className="section-heading">
                  <div>
                    <p className="login-eyebrow">DESCUBRA E ACOMPANHE</p>
                    <h2 className="panel__title">Canais disponíveis</h2>
                  </div>
                  <span className="section-heading__count">{followed.length} seguindo</span>
                </div>
                <p className="panel__hint">
                  Seguir registra <code>pubsub.subscribe()</code>; deixar de seguir executa{' '}
                  <code>pubsub.unsubscribe()</code>.
                </p>
                <div className="channel-grid">
                  {channels.map((channel) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      isFollowing={followed.includes(channel.id)}
                      subscriberCount={brokerReady ? pubsub.countSubscribers(channel.id) : 0}
                      onToggleFollow={handleToggleFollow}
                    />
                  ))}
                </div>
              </section>
              <section className="panel followed-panel">
                <div className="section-heading">
                  <div>
                    <p className="login-eyebrow">SUAS INSCRIÇÕES</p>
                    <h2 className="panel__title">Você está seguindo</h2>
                  </div>
                </div>
                {followed.length ? (
                  <div className="followed-channels">
                    {channels.filter((channel) => followed.includes(channel.id)).map((channel) => (
                      <span key={channel.id} className="followed-chip">
                        <span>{channel.icon}</span> {channel.name}
                      </span>
                    ))}
                  </div>
                ) : <p className="empty">Siga um canal para receber suas publicações por aqui.</p>}
              </section>
            </>
          ) : publisherChannel ? (
            <CreatorPanel
              channel={publisherChannel}
              onPublish={handlePublish}
              subscriberCountOf={(topic) => pubsub.countSubscribers(topic)}
            />
          ) : (
            <section className="panel"><p className="empty">Canal deste criador não encontrado.</p></section>
          )}
        </div>

        <aside className="column column--side">
          <EventLog events={events} onClear={() => { setEvents([]); saveEvents([]); }} />
        </aside>
      </main>

      {toast && (
        <div className="toast-stack">
          <NotificationCard notification={toast} toast onDismiss={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
