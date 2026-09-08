# BChat Desktop

BChat is a decentralized p2p messaging app that runs on the Beldex network.
Unlike other centralized messaging apps, BChat never collects any user data like phone number, location, email, IP address, etc.
The messages you send using BChat are highly secure and anonymous. No one (not even us) has control of the data you share in BChat.
With BChat, you own your data.
<br/><br/>
![BChatDesktop](https://bchat.beldex.io/img/Profile.png)

Features
--------

- **No identifiers** — accounts are created from a recovery seed; no phone number or email required. Your BChat ID can optionally be linked to a human-readable BNS name.
- **End-to-end encryption** — private one-to-one chats, secret groups, and public social groups.
- **Onion routing** — traffic is relayed through Beldex masternodes ("hops"), so no single node knows both who you are and who you're talking to.
- **Voice and video calls**, message requests, disappearing messages, attachments, and reactions.

Building from source
--------------------

BChat Desktop is an Electron app written in TypeScript/React, built with Yarn 1.
**Use `yarn`, not `npm`** — the project relies on `resolutions` and its postinstall scripts, and `npm install` will fail on peer dependencies.

### Prerequisites

- [Node.js](https://nodejs.org) matching the version in [`.nvmrc`](.nvmrc) — with [nvm](https://github.com/nvm-sh/nvm), run `nvm install && nvm use`
- [Yarn 1.x](https://classic.yarnpkg.com) (`npm install -g yarn`)
- Python 3 and build tools for native modules (`node-gyp`): Xcode Command Line Tools on macOS, `build-essential` on Linux, or Visual Studio Build Tools on Windows

### Build and run

```bash
git clone https://github.com/Beldex-Coin/bchat-desktop
cd bchat-desktop
yarn install       # also runs patch-package and electron-builder deps
yarn build-all     # protobuf + sass + tsc + web workers
yarn start-prod    # launch the app
```

For development, use `yarn start-dev` instead. To run a second instance side by side, set `MULTI`, e.g. `MULTI=1 yarn start-dev`.

### Tests and linting

```bash
yarn test          # unit tests (mocha)
yarn lint-full     # prettier + eslint
```

### Packaging release binaries

```bash
yarn build-release
```

Binaries are written to the `release/` directory (deb/rpm/AppImage on Linux, dmg on macOS, exe on Windows). See [BUILDING.md](BUILDING.md) for platform-specific details, including macOS signing/notarization and CI builds.

Debian Repository
-----------------
Please find it here : https://deb.beldex.io/

Contributing code
-----------------

Code contributions should be sent via Github as pull requests, from feature branches [as explained here](https://help.github.com/articles/using-pull-requests)

License
-------

[GPL-3.0](LICENSE)

Credits
-------
- Portions Copyright (c) 2014-2018 The Monero Project
- Portions Copyright (c) 2011 Whisper Systems
- Portions Copyright (c) 2013-2017 Open Whisper Systems
- Portions Copyright (c) 2018-2021 Session
