# app

## Project setup

Global CLI tools (dependencies):
```
npm install -g @vue/cli firebase-tools
```

You need a Firebase project to run this app:
   * Create a Firebase project at console.firebase.google.com
   * Go to the Database tab and enable Firestore
   * Go to the Authentication tab and enable the Google provider

Local code setup:
```
git clone https://github.com/katowulf/gvcassist.git
npm install
copy app/fireabase-config.template.ts app/firebase-config.ts
```

Open `app/firebase-config.ts` and copy in the *Firebase SDK snippet* from your 
[web app settings](https://console.firebase.google.com/project/_/settings/general)
in the Firebase console.

## Development

### Run a local server with hot-reloads
```
npm run serve
```

For debugging, try opening the js console and entering `enableDebugging(true)` for a mini footer bar with UI and auth info, or browse to `/debug` to see a full page output.

### Lints and fixes files
```
npm run lint
```

### Run test units
To run test units once from npm:
```
npm run test
```

Run test units from your IDE:
```
# Start the emulator for continuous testing
npm run test:emu
```

IDE config for JetBrains tools (WebStorm, IntelliJ):
```
Working directory: <project>/app/
Mocha package: <project>/app/node_modules/mocha
User interface: mocha-typescript
Extra Mocha options: --timeout 10000
"All in directory"
Test directory: test (include subdirectories)
Before launch: "Compile typescript"
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Deployment

When deploying to staging servers, use `npm run build:dev`; production servers use `npm run build:prod`.

```
# Prep for staging server (in development mode)
npm run build:dev

# Prep for production server (in production mode)
npm run build:prod
```
