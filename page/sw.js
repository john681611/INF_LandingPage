
/* eslint-env browser, serviceworker, es6 */



const cacheList = [
    '/',
    '/assets/grayscale.css',
    '/js/grayscale.js',
    '/js/lazysizes.min.js',
    '/js/main.js',
    '/js/pwa.js',
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
].map(url => new Request(url, {credentials: 'same-origin'}));

const updateList =[
    '/'
];

const cacheName = 'INF_v1';


const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

self.addEventListener('install',event => {
    event.waitUntil(
        caches.open(cacheName).then(cache =>{
            return cache.addAll(cacheList);
        }).catch(error => console.error(error)) //eslint-disable-line no-console
    );
});

self.addEventListener('activate', event  => {
    event.waitUntil(
        caches.keys().then(keyList =>{
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(response => {
                const path = new URL(event.request.url).pathname;
                return !updateList.includes(path) && response? response : fetch(event.request).then(response => {
                    if(updateList.includes(path)) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                }).catch((e) => {
                    console.log(e); //eslint-disable-line no-console
                    return response;
                });
            });
        })
    );
});

self.addEventListener('push', event => {
    const title = 'Iron-Fists';
    const options = {
        body: `Alert: ${event.data.text()}`,
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
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey); //eslint-disable-line no-undef
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
    );
});
