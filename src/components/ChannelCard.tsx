import type { CSSProperties } from 'react';
import type { Channel } from '../types';

interface ChannelCardProps {
  channel: Channel;
  isFollowing: boolean;
  subscriberCount: number;
  onToggleFollow: (channel: Channel) => void;
}

export function ChannelCard({
  channel,
  isFollowing,
  subscriberCount,
  onToggleFollow,
}: ChannelCardProps) {
  return (
    <article className="channel-card" style={{ '--accent': channel.color } as CSSProperties}>
      <div className="channel-card__header">
        <span className="channel-card__avatar" aria-hidden="true">
          {channel.icon}
        </span>
        <div>
          <h3 className="channel-card__name">{channel.name}</h3>
          <p className="channel-card__category">{channel.category}</p>
        </div>
      </div>

      <p className="channel-card__topic">
        tópico: <code>{channel.id}</code>
      </p>

      <div className="channel-card__footer">
        <span className={`badge ${isFollowing ? 'badge--on' : ''}`}>
          {isFollowing ? 'Inscrito' : 'Não inscrito'} · {subscriberCount} assinante(s)
        </span>

        <button
          type="button"
          className={`follow-button ${isFollowing ? 'follow-button--following' : ''}`}
          onClick={() => onToggleFollow(channel)}
        >
          {isFollowing ? '✓ Seguindo' : '+ Seguir'}
        </button>
      </div>
    </article>
  );
}
