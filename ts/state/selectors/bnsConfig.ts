import { StateType } from '../reducer';
import { IsVerifyBnsCalledStateType } from '../ducks/bnsConfig';

export const getIsVerifyBnsCalled = (state: StateType): IsVerifyBnsCalledStateType => state.isVerifyBnsCalled;
