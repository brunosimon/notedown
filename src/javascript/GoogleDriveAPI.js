import EventEmitter from './EventEmitter.js'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const API_KEY = process.env.GOOGLE_API_KEY
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const SCOPES = 'https://www.googleapis.com/auth/drive.file'
const FILE_NAME = 'notedown'

export default class GoogleDriveAPI extends EventEmitter
{
    constructor()
    {
        super()

        this.gapi = window.gapi
        this.authInstance = null

        this.isReady = false
        this.file = null

        // Init the google API
        this.gapi
            .load('client:auth2', () =>
            {
                this.gapi.client
                    .init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES
                    })
                    .catch(() =>
                    {
                        this.trigger('errorInit')
                    })
                    .then(() =>
                    {
                        this.isReady = true
                        this.authInstance = this.gapi.auth2.getAuthInstance()

                        this.setButtons()

                        this.authInstance.isSignedIn.listen((isSignedIn) =>
                        {
                            this.isSignedIn = isSignedIn

                            this.trigger('signedInUpdate')
                            this.signInStatusUpdate()
                        })

                        this.isSignedIn = this.authInstance.isSignedIn.get()

                        this.signInStatusUpdate()

                        this.trigger('apiReady')
                    })

                this.trigger('apiLoaded')
            })
    }

    /**
     * Set buttons
     */
    setButtons()
    {
        // Retrieve buttons
        this.$signInButton = document.querySelector('.js-sign-in')
        this.$signOutButton = document.querySelector('.js-sign-out')

        // Listen to clicks
        this.$signInButton.addEventListener('click', (event) =>
        {
            event.preventDefault()
            this.authInstance.signIn()
        })

        this.$signOutButton.addEventListener('click', (event) =>
        {
            event.preventDefault()
            this.authInstance.signOut()
        })
    }

    /**
     * Sign in status update
     */
    signInStatusUpdate()
    {
        if(this.isSignedIn)
        {
            // Update buttons
            this.$signInButton.style.display = 'none'
            this.$signOutButton.style.display = 'block'

            // Fetch files
            this.gapi.client.drive.files
                .list({
                    // spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name, webContentLink)',
                    pageSize: 100
                })
                .execute((response) =>
                {
                    // Error
                    if(response.error)
                    {
                        this.authInstance.signIn().then(() =>
                        {
                            this.isSignedIn = this.authInstance.isSignedIn.get()

                            this.trigger('signedInUpdate')
                            this.signInStatusUpdate()
                        })
                        this.trigger('errorList')
                    }

                    // No error
                    else
                    {
                        const file = response.files.find((file) => file.name === FILE_NAME)

                        // File doesn't exist
                        // Create
                        if(!file)
                        {
                            this.create()
                        }

                        // File exist
                        // Fetch
                        else
                        {
                            this.file = file

                            // Download
                            this.fetch()
                        }
                    }
                })
        }
        else
        {
            this.$signInButton.style.display = 'block'
            this.$signOutButton.style.display = 'none'
        }
    }

    /**
     * Create
     */
    create()
    {
        // Not ready
        if(!this.isReady)
        {
            return
        }

        const boundary = '-------314159265358979323846'
        const delimiter = `\r\n--${boundary}\r\n`
        const closeDelim = `\r\n--${boundary}--`

        const contentType = 'text/plain'

        const metadata = {
            name: FILE_NAME,
            parents: [],
            mimeType: contentType
        }

        const multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${JSON.stringify(metadata)}${delimiter}Content-Type: ${contentType}\r\n\r\n${''}${closeDelim}`

        const request = this.gapi.client.request({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params:
            {
                uploadType: 'multipart'
            },
            headers:
            {
                'Content-Type': `multipart/related; boundary="${boundary}"`
            },
            body: multipartRequestBody
        })

        this.trigger('startCreate')

        request.execute((result) =>
        {
            // Error
            if(!result)
            {
                this.trigger('errorCreate')
            }

            // No error
            else
            {
                this.file = result
                this.trigger('endCreate')
            }
        })
    }

    /**
     * Update file using request
     */
    update(data = '')
    {
        // Not ready
        if(!this.isReady)
        {
            return
        }

        // No file
        if(!this.file)
        {
            return false
        }

        const boundary = '-------314159265358979323846'
        const delimiter = `\r\n--${boundary}\r\n`
        const closeDelim = `\r\n--${boundary}--`

        const contentType = 'text/plain';

        const metadata = {
            parents: [],
            mimeType: contentType
        }

        const multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${JSON.stringify(metadata)}${delimiter}Content-Type: ${contentType}\r\n\r\n${data}${closeDelim}`

        const request = this.gapi.client.request({
            path: '/upload/drive/v3/files/' + this.file.id,
            method: 'PATCH',
            params:
            {
                uploadType: 'multipart'
            },
            headers:
            {
                'Content-Type': `multipart/related; boundary="${boundary}"`
            },
            body: multipartRequestBody
        })

        this.trigger('startUpdate')

        request.execute((result) =>
        {
            // Error
            if(!result)
            {
                this.trigger('errorUpdate')
            }

            // No error
            else
            {
                this.file = result
                this.trigger('endUpdate')
            }
        })
    }

    /**
     * Fetch
     */
    fetch()
    {
        // Not ready
        if(!this.isReady)
        {
            return false
        }

        // No file
        if(!this.file)
        {
            return false
        }

        // Retrieve token
        const accessToken = this.authInstance.currentUser.get().getAuthResponse().access_token

        // Start fetching
        this.trigger('startFetch')

        fetch(
            `https://www.googleapis.com/drive/v3/files/${this.file.id}?alt=media`,
            {
                method: 'get',
                headers:
                {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .then((response) =>
            {
                if(response.status === 200)
                {
                    return response.text()
                }
                else
                {
                    this.authInstance.signIn()
                    console.log('isSignedIn', this.authInstance.isSignedIn.get())
                    throw 'Response status != 200'
                }
            })
            .catch((error) =>
            {
                console.log('error', error)
                this.trigger('errorFetch')
            })
            .then((result) =>
            {
                if(result)
                {
                    this.trigger('endFetch', [result])
                }
            })
    }
}
