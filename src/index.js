import 'codemirror/lib/codemirror.css'
import './style.sass'

import Logs from './Logs.js'
import Code from './Code.js'
import GoogleDriveAPI from './GoogleDriveAPI.js'

/**
 * Logs
 */
const logs = new Logs()

/**
 * Code
 */
const code = new Code()
window.code = code

code.on('throttleUpdate', () =>
{
    logs.addMessage('code > throttleUpdate')
    googleDriveAPI.update(code.codeMirror.getValue())
})

code.on('save', () =>
{
    logs.addMessage('code > save')
    googleDriveAPI.update(code.codeMirror.getValue())
})

// Logs
code.on('throttleUpdate', () => logs.addMessage('code > throttleUpdate'))
code.on('save', () => logs.addMessage('code > save'))

/**
 * Google Drive API
 */
const googleDriveAPI = new GoogleDriveAPI()

googleDriveAPI.on('endFetch', (content) =>
{
    const scrollInto = code.codeMirror.getScrollInfo()
    code.codeMirror.setValue(content)
    code.codeMirror.scrollTo(scrollInto.left, scrollInto.top)

    if(code.locked)
    {
        code.unlock()
    }
})

googleDriveAPI.on('endCreate', (content) =>
{
    code.codeMirror.setValue(content)
})

// Logs
googleDriveAPI.on('errorInit', () => logs.addMessage('api > errorInit', 'urgent'))
googleDriveAPI.on('fetchListError', () => logs.addMessage('api > fetchListError', 'urgent'))
googleDriveAPI.on('startFetch', () => logs.addMessage('api > startFetch'))
googleDriveAPI.on('endFetch', () => logs.addMessage('api > endFetch'))
googleDriveAPI.on('errorFetch', () => logs.addMessage('api > errorFetch', 'urgent'))
googleDriveAPI.on('startCreate', () => logs.addMessage('api > startCreate'))
googleDriveAPI.on('endCreate', () => logs.addMessage('api > endCreate'))
googleDriveAPI.on('errorCreate', () => logs.addMessage('api > errorCreate', 'urgent'))
googleDriveAPI.on('startUpdate', () => logs.addMessage('api > startUpdate'))
googleDriveAPI.on('endUpdate', () => logs.addMessage('api > endUpdate'))
googleDriveAPI.on('errorUpdate', () => logs.addMessage('api > errorUpdate', 'urgent'))

/**
 * Document visibility change
 */
document.addEventListener('visibilitychange', () =>
{
    // Document hide
    // Lock code
    if(document.hidden)
    {
        logs.addMessage('document > hide')

        code.lock()
    }

    // Document show
    // Lock code and fetch potentially changed data
    else
    {
        logs.addMessage('document > show')

        code.lock()
        googleDriveAPI.fetch()
    }
})
