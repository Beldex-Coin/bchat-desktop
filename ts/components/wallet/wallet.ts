import { HTTPError } from "../../bchat/utils/errors";
import { default as insecureNodeFetch } from 'node-fetch';
import { updateBalance } from "../../state/ducks/wallet";
import { useDispatch } from 'react-redux';



export class Walletnew {
    heartbeat: any;
    constructor(){
        this.heartbeat = null;

    }

    daemonHeartbeat() {
      const dispatch  = useDispatch()
        clearInterval(this.heartbeat);
        this.heartbeat = setInterval(async() => {
         let getAddress = await  this.walletRPC("getheight",{},1000);
         let getBalance = await this.walletRPC("getbalance", { account_index: 0 },1000);
         let currentBalance = Number((getBalance.result.balance/1000000000).toFixed(4));
         let currentHeight = getAddress.result.height;
         dispatch(updateBalance({balance:currentBalance,height:currentHeight}));


         console.log("currentHeight:",currentHeight)

        }, 5000);
        // this.heartbeatAction(true);
      }
        heartbeatAction() {
            throw new Error("Method not implemented."); 
        }
    
       walletRPC = async (method: string, params = {},timeout = 0) => {
        console.log("timeout:",timeout)
            try {
              const url = 'http://localhost:64371/json_rpc';
              const fetchOptions = {
                method: 'POST',
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: '0',
                  method: method,
                  params,
                }),
                headers: {
                  Authorization: 'Basic ' + btoa(`${window.rpcUserName}:${window.rpcPassword}`),
                },
                timeout :timeout

              };
              const response = await insecureNodeFetch(url, fetchOptions);
              if (!response.ok) {
                throw new HTTPError('beldex_rpc error', response);
              }
          
              let result = await response.json();
          
              if (result.hasOwnProperty('error').code === -1) {
                if (result.error.code === -1) return result;
              }
              return result;
            } catch (e) {
              throw new HTTPError('exception during wallet-rpc:', e);
            }
          };
  
}
