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

            if(this.changeTimeout)
            {
                window.clearTimeout(this.changeTimeout)
                this.changeTimeout = null
            }

            this.changeTimeout = window.setTimeout(() =>
            {
                this.trigger('throttleUpdate')
                this.changeTimeout = null
            }, 1000)
        })

        this.changeTimeout = null
    }
}
