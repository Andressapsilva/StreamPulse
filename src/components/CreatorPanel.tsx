import { useState, type FormEvent } from 'react';
import { publicationTypes } from '../data/channels';
import type { Channel, PublicationType } from '../types';

interface CreatorPanelProps {
  channel: Channel;
  onPublish: (channel: Channel, type: PublicationType, title: string) => void;
  subscriberCountOf: (topic: string) => number;
}

export function CreatorPanel({ channel, onPublish, subscriberCountOf }: CreatorPanelProps) {
  const [type, setType] = useState<PublicationType>('live');
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState('');

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
      <h2 className="panel__title">📡 Painel do Criador · {channel.name}</h2>
      <p className="panel__hint">
        Seu canal é o tópico <code>{channel.id}</code>. O Broker distribui as publicações aos inscritos.
      </p>

      <form className="creator-form" onSubmit={handleSubmit}>
        <div className="creator-channel">
          <span className="creator-channel__icon">{channel.icon}</span>
          <span>{channel.name}</span>
          <span className="creator-channel__category">{channel.category}</span>
          <span className="badge">{subscriberCountOf(channel.id)} assinante(s)</span>
        </div>

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
