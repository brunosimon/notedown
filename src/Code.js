import CodeMirror from 'codemirror'
import 'codemirror/addon/mode/simple.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/lib/codemirror.css'

import EventEmitter from './EventEmitter.js'

export default class Code extends EventEmitter
{
    constructor()
    {
        super()

        this.locked = false

        // Textarea
        this.$textarea = document.querySelector('.js-textarea')

        // Use code mirror simple mode
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
                comment:
                [
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

        // Update key mapping
        CodeMirror.keyMap.default['Shift-Tab'] = 'indentLess'
        CodeMirror.keyMap.default['Shift-Cmd-D'] = (codeMirror) =>
        {
            const currentLine = codeMirror.getCursor().line
            codeMirror.replaceRange(`${codeMirror.getLine(currentLine)}\n`, { line: currentLine, ch: 0 })
        }
        CodeMirror.keyMap.default['Shit-Ctrl-D'] = (codeMirror) =>
        {
            const currentLine = codeMirror.getCursor().line
            codeMirror.replaceRange(`${codeMirror.getLine(currentLine)}\n`, { line: currentLine, ch: 0 })
        }
        CodeMirror.keyMap.default['Cmd-S'] = (codeMirror) =>
        {
            this.trigger('save')
        }
        CodeMirror.keyMap.default['Ctrl-S'] = (codeMirror) =>
        {
            this.trigger('save')
        }

        // Set code mirror
        this.codeMirror = CodeMirror.fromTextArea(
            this.$textarea,
            {
                scrollbarStyle: 'simple',
                lineWrapping: true,
                indentUnit: 4
            }
        )

        // Get and set latest version from localstorage
        const latestVersion = window.localStorage.getItem('latestVersion')
        if(latestVersion)
        {
            this.lock()
            this.codeMirror.setValue(latestVersion)
        }

        this.codeMirror.on('change', () =>
        {
            this.trigger('update')

            window.localStorage.setItem('latestVersion', this.codeMirror.getValue())

            if(this.updateTimeout)
            {
                window.clearTimeout(this.updateTimeout)
                this.updateTimeout = null
            }

            this.updateTimeout = window.setTimeout(() =>
            {
                this.trigger('throttleUpdate')
                this.updateTimeout = null
            }, 1000)
        })

        this.updateTimeout = null
    }

    /**
     * Lock to prevent modification
     */
    lock()
    {
        this.codeMirror.setOption('readOnly', true)
        this.codeMirror.display.wrapper.classList.add('locked')

        this.locked = true
    }

    /**
     * Unlock to prevent modification
     */
    unlock()
    {
        this.codeMirror.setOption('readOnly', false)
        this.codeMirror.display.wrapper.classList.remove('locked')

        this.locked = false
    }
}
