
/* eslint-env browser, serviceworker, es6 */
/* global workbox */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
const week = 7 * 24 * 60 * 60;
workbox.routing.registerRoute(
    /\*.js/,
    workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
    /.*\.css/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'css-cache'
    })
);

workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    workbox.strategies.cacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20,
                maxAgeSeconds: week
            })
        ]
    })
);

workbox.precaching.precacheAndRoute([
    '/',
    '/forum',
    '/js/main.js',
    '/js/pwa.js',
    '/js/lazysizes.min.js',
    '/assets/grayscale.css',
    '/img/Arma-3-Apex-desktop.jpg',
    '/img/Arma-3-Apex-mobile.jpg',
    '/img/Arma-3-Apex-tablet.jpg',
    '/img/Arma-3-desktop.jpg',
    '/img/Arma-3-Laws-desktop.jpg',
    '/img/Arma-3-Laws-mobile.jpg',
    '/img/Arma-3-Laws-tablet.jpg',
    '/img/Arma-3-Marksmen-desktop.jpg',
    '/img/Arma-3-Marksmen-mobile.jpg',
    '/img/Arma-3-Marksmen-tablet.jpg',
    '/img/Arma-3-mobile.jpg',
    '/img/Arma-3-tablet.jpg',
    '/img/Arma-3-Zeus-desktop.jpg',
    '/img/Arma-3-Zeus-mobile.jpg',
    '/img/Arma-3-Zeus-tablet.jpg',
    '/img/arma3logo.png',
    '/img/favicon.ico',
    '/img/forum-desktop-tablet.jpg',
    '/img/forum-mobile.jpg',
    '/img/logo-desktop.png',
    '/manifest.json'
]);

self.addEventListener('push', event => {
    const title = 'Iron-Fists';
    const options = {
        body: `${event.data.text()}`,
        icon: '/img/logo-desktop.png',
        badge: '/img/logo-desktop.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('http://ironfists.azurewebsites.net/#news')
    );
});

self.addEventListener('pushsubscriptionchange', event => {
    const base64String = applicationServerPublicKey; //eslint-disable-line no-undef
    const padding = '='.repeat((4 - base64String.length % 4) % 4); //eslint-disable-line no-magic-numbers
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    const applicationServerKey = outputArray;
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
    );
});
