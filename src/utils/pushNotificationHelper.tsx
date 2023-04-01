import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Aşağıdaki fonksiyon Kullanıcının bildirim iznini isteyen ve Firebase Cloud Messaging (FCM) öğesini ayarlayan fonksiyondur.
export async function RequestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    if (enabled) {
        console.log('Authorization status:', authStatus)
        GetFCMToken()
    }
}

// Bu fonksiyon FCM token'ını alır ve saklar.
async function GetFCMToken() {
    let fcmtoken = await AsyncStorage.getItem("fcmtoken")
    console.log(fcmtoken, "old token")
    if (!fcmtoken) {
        try {
            const fcmtoken = await messaging().getToken()
            if (fcmtoken) {
                console.log(fcmtoken, "new token");
                await AsyncStorage.setItem("fcmtoken", fcmtoken as any)
            }
        } catch (error) {
            console.log(error, "error in fcm token")
        }
    }
}

// Bildirim dinleyicisi. Uygulama açıkken ve çalışırken bildirimlerin geldiği durumlarla ilgilenir.
export const NotificationListener = () => {
    // Uygulama arka plandayken açılan bir bildirim varsa, bu fonksiyon çalışır.
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });
    // Uygulama tamamen kapatıldıktan sonra açılan bir bildirim varsa, bu fonksiyon çalışır.
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });
    // Uygulama açıkken gelen bir bildirim varsa, bu fonksiyon çalışır.
    messaging().onMessage(async remoteMessage => {
        console.log("notification on state...", remoteMessage)
    })
}