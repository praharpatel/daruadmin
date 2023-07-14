// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: 'https://apidev.daru.mx:3001/graphql',
  backendWs: 'wss://apidev.daru.mx:3001/graphql',
  stripePublicKey: 'pk_test_51JIL74J3AWJEzlXbrPLgiyb1RdjtNR4Raz49wGw3CsU8YMes5ZhSw6Z7Qx2TCabBD5gYcVyV4cJSwVJUXWTleF1O00XRREKbZk',
  upload: 'https://apidev.daru.mx:3001/upload',
  uploadsUrl: 'https://apidev.daru.mx:3001/uploads',

  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
