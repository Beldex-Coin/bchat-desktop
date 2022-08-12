/* global window */

const { ipcRenderer } = require('electron');
const url = require('url');

const i18n = require('./ts/util/i18n');

const config = url.parse(window.location.toString(), true).query;
const { locale } = config;
const localeMessages = ipcRenderer.sendSync('locale-data');

window._ = require('lodash');

window.React = require('react');
window.ReactDOM = require('react-dom');

window.getVersion = () => config.version;
window.theme = config.theme;
window.i18n = i18n.setupi18n(locale, localeMessages);

// got.js appears to need this to successfully submit debug logs to the cloud
window.nodeSetImmediate = setImmediate;

window.getNodeVersion = () => config.node_version;
window.getEnvironment = () => config.environment;

require('./ts/util/logging');
const os = require('os');

window.getOSRelease = () => `${os.type()} ${os.release} ${os.platform()}`;
window.getCommitHash = () => config.commitHash;

window.closeDebugLog = () => ipcRenderer.send('close-debug-log');

window.saveLog = logText => ipcRenderer.send('save-debug-log', logText);
