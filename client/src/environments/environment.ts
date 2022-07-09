// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // contract: {
  //   address: '0xc700EeF3bea3F02D36357BD9bb9A19503b014ba2'
  // },
  // chain: {
  //   id: 1337,
  //   name: 'localhost'
  // }
  contract: {
    address: '0x3D182DE72fe17e194bEAA6ceEf21b6Fed3FdA714'
  },
  chain: {
    id: 97,
    name: 'Smart Chain Testnet'
  },
  apiUrl: 'http://localhost:3000/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
