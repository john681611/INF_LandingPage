
/* eslint-env browser, serviceworker, es6 */


const cacheName = 'INF_v1';
const cacheList = [
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
].map(url => new Request(url, { credentials: 'same-origin' }));

const updateList = [
    '/',
    '/forum',
    '/js/main.js',
    '/js/pwa.js',
    '/assets/grayscale.css'
];

const authList = ['/edit'];

//utils
const fetchUpdate = (event, cache, cacheRes, notInUpdateList) => {
    return fetch(event.request).then(netRes => {
        if (!notInUpdateList) {
            console.log(`${event.request.url} updated`); //eslint-disable-line no-console
            netRes.credentials = 'same-origin';
            cache.put(event.request, netRes.clone());
        }
        return netRes;
    }).catch((e) => {
        console.log(e); //eslint-disable-line no-console
        return cacheRes;
    });
};

const fetchCacheCheck = (event, path) => {
    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(cacheRes => {
                const notInUpdateList = !updateList.includes(path);
                if (notInUpdateList && cacheRes) {
                    return cacheRes;
                }
                return fetchUpdate(event, cache, cacheRes, notInUpdateList);
            });
        })
    );

};

//events
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(cacheList);
        }).catch(error => console.error(error)) //eslint-disable-line no-console
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
                return null;
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', event => {
    const path = new URL(event.request.url).pathname;
    if (!authList.includes(path)) {
        fetchCacheCheck(event, path);
    }
});

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
