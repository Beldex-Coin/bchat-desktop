export const DAEMON = "DAEMON";

export type DaemonStateType = {
  height: number;
};
export const updateDaemon = (daemon: DaemonStateType) => {
  return {
    type: DAEMON,
    payload: daemon,
  };
};

export const initialDaemonState: DaemonStateType = {
  height: 0,
};

export const reducer = (
  state: any = initialDaemonState,
  {
    type,
    payload,
  }: {
    type: string;
    payload: DaemonStateType;
  }
): DaemonStateType => {
  switch (type) {
    case DAEMON:
      return payload;
    default:
      return state;
  }
};

export const actions = {
  updateDaemon,
};
