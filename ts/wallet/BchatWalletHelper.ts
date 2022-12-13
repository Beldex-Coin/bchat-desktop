// import { WebSocket } from 'ws';
import { SCEE } from "./SCEE";
// import { EventEmitter } from "events";



class Helper  {
  data_dir: null;
  wallet_dir: null;
  ws: any;
  scee: any;
  constructor() {
    this.data_dir = null;
    this.wallet_dir = null;
    this.ws = null;
    this.scee = new SCEE();
  }
  // heartbeatAction() {
  //   // console.log('HELPER HEART BEAT');
  //   setTimeout(() => {
  //     this.ws = new WebSocket('ws://127.0.0.1:' + 12313);
  //     this.ws.addEventListener('open', () => {
  //       this.open();
  //     });
  //     this.ws.addEventListener('message', (e:any) => {
  //       this.receive(e.data);
  //     });
  //   }, 1000);
  // }
  // receive(message: any) {
  //    let decrypted_data:any = JSON.parse(message);
  //   if (
  //     typeof decrypted_data !== 'object' ||
  //     !decrypted_data.hasOwnProperty('event') ||
  //     !decrypted_data.hasOwnProperty('data')
  //   ) {
  //     return;
  //   }
  // }

  // open() {
  //   this.send('core', 'init');
  // }
  // send(module: any, method: any, data = {}) {
  //   let message = {
  //     module,
  //     method,
  //     data,
  //   };
  //   let encrypted_data = JSON.stringify(message);
  //   this.ws.send(encrypted_data);
  // }
}
export const walletHelper = new Helper();
