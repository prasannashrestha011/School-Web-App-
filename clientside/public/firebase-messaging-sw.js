
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyD7oHh6Ed3A7ozCRWBXAMKhOpPX4BlZajs",
    authDomain: "pushnotification-25da2.firebaseapp.com",
    projectId: "pushnotification-25da2",
    storageBucket: "pushnotification-25da2.appspot.com",
    messagingSenderId: "91817390878",
    appId: "1:91817390878:web:ae720b35627cd165534f0f",
    measurementId: "G-M5Y44T0FV1"
  });
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
   
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

self.addEventListener('install',e=>{
    console.log('service worker installing')
})

