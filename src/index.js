import 'codemirror/lib/codemirror.css'
import './style.sass'

import GoogleDriveAPI from './GoogleDriveAPI.js'
import Code from './Code.js'

const code = new Code()

code.on('throttleUpdate', () =>
{
    googleDriveAPI.updateFile(googleDriveAPI.file.id, code.codeMirror.getValue())
})

code.on('save', () =>
{
    googleDriveAPI.updateFile(googleDriveAPI.file.id, code.codeMirror.getValue())
})

const googleDriveAPI = new GoogleDriveAPI()

googleDriveAPI.on('contentFetched', (content) =>
{
    code.codeMirror.setValue(content)
})
