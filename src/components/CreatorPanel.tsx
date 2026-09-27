import { useState, type FormEvent } from 'react';
import { channels, publicationTypes } from '../data/channels';
import type { Channel, PublicationType } from '../types';

interface CreatorPanelProps {
  onPublish: (channel: Channel, type: PublicationType, title: string) => void;
  subscriberCountOf: (topic: string) => number;
}

export function CreatorPanel({ onPublish, subscriberCountOf }: CreatorPanelProps) {
  const [channelId, setChannelId] = useState(channels[0].id);
  const [type, setType] = useState<PublicationType>('live');
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState('');

  const channel = channels.find((c) => c.id === channelId)!;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onPublish(channel, type, trimmed);
    setTitle('');
    setFeedback(
      `📡 Publicado em "${channel.name}" para ${subscriberCountOf(channel.id)} assinante(s).`,
    );
    window.setTimeout(() => setFeedback(''), 3000);
  }

  return (
    <section className="panel">
      <h2 className="panel__title">📡 Painel do Criador</h2>
      <p className="panel__hint">
        O criador publica no tópico e não sabe quem são os assinantes. Quem entrega é o Broker.
      </p>

      <form className="creator-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Canal (tópico)</span>
          <select value={channelId} onChange={(e) => setChannelId(e.target.value)}>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name} — {c.category}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="field">
          <legend>Tipo de publicação</legend>
          <div className="type-options">
            {publicationTypes.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`type-option ${type === option.value ? 'type-option--active' : ''}`}
                onClick={() => setType(option.value)}
              >
                {option.icon} {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>Título</span>
          <input
            type="text"
            value={title}
            placeholder="Ex.: Ranked Valorant até Imortal!"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <button type="submit" className="publish-button" disabled={!title.trim()}>
          📡 Publicar
        </button>

        {feedback && <p className="feedback">{feedback}</p>}
      </form>
    </section>
  );
}
