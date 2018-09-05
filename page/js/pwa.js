
/* eslint-env browser, es6 */




const pushButton = document.querySelector('.notification');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
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
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        unsubscribeUser();
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push Notifications';
    } else {
        pushButton.textContent = 'Enable Push Notifications';
    }

    pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription) {
    let url = '/subscription';
    if (isSubscribed) {
        url = 'delete/subscription';
    }

    fetch(url, {
        method: 'post',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
}


function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey); //eslint-disable-line no-undef
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    }).then(function (subscription) {
        updateSubscriptionOnServer(subscription);
        isSubscribed = true;
        updateBtn();
    });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                subscription.unsubscribe();
                updateSubscriptionOnServer(subscription);
                isSubscribed = false;
                updateBtn();
            }
        });
}

function initializeUI() {
    pushButton.addEventListener('click', function () {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);
            updateBtn();
        });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {

    navigator.serviceWorker.register('/sw.js')
        .then(function (swReg) {
            swRegistration = swReg;
            initializeUI();
        });
} else {
    pushButton.textContent = 'Push Not Supported';
}
