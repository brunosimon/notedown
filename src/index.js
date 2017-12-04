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

// On tab visibility change
document.addEventListener('visibilitychange', () =>
{
    // Document hide
    // Lock code
    if(document.hidden)
    {
        code.lock()
    }

    // Document show
    // Lock code and fetch potentially changed data
    else
    {
        code.lock()
        googleDriveAPI.fetch()
    }
})

// Google drive
const googleDriveAPI = new GoogleDriveAPI()

googleDriveAPI.on('endFetch', (content) =>
{
    code.codeMirror.setValue(content)

    if(code.locked)
    {
        code.unlock()
    }
})

googleDriveAPI.on('endCreate', (content) =>
{
    code.codeMirror.setValue(content)
})
