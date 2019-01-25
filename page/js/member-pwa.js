
/* eslint-env browser, es6 */
let pushMemberButton = document.querySelector('.notification.member');

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
        pushMemberButton.textContent = 'Push Messaging Blocked.';
        pushMemberButton.disabled = true;
        unsubscribeUser();
        return;
    }

    if (isSubscribed) {
        if(localStorage.member) {
            pushMemberButton.textContent = 'Disable Member Push Notifications';
        }
    } else {
        pushMemberButton.textContent = 'Enable Member Push Notifications';
    }

    pushMemberButton.disabled = false;
}

function sendSubToServer (url, subscription) {
    fetch(url, {
        method: 'post',
        credentials: 'same-origin',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'CSRF-Token': csrf //eslint-disable-line no-undef
        }
    });
}

function updateSubscriptionOnServer(subscription) {
    if(localStorage.member) {
        let url = 'member/subscription';
        if (isSubscribed) {
            url = 'delete/member/subscription';
        }
        sendSubToServer(url, subscription);
    }
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
    if(pushMemberButton) {
        pushMemberButton.addEventListener('click', function () {
            pushMemberButton.disabled = true;
            if (isSubscribed) {
                unsubscribeUser(true);
                localStorage.member = false;
            } else {
                localStorage.member = true;
                subscribeUser(true);
            }
        });
    } else {
        pushMemberButton = {};
    }

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
    pushMemberButton.textContent = 'Push Not Supported';
}
