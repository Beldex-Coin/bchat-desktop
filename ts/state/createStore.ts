import { createLogger } from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { persistReducer } from 'redux-persist';
import promiseMiddleware from 'redux-promise-middleware';


import storage from 'redux-persist/lib/storage';

// const env = window.getEnvironment();

// So Redux logging doesn't go to disk, and so we can get colors/styles
const directConsole = {
  log: (console as any)._log,
  groupCollapsed: console.groupCollapsed,
  group: console.group,
  groupEnd: console.groupEnd,
  warn: console.warn,
  error: console.error,
};

const logger = createLogger({
  logger: directConsole,
});

export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userConfig'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Exclude logger if we're in production mode
const disableLogging = true; 
const middlewareList = disableLogging ? [promiseMiddleware] : [logger, promiseMiddleware];

// A handful of modal state shapes in ducks/modalDialog.tsx intentionally carry function props
// (ConfirmModalState's onClickOk/onClickCancel, BchatPasswordModalState's onOk,
// SettingMiniModalState's onClose/onClick) - that's how the app tells a modal what to do when the
// user acts on it, across many call sites (settings toggles, delete-account confirmation, message
// link-open confirmation, and more). None of those are ever meant to be persisted or replayed,
// only invoked while the modal is open, so they were never a bug to fix one dispatch at a time -
// but redux-toolkit's default serializableCheck doesn't know that, and logs "A non-serializable
// value was detected..." to the console on every single dispatch for as long as one of these
// modals is open (whichever action happens to be running when the check's state scan reaches it -
// so the blamed action/location in the warning is essentially random, not the actual culprit).
// Telling the check to skip exactly these three known, intentional cases keeps it working as a
// real safety net for every other modal (and the rest of the state tree), instead of turning it
// off wholesale or chasing the false lead in each warning.
const SERIALIZABLE_CHECK_IGNORED_MODAL_ACTIONS = [
  'modals/updateConfirmModal',
  'modals/bchatPassword',
  'modals/SettingMiniModal',
];
const SERIALIZABLE_CHECK_IGNORED_MODAL_PATHS = [
  'modals.confirmModal',
  'modals.bchatPasswordModal',
  'modals.SettingMiniModal',
];

export const createStore = (initialState: any) =>
  configureStore({
    reducer: persistedReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: SERIALIZABLE_CHECK_IGNORED_MODAL_ACTIONS,
          ignoredPaths: SERIALIZABLE_CHECK_IGNORED_MODAL_PATHS,
        },
        immutableCheck: true,
      }).concat(middlewareList),
  });
