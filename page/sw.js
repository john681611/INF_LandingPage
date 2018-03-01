/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the 'License');
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an 'AS IS' BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */



/* eslint-disable max-len */
const cacheList = [
    '/',
    '/css/grayscale.css',
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
    '/img/facebook.png',
    '/img/favicon.ico',
    '/img/forum-desktop-tablet.jpg',
    '/img/forum-mobile.jpg',
    '/img/logo-desktop.png',
    '/img/ts.png',
    '/img/units.png',
    '/manifest.json'
];

const cacheName = 'INF_v0';
/* eslint-enable max-len */

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

self.addEventListener('install',event => {
    event.waitUntil(
        caches.open(cacheName).then(cache =>{
            return cache.addAll(cacheList);
        }).then(() => {
            return self.skipWaiting();
        })
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
                return new URL(event.request.url).pathname !=='/' && response? response : fetch(event.request).then(response => {
                    console.log('updated: ',event.request.url);
                    cache.put(event.request, response.clone());
                    return response;
                }).catch((e) => {
                    console.log(e);
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
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
    );
});
