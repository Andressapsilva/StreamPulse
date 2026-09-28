import type { User } from '../types';

/** Credenciais fictícias, exclusivas para a demonstração local. */
export const users: User[] = [
  {
    id: 'ana',
    name: 'Ana',
    email: 'ana@streampulse.com',
    password: '123456',
    role: 'subscriber',
  },
  {
    id: 'gamerpro-user',
    name: 'GamerPro',
    email: 'gamerpro@streampulse.com',
    password: '123456',
    role: 'publisher',
    channelId: 'gamerpro',
  },
  {
    id: 'techworld-user',
    name: 'TechWorld',
    email: 'techworld@streampulse.com',
    password: '123456',
    role: 'publisher',
    channelId: 'techworld',
  },
  {
    id: 'cineplay-user',
    name: 'CinePlay',
    email: 'cineplay@streampulse.com',
    password: '123456',
    role: 'publisher',
    channelId: 'cineplay',
  },
];
