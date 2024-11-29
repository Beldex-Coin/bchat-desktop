export const IS_VERIFY_BNS_CALLED = 'IS_VERIFY_BNS_CALLED';

export type IsVerifyBnsCalledStateType =boolean;
export const setIsVerifyBnsCalled = (isVerifyBnsCalled: IsVerifyBnsCalledStateType) => {
  return {
    type: IS_VERIFY_BNS_CALLED,
    payload: isVerifyBnsCalled,
  };
};

export const initialisVerifyBnsCalledState: IsVerifyBnsCalledStateType = false;

export const reducer = (
  state: any = initialisVerifyBnsCalledState,
  {
    type,
    payload,
  }: {
    type: string;
    payload: IsVerifyBnsCalledStateType;
  }
): IsVerifyBnsCalledStateType => {
  switch (type) {
    case IS_VERIFY_BNS_CALLED:
      return payload;
    default:
      return state;
  }
};

export const actions = {
    setIsVerifyBnsCalled,
};
