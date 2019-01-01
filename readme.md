# Notedown

> A simple note website with syntax coloration

## :link: Live version

[notedown.bruno-simon.com](http://notedown.bruno-simon.com)

## :memo: Details

Notedown use Firebase to save the notes. Data access are restricted to the user (no one can access another user data).
No save button, simply write your stuff.
If you want to use your notes across multiple devices, use the [sign in] button on the top right corner. You'll be asked to connect your Google account and authorize Notedown.
Notedown works on any modern browser with Internet and will simply add some syntax coloration. It works great with todo lists.

## :wrench: Instructions

### Node.js / NPM

- Install [Node.js](https://nodejs.org/en/)
- Open the terminal and go to project folder
- Install dependencies using `npm install` (You may need to add `sudo`)

### Firebase

- Go to [Firebase](https://firebase.google.com) and create a Realtime Database
- Activate Google Auth
- Create an `.env` file at the root folder following the `.env.demo` example and add the firebase informations
- Create an `.env.development` file if you want a different configuration in development

### Compile

- Start developing with `npm run dev`
- Build with `npm run build` (destination files are in `build/`)

### Coding

- Install EditorConfig on your editor
- Install ESLint on your editor
