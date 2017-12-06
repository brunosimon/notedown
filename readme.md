# Notedown

> A simple note website with syntax coloration

## :link: Live version

[notedown.bruno-simon.com](http://notedown.bruno-simon.com)

## :memo: Details

Notedown doesn't save anything on server side. In fact, there is no server side. Instead, it asks for access to the user Google Drive and save the note on it. User may retrieve those note directly from his Drive.
Want to retrieve your notes on another computer? Simply connect to notedown with the same Google account.
Notedown works on any browser with Internet and will simply add some syntax coloration. It works best for todo list.
No save button, simply write your stuff.

## :wrench: Instructions

### Node.js / NPM

- Install [Node.js](https://nodejs.org/en/)
- Open the terminal and go to project folder
- Install dependencies using `npm install` (You may need to add `sudo`)

### Google API

- Go to [Google APIs Console](https://console.developers.google.com/apis/) and create a new project
- Activate Google Drive API
- Go to project the credentials page
- Create credentials for Javascript with access to user data (the rest is up to you)
- Add your URLs as both authorized and redirections (Use `http://localhost:8080` to test on local)
- Create an `.env` file at the root with the Google `CLIENT ID` and `API KEY` as shown on the `.env.example` file

### Compile

- Start developing with `npm run dev`
- Build with `npm run build` (destination files are in `build/`)

### Coding

- Install EditorConfig on your editor
- Install ESLint on your editor
