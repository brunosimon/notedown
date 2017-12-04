import 'codemirror/lib/codemirror.css'
import './style.sass'

import GoogleDriveAPI from './GoogleDriveAPI.js'
import Code from './Code.js'

// Code
const code = new Code()

code.on('throttleUpdate', () =>
{
    googleDriveAPI.update(code.codeMirror.getValue())
})

code.on('save', () =>
{
    googleDriveAPI.update(code.codeMirror.getValue())
})

// Window focus
window.addEventListener('focus', () =>
{
    // alert('focus')
})

// Google drive
const googleDriveAPI = new GoogleDriveAPI()

googleDriveAPI.on('fetch', (content) =>
{
    code.codeMirror.setValue(content)
})

googleDriveAPI.on('create', (content) =>
{
    code.codeMirror.setValue(content)
})
