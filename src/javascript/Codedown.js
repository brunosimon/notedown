import Logs from './Logs.js'
import Code from './Code.js'
import GoogleDriveAPI from './GoogleDriveAPI.js'
import Controller from './Controller.js'

const BASE_CONTENT = `Hi,

Welcome to notedown. Here you can edit this text to put anything you want like todo list, stuff you don't want to loose, ideas, reminders, etc.
Notedown will simply add a some syntax coloration to your text just like a code editor and it works on mobile.


# Here're some examples

You can put some text and *add* _fancy_ "styling" ~stuff~.
It also work with url like this http://test.com

- [ ] This is an item on a list
- [x] This one is done
- [√] Cool, it also works with √ char
- [?] Use ? to make it looks like a warning
- [!] And a ! to make it looks like something urgent
	- [ ] Yes you can indent
		- [x] And keep indenting
		- [ ] (parenthesize looks blue)
		- [ ] [brackets looks pink]


# How to save your notes?

You don't need to. At any time, you can leave this page and come back later. Your notes will be here.

If you're afraid to lose your notes or you want to retrieve them on another computer, use the [sign in] button on the top right corner. You'll be asked to connect your Google account and authorize notedown to modify the files made by the application (notedown won't be able to access your personal files on your Drive account). Your notes will now be saved on a small file created on your Drive account. Don't worry for the security of your data, notedown doesn't save anything on the server side. In fact, there no server side.


# Shortcuts

Because notedown is inspired by code editors, you can use shortcuts.

- [CMD + Z] Go back in modifications history (like cancelling)
- [CMD + SHIFT + Z] Go forward in the modifications history
- [CMD + SHIFT + D] Duplicate the line
- [ALT + ↑] Move the line up
- [ALT + ↓] Move the line down
- [ALT + LEFT CLICK] Add another text pointer where you're clicking (yes you can edit multiple lines at once!)


# The project

Notedown is an open source project and it's still in development. If you want to help or you are just curious, you can find the code here https://github.com/brunosimon/notedown
`

export default class Codedown
{
    constructor()
    {
        this.setCode()
        this.setGoogleDriveAPI()
        this.setVisibilityToggle()
        this.setLogs()
        this.setInitialState()
        this.setController()
    }

    /**
     * Set code
     */
    setCode()
    {
        this.code = new Code()

        // At any update, save the code in localStorage
        this.code.on('update', () =>
        {
            window.localStorage.setItem('localVersion', this.code.codeMirror.getValue())
        })

        // After throttle update (when user stop doing changes), save in the google drive API
        this.code.on('throttleUpdate', () =>
        {
            this.googleDriveAPI.update(this.code.codeMirror.getValue())
        })

        // When save asked
        this.code.on('save', () =>
        {
            this.googleDriveAPI.update(this.code.codeMirror.getValue())
        })
    }

    /**
     * Set google drive API
     */
    setGoogleDriveAPI()
    {
        this.googleDriveAPI = new GoogleDriveAPI()

        // After fetching data from the drive API, update and unloack code
        this.googleDriveAPI.on('endFetch', (content) =>
        {
            // Update content only if changed
            if(content !== this.code.codeMirror.getValue())
            {
                const scrollInfo = this.code.codeMirror.getScrollInfo()
                const cursorInfo = this.code.codeMirror.getCursor()

                this.code.setValue(content, true)
                this.code.codeMirror.scrollTo(scrollInfo.left, scrollInfo.top)
                this.code.codeMirror.setCursor(cursorInfo)
            }

            if(this.code.locked)
            {
                this.code.unlock()
            }
        })

        // After creating a new file on the drive API, immediatly update it with the current code
        this.googleDriveAPI.on('endCreate', (content) =>
        {
            this.googleDriveAPI.update(this.code.codeMirror.getValue())
        })

        // When signing in or out
        this.googleDriveAPI.on('signedInUpdate', () =>
        {
            if(this.googleDriveAPI.isSignedIn)
            {
                alert('Congratulation! Notedown can now save your notes on your Drive')
            }
            else
            {
                alert('Be carefull, changes won\'t be saved on your Drive anymore')
            }
        })
    }

    /**
     * Set visibility toggle
     */
    setVisibilityToggle()
    {
        // Listen to visibility change (entering and living the "window" or the "tab")
        document.addEventListener('visibilitychange', () =>
        {
            // Document hide
            // Save and lock code
            if(document.hidden)
            {
                this.logs.addMessage('document > hide')
                this.googleDriveAPI.update(this.code.codeMirror.getValue())

                this.code.lock()
            }

            // Document show
            // Lock code and fetch potentially changed data
            else
            {
                this.logs.addMessage('document > show')

                this.code.lock()
                this.googleDriveAPI.fetch()
            }
        })
    }

    /**
     * Set logs
     */
    setLogs()
    {
        this.logs = new Logs()

        // Code
        this.code.on('throttleUpdate', () => this.logs.addMessage('code > throttleUpdate'))
        this.code.on('save', () => this.logs.addMessage('code > save'))

        // Google drive API
        this.googleDriveAPI.on('apiLoaded', () => this.logs.addMessage('api > apiLoaded'))
        this.googleDriveAPI.on('apiReady', () => this.logs.addMessage('api > apiReady'))
        this.googleDriveAPI.on('signedInUpdate', () => this.logs.addMessage('api > signedInUpdate'))
        this.googleDriveAPI.on('errorInit', () => this.logs.addMessage('api > errorInit', 'urgent'))
        this.googleDriveAPI.on('listError', () => this.logs.addMessage('api > listError', 'urgent'))
        this.googleDriveAPI.on('startFetch', () => this.logs.addMessage('api > startFetch'))
        this.googleDriveAPI.on('endFetch', () => this.logs.addMessage('api > endFetch'))
        this.googleDriveAPI.on('errorFetch', () => this.logs.addMessage('api > errorFetch', 'urgent'))
        this.googleDriveAPI.on('startCreate', () => this.logs.addMessage('api > startCreate'))
        this.googleDriveAPI.on('endCreate', () => this.logs.addMessage('api > endCreate'))
        this.googleDriveAPI.on('errorCreate', () => this.logs.addMessage('api > errorCreate', 'urgent'))
        this.googleDriveAPI.on('startUpdate', () => this.logs.addMessage('api > startUpdate'))
        this.googleDriveAPI.on('endUpdate', () => this.logs.addMessage('api > endUpdate'))
        this.googleDriveAPI.on('errorUpdate', () => this.logs.addMessage('api > errorUpdate', 'urgent'))
    }

    /**
     * Set initial state
     */
    setInitialState()
    {
        // Try to get the local version in localstorage
        const localVersion = window.localStorage.getItem('localVersion')

        // Lock the code while the google drive API isn't ready
        this.code.lock()

        // Found a local version
        if(localVersion)
        {
            this.logs.addMessage('use local version')

            // Set the value
            this.code.setValue(localVersion, true)
        }

        // Wait for the API to be ready
        this.googleDriveAPI.on('apiReady', () =>
        {
            // If user is not signed in
            if(!this.googleDriveAPI.isSignedIn)
            {
                // If no local version, put the default content
                if(!localVersion || localVersion === '')
                {
                    this.logs.addMessage('first time')
                    this.code.setValue(BASE_CONTENT, true)
                }

                // Unlock the code
                this.code.unlock()
            }
        })
    }

    /**
     * Set the controller
     */
    setController()
    {
        this.controller = new Controller()
    }
}
