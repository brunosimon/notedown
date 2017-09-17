import CodeMirror from 'codemirror'
import 'codemirror/addon/mode/simple.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/lib/codemirror.css'

import './style.styl'

// Drive
const authorizeButton = document.createElement('button')
authorizeButton.style.position = 'absolute'
authorizeButton.style.top = '0'
authorizeButton.style.left = '0'
authorizeButton.style.zIndex = 1
authorizeButton.innerText = 'authorize-button'

document.body.appendChild(authorizeButton)

const signoutButton = document.createElement('button')
signoutButton.style.position = 'absolute'
signoutButton.style.top = '20px'
signoutButton.style.left = '0'
signoutButton.style.zIndex = 1
signoutButton.innerText = 'signout-button'

document.body.appendChild(signoutButton)

const CLIENT_ID = '410247995746-9pfn735ilt6m7giqmmjiq93jr1bca5vr.apps.googleusercontent.com'
const API_KEY = 'AIzaSyDDXgOOeN_6c5P7aJ3PqGUKRLD3Pbocdto'
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
const SCOPES = [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file'
].join(' ')

const initClient = () =>
{
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() =>
    {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())

        authorizeButton.addEventListener('click', () =>
        {
            gapi.auth2.getAuthInstance().signIn()
        })
        signoutButton.addEventListener('click', () =>
        {
            gapi.auth2.getAuthInstance().signOut()
        })
    })
}

const updateSigninStatus = (isSignedIn) =>
{
    if(isSignedIn)
    {
        authorizeButton.style.display = 'none'
        signoutButton.style.display = 'block'

        // // List files
        // gapi.client.drive.files.list({
        //     pageSize: 10,
        //     fields: 'nextPageToken, files(id, name)'
        // }).then((response) =>
        // {
        //     console.log(response)
        // })

        const body = { test: 'uh' }

        gapi.client.drive.files.create(
            {
                resource:
                {
                    title: 'config.json',
                    parents: [{ id: 'appDataFolder' }] // { id: 'appDataFolder' }
                },
                media:
                {
                    mimeType: 'application/json',
                    body
                },
                fields: 'id'
            }
        ).execute((error, file) =>
        {
            if(error)
            {
                console.log(error)
            }
            else
            {
                console.log('File Id:', file.id)
            }
        })
    }
    else
    {
        authorizeButton.style.display = 'block'
        signoutButton.style.display = 'none'
    }
}

gapi.load('client:auth2', initClient)

// Code
const $textarea = document.querySelector('textarea')
$textarea.innerHTML = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur ver. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam maiores aperiam pariatur explicabo odio dicta culpa perspiciatis aliquid nihil sapiente labore asperiores, exercitationem possimus esse blanditiis, quas repellendus non voluptate!
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
document.body.appendChild($textarea)

CodeMirror.defineSimpleMode(
    'simplemode',
    {
        start:
        [
            { regex: /\s*#.+/, sol: true, token: 'title' },
            { regex: /\(.+\)/, token: 'parenthesis' },
            { regex: /(\[)([√xX])(])(\s)(.+)/, token: [null, 'checked', null, null, 'checked-value'] },
            { regex: /(\[)([!])(])(\s)(.+)/, token: [null, 'danger', null, null, 'danger-value'] },
            { regex: /(\[)([?])(])(\s)(.+)/, token: [null, 'warning', null, null, 'warning-value'] },
            { regex: /\[\s]/, token: '' },
            { regex: /\[.+\]/, token: 'brackets' }
        ],
        comment: [
            { regex: /.*?\*\//, token: 'comment', next: 'start' },
            { regex: /.*/, token: 'comment' }
        ],
        meta:
        {
            dontIndentStates: ['comment'],
            lineComment: '//'
        }
    }
)

CodeMirror.fromTextArea(
    $textarea,
    {
        scrollbarStyle: 'simple',
        lineWrapping: true,
        indentUnit: 4
    }
)