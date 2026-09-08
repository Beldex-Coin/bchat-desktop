# BChat Desktop

BChat is a decentralized p2p messaging app that runs on the Beldex network.
Unlike other centralized messaging apps, BChat never collects any user data like phone number, location, email, IP address, etc.
The messages you send using BChat are highly secure and anonymous. No one (not even us) has control of the data you share in BChat.
With BChat, you own your data.
<br/><br/>
![BChatDesktop](https://bchat.beldex.io/img/Profile.png)

Noir design revamp
------------------

The `design-revamp` branch carries a ground-up redesign of the desktop app — the **Noir Protocol** design system, drawn from the Beldex brand identity:

- **One black ground** (`#0A0A0A`) with a subtle dot-grid field, layered panels, and hairline borders.
- **One live color** — network green (`#1BB51E`) — used strictly for state: presence, unread, focus, route, active selection. Sent messages are white blocks with ink text; the light "Ghost" theme is the inverse.
- **Chamfered geometry** — corners cut from the Beldex hexagon; no border radius anywhere.
- **Three type roles** — [Michroma](https://fonts.google.com/specimen/Michroma) for display headings, [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) for UI text (Poppins kept as the non-Latin fallback), and SpaceMono for the data layer (timestamps, IDs, seeds, routes).

Key implementation points:

- Theme tokens live in `ts/theme/` (`classicDark.tsx` = Noir, `classicLight.tsx` = Ghost, shared constants in `BchatThemeConstants.ts`); they are painted as CSS variables at runtime.
- `stylesheets/_noir.scss` is the revamp override layer, imported last in `manifest.scss`. New-surface styles and legacy overrides live there — prefer extending it over editing legacy SCSS.
- Redesigned surfaces include onboarding (welcome gate, three-step sign-up with the seed ceremony), the app-lock password window, chat list with filters (ALL / DMS / GROUPS / SOCIAL), conversation view, new-chat overlay and rail submenu, settings with the hops route diagram, profile dialog, and the empty states (all static illustrations removed).

Build and run
-------------

This is a Yarn 1 project (npm will fail on peer dependencies).

```bash
nvm use            # node 18.15.0 (.nvmrc)
yarn install
yarn build-all     # protobuf + sass + tsc + workers
yarn start-prod
```

See [BUILDING.md](BUILDING.md) for full platform-specific instructions.

Contributing code
-----------------

Code contributions should be sent via Github as pull requests, from feature branches [as explained here](https://help.github.com/articles/using-pull-requests)

Debian Repository
-----------------
Please find it here : https://deb.beldex.io/

Credits
-------
- Portions Copyright (c) 2014-2018 The Monero Project
- Portions Copyright (c) 2011 Whisper Systems
- Portions Copyright (c) 2013-2017 Open Whisper Systems
- Portions Copyright (c) 2018-2021 Session
