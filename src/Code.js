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

        // Textarea
        this.$textarea = document.querySelector('textarea')

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

        this.codeMirror.on('change', () =>
        {
            this.trigger('update')

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
    }

    /**
     * Unlock to prevent modification
     */
    unlock()
    {
        this.codeMirror.setOption('readOnly', false)
    }
}
