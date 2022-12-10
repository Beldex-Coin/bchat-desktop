import { WebSocket } from 'ws';
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
  heartbeatAction() {
    // console.log('HELPER HEART BEAT');
    setTimeout(() => {
      this.ws = new WebSocket('ws://127.0.0.1:' + 12313);
      this.ws.addEventListener('open', () => {
        this.open();
      });
      this.ws.addEventListener('message', (e:any) => {
        this.receive(e.data);
      });
    }, 1000);
  }
  receive(message: any) {
    // console.log("message:",message)


    // should wrap this in a try catch, and if fail redirect to error screen
    // shouldn't happen outside of dev environment
    // const emitter = new EventEmitter();
    // let decrypted_data:any = JSON.parse(this.scee.decryptString(message, "77f9d29cef9eea79016b5d642fb79744bf47b758e2d95a3342620163d952acc9ae2120ce7901cca1a9e5f6e26d87dc506ee38c066420d274b7efd069f10a4092"));
    // console.log('decrypted_data.data:', decrypted_data);
    // let decrypted_data:any = new TextDecoder().decode(message);
     let decrypted_data:any = JSON.parse(message);

    //  console.log("help-rec:",decrypted_data.data.info)


    // emitter.emit('foo', decrypted_data.data);
    // emitter.on('foo', (foo)=>console.log("foo0000000000000000000:",foo));

    if (
      typeof decrypted_data !== 'object' ||
      !decrypted_data.hasOwnProperty('event') ||
      !decrypted_data.hasOwnProperty('data')
    ) {
      return;
    }
  }

  open() {
    this.send('core', 'init');
  }
  send(module: any, method: any, data = {}) {
    let message = {
      module,
      method,
      data,
    };
    // let encrypted_data = this.scee.encryptString(
    //   JSON.stringify(message),
    //   "77f9d29cef9eea79016b5d642fb79744bf47b758e2d95a3342620163d952acc9ae2120ce7901cca1a9e5f6e26d87dc506ee38c066420d274b7efd069f10a4092"
    // );
    let encrypted_data = JSON.stringify(message);

    // console.log("help-send:",encrypted_data)

    this.ws.send(encrypted_data);
  }
}
export const walletHelper = new Helper();
