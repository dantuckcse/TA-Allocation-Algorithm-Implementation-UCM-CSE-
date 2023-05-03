// // Import the functions you need from the SDKs you need
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/analytics';

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyA0b2hGh6kuTBWxUVhEdR9qKKEmfZXs_Hc",
//   authDomain: "ta-allocation-382919.firebaseapp.com",
//   projectId: "ta-allocation-382919",
//   storageBucket: "ta-allocation-382919.appspot.com",
//   messagingSenderId: "1031482042151",
//   appId: "1:1031482042151:web:907ccfe86732b5eeb42b02",
//   measurementId: "G-LPK5R76YSE"
// };


// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
  
//   // Check if we are running in the browser before calling getAnalytics()
//   const analytics = typeof window !== 'undefined' && firebase.analytics();
  
//   export default firebase;
//   export { analytics };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA0b2hGh6kuTBWxUVhEdR9qKKEmfZXs_Hc",
//   authDomain: "ta-allocation-382919.firebaseapp.com",
//   projectId: "ta-allocation-382919",
//   storageBucket: "ta-allocation-382919.appspot.com",
//   messagingSenderId: "1031482042151",
//   appId: "1:1031482042151:web:907ccfe86732b5eeb42b02",
//   measurementId: "G-LPK5R76YSE"
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// let analytics;

// // Initialize Analytics only in the browser environment
// if (typeof window !== 'undefined') {
//   import('firebase/analytics').then(() => {
//     analytics = firebase.analytics();
//   });
// }

// export default firebase;
// export { analytics };


// let firebase;

// if (typeof window !== "undefined") {
//   firebase = require("firebase/compat/app");
//   require("firebase/compat/auth");
//   require("firebase/compat/firestore");

//   const firebaseConfig = {
//     apiKey: "AIzaSyA0b2hGh6kuTBWxUVhEdR9qKKEmfZXs_Hc",
//     authDomain: "ta-allocation-382919.firebaseapp.com",
//     projectId: "ta-allocation-382919",
//     storageBucket: "ta-allocation-382919.appspot.com",
//     messagingSenderId: "1031482042151",
//     appId: "1:1031482042151:web:907ccfe86732b5eeb42b02",
//     measurementId: "G-LPK5R76YSE"
//   };

//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }

//   let analytics;

//   // Initialize Analytics only in the browser environment
//   if (typeof window !== "undefined") {
//     import("firebase/compat/analytics").then(() => {
//       analytics = firebase.analytics();
//     });
//   }

//   export { analytics };
// }

// export default firebase;



import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA0b2hGh6kuTBWxUVhEdR9qKKEmfZXs_Hc",
  authDomain: "ta-allocation-382919.firebaseapp.com",
  projectId: "ta-allocation-382919",
  storageBucket: "ta-allocation-382919.appspot.com",
  messagingSenderId: "1031482042151",
  appId: "1:1031482042151:web:907ccfe86732b5eeb42b02",
  measurementId: "G-LPK5R76YSE"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

