
/* eslint-env browser, es6 */
let pushButton = document.querySelector('.notification.news');
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
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        pushMemberButton.textContent = 'Push Messaging Blocked.';
        pushMemberButton.disabled = true;
        unsubscribeUser();
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable News Push Notifications';
        if(localStorage.member) {
            pushMemberButton.textContent = 'Disable Member Push Notifications';
        }
    } else {
        pushButton.textContent = 'Enable News Push Notifications';
        pushMemberButton.textContent = 'Enable Member Push Notifications';
    }

    pushButton.disabled = false;
    pushMemberButton.disabled = false;
}

function sendSubToServer (url, subscription) {
    fetch(url, {
        method: 'post',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
}

function updateSubscriptionOnServer(subscription) {
    let url = '/subscription';
    if (isSubscribed) {
        url = 'delete/subscription';
    }
    sendSubToServer(url, subscription);

    if(localStorage.member) {
        url = 'member/subscription';
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
    if(pushButton) {
        pushButton.addEventListener('click', function () {
            pushButton.disabled = true;
            if (isSubscribed) {
                unsubscribeUser(false);
            } else {
                subscribeUser(false);
            }
        });
    } else {
        pushButton = {};
    }
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
    pushButton.textContent = 'Push Not Supported';
    pushMemberButton.textContent = 'Push Not Supported';
}
