import { useEffect, useMemo, useState } from 'react';
import { ChannelCard } from './components/ChannelCard';
import { CreatorPanel } from './components/CreatorPanel';
import { EventLog } from './components/EventLog';
import { NotificationList } from './components/NotificationList';
import { pubsub } from './core/PubSub';
import { channels } from './data/channels';
import type { BrokerEvent, Channel, Message, PublicationType, Subscriber } from './types';

type View = 'user' | 'creator';

export default function App() {
  const [view, setView] = useState<View>('user');
  const [followed, setFollowed] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [events, setEvents] = useState<BrokerEvent[]>([]);

  /** O usuário da demonstração é o nosso Subscriber. */
  const user = useMemo<Subscriber>(
    () => ({
      id: 'user-demo',
      name: 'Usuário',
      onMessage: (message) => setNotifications((prev) => [message, ...prev]),
    }),
    [],
  );

  useEffect(() => pubsub.onEvent((event) => setEvents((prev) => [event, ...prev])), []);

  function handleToggleFollow(channel: Channel) {
    if (pubsub.isSubscribed(channel.id, user.id)) {
      pubsub.unsubscribe(channel.id, user);
      setFollowed((prev) => prev.filter((id) => id !== channel.id));
    } else {
      pubsub.subscribe(channel.id, user);
      setFollowed((prev) => [...prev, channel.id]);
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

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <span className="brand__logo">📡</span>
          <div>
            <h1 className="brand__name">StreamPulse</h1>
            <p className="brand__tagline">Demonstração do padrão Publish/Subscribe</p>
          </div>
        </div>

        <nav className="tabs">
          <button
            type="button"
            className={`tab ${view === 'user' ? 'tab--active' : ''}`}
            onClick={() => setView('user')}
          >
            👤 Usuário
          </button>
          <button
            type="button"
            className={`tab ${view === 'creator' ? 'tab--active' : ''}`}
            onClick={() => setView('creator')}
          >
            🎙️ Criador
          </button>
        </nav>
      </header>

      <main className="app__main">
        <div className="column">
          {view === 'user' ? (
            <>
              <section className="panel">
                <h2 className="panel__title">📺 Canais disponíveis</h2>
                <p className="panel__hint">
                  Seguir um canal executa <code>pubsub.subscribe()</code>; deixar de seguir executa{' '}
                  <code>pubsub.unsubscribe()</code>.
                </p>
                <div className="channel-grid">
                  {channels.map((channel) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      isFollowing={followed.includes(channel.id)}
                      subscriberCount={pubsub.countSubscribers(channel.id)}
                      onToggleFollow={handleToggleFollow}
                    />
                  ))}
                </div>
              </section>

              <NotificationList notifications={notifications} />
            </>
          ) : (
            <CreatorPanel
              onPublish={handlePublish}
              subscriberCountOf={(topic) => pubsub.countSubscribers(topic)}
            />
          )}
        </div>

        <aside className="column column--side">
          <EventLog events={events} onClear={() => setEvents([])} />
        </aside>
      </main>
    </div>
  );
}
