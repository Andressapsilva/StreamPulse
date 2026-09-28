import type { BrokerEvent, Message, NotificationItem } from '../types';

const keys = {
  session: 'streampulse_session',
  subscriptions: 'streampulse_subscriptions',
  notifications: 'streampulse_notifications',
  events: 'streampulse_event_log',
} as const;

type SubscriptionMap = Record<string, string[]>;
type NotificationMap = Record<string, NotificationItem[]>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getSessionId(): string | null {
  return localStorage.getItem(keys.session);
}

export function saveSession(userId: string | null): void {
  if (userId) localStorage.setItem(keys.session, userId);
  else localStorage.removeItem(keys.session);
}

export function getSubscriptions(): SubscriptionMap {
  return readJson(keys.subscriptions, {});
}

export function saveSubscriptions(subscriptions: SubscriptionMap): void {
  localStorage.setItem(keys.subscriptions, JSON.stringify(subscriptions));
}

export function getNotifications(userId: string): NotificationItem[] {
  return (readJson<NotificationMap>(keys.notifications, {})[userId] ?? []).map((item) => ({
    ...item,
    publishedAt: new Date(item.publishedAt),
  }));
}

export function addNotification(userId: string, message: Message): NotificationItem[] {
  const allNotifications = readJson<NotificationMap>(keys.notifications, {});
  const notifications = [
    { ...message, read: false },
    ...(allNotifications[userId] ?? []),
  ];
  localStorage.setItem(
    keys.notifications,
    JSON.stringify({ ...allNotifications, [userId]: notifications }),
  );
  return notifications;
}

export function markNotificationsRead(userId: string): NotificationItem[] {
  const allNotifications = readJson<NotificationMap>(keys.notifications, {});
  const notifications = (allNotifications[userId] ?? []).map((item) => ({ ...item, read: true }));
  localStorage.setItem(
    keys.notifications,
    JSON.stringify({ ...allNotifications, [userId]: notifications }),
  );
  return notifications.map((item) => ({ ...item, publishedAt: new Date(item.publishedAt) }));
}

export function getEvents(): BrokerEvent[] {
  return readJson<BrokerEvent[]>(keys.events, []).map((event) => ({
    ...event,
    timestamp: new Date(event.timestamp),
  }));
}

export function saveEvents(events: BrokerEvent[]): void {
  localStorage.setItem(keys.events, JSON.stringify(events));
}
