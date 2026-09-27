import type { Channel, PublicationType } from '../types';

/** Cada canal é um tópico do Broker Pub/Sub. */
export const channels: Channel[] = [
  {
    id: 'gamerpro',
    name: 'GamerPro',
    category: 'Games',
    icon: '🎮',
    color: '#7c5cff',
  },
  {
    id: 'techworld',
    name: 'TechWorld',
    category: 'Tecnologia',
    icon: '💻',
    color: '#21b6c9',
  },
  {
    id: 'cineplay',
    name: 'CinePlay',
    category: 'Filmes e Séries',
    icon: '🎬',
    color: '#e0587b',
  },
];

export const publicationTypes: Array<{
  value: PublicationType;
  label: string;
  icon: string;
}> = [
  { value: 'live', label: 'Nova Live', icon: '🔴' },
  { value: 'video', label: 'Novo Vídeo', icon: '🎥' },
  { value: 'announcement', label: 'Comunicado', icon: '📢' },
];
