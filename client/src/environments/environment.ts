// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  contract: {
    address: '0x5ba2CB5CdcE4874C5eEeD506E989a44b2D5De100'
  },
  chain: {
    id: 1337,
    name: 'localhost'
  }
  // contract: {
  //   address: '0xa379af6372d736Bd8C92CCC45B74ECD2dE90836f'
  // },
  // chain: {
  //   id: 97,
  //   name: 'Smart Chain Testnet'
  // }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
