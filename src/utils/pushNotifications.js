import { getVapidPublicKey, subscribePush, unsubscribePush } from '../api/pushApi';

// Web Push VAPID keys are base64url; PushManager.subscribe wants a raw Uint8Array.
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const isPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const getExistingPushSubscription = async () => {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  return registration.pushManager.getSubscription();
};

export const enablePushNotifications = async () => {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted');
  }

  const registration = await navigator.serviceWorker.register('/service-worker.js');
  const { data } = await getVapidPublicKey();

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(data.publicKey),
  });

  await subscribePush(subscription.toJSON());
  return subscription;
};

export const disablePushNotifications = async () => {
  const subscription = await getExistingPushSubscription();
  if (!subscription) return;

  await unsubscribePush(subscription.endpoint);
  await subscription.unsubscribe();
};
