class Helper {
  data_dir: null;
  wallet_dir: null;
  constructor() {
    this.data_dir = null;
    this.wallet_dir = null
    
  }
  heartbeatAction() {
    throw new Error('Method not implemented.');
  }
}
export const walletHelper = new Helper();
