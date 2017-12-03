import EventEmitter from './EventEmitter.js'

const CLIENT_ID = '410247995746-9pfn735ilt6m7giqmmjiq93jr1bca5vr.apps.googleusercontent.com'
const API_KEY = 'AIzaSyDDXgOOeN_6c5P7aJ3PqGUKRLD3Pbocdto'
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const SCOPES = 'https://www.googleapis.com/auth/drive.file'
const FILE_NAME = 'notedown'

const BASE_CONTENT = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur ver. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam maiores aperiam pariatur explicabo odio dicta culpa perspiciatis aliquid nihil sapiente labore asperiores, exercitationem possimus esse blanditiis, quas repellendus non voluptate!
Omagni sunt exercitationem, rem accusamus quidem dolor
Reprehenderit repellendus perferendis nam a. Delectus, commodi illum quas

Explicabo veniam, perspiciatis.


# This is a list
- Lorem
- Ipsum (with parentheses)
- Dolor
- Site amet [Something inside brackets]
- And that "a string"

# This is an indented list
- Lorem
    - Ipsum
    - Dolor

# This is a todo list
- [ ] Clean house
- [x] Buy stuff
- [ ] Do homework
- [!] Call mum
- [√] Feed dog
- [ ] Cool project
    - [√] Design
    - [?] Website
    - [ ] Application

# Hey look, it’s a folded title
`

export default class GoogleDriveAPI extends EventEmitter
{
    constructor()
    {
        super()

        this.gapi = window.gapi
        console.log(this.gapi)

        // Init the google API
        this.gapi
            .load('client:auth2', () =>
            {
                console.log('init')
                this.gapi.client
                    .init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES
                    })
                    .catch(() =>
                    {
                        console.log('catch')
                    })
                    .then(() =>
                    {
                        console.log('init then')
                        this.setButtons()

                        this.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) =>
                        {
                            this.signinStatusUpdate(isSignedIn)
                        })

                        this.signinStatusUpdate(this.gapi.auth2.getAuthInstance().isSignedIn.get())
                    })
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
            this.gapi.auth2.getAuthInstance().signIn()
        })

        this.$signOutButton.addEventListener('click', (event) =>
        {
            event.preventDefault()
            this.gapi.auth2.getAuthInstance().signOut()
        })
    }

    /**
     *
     */
    signinStatusUpdate(isSignedIn)
    {
        console.log('signinStatusUpdate', isSignedIn)
        if(isSignedIn)
        {
            // Update buttons
            this.$signInButton.style.display = 'none'
            this.$signOutButton.style.display = 'block'

            /**
             * List files
             */
            this.gapi.client.drive.files
                .list({
                    // spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name, webContentLink)',
                    pageSize: 100
                })
                .execute((response) =>
                {
                    const file = response.files.find((file) => file.name === FILE_NAME)

                    // File doesn't exist
                    if(!file)
                    {
                        this.createFile(FILE_NAME, BASE_CONTENT, (file) =>
                        {
                            this.trigger('contentFetched', [BASE_CONTENT])
                        })
                    }
                    // File exist
                    else
                    {
                        this.file = file

                        // Download
                        this.downloadFile(this.file.id, (content) =>
                        {
                            this.trigger('contentFetched', [content])
                        })
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
     * Update file using request
     */
    updateFile(fileId, data = '', callback = null)
    {
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
            path: '/upload/drive/v3/files/' + fileId,
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

        request.execute(callback)
    }

    /**
     * Create file using request
     */
    createFile(name, data = '', callback = null)
    {
        const boundary = '-------314159265358979323846'
        const delimiter = `\r\n--${boundary}\r\n`
        const closeDelim = `\r\n--${boundary}--`

        const contentType = 'text/plain'

        const metadata = {
            name: name,
            parents: [],
            mimeType: contentType
        };

        const multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${JSON.stringify(metadata)}${delimiter}Content-Type: ${contentType}\r\n\r\n${data}${closeDelim}`

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

        request.execute(callback)
    }

    /**
     * Download file
     */
    downloadFile(fileId, callback = null)
    {
        const accessToken = this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token

        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media', true)
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
        xhr.onload = () =>
        {
            if(typeof callback === 'function')
            {
                callback(xhr.responseText)
            }
        }
        xhr.onerror = () =>
        {
            if(typeof callback === 'function')
            {
                callback(false)
            }
        }
        xhr.send()
    }
}
