import CodeMirror from 'codemirror'
import 'codemirror/addon/mode/simple.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/fold/foldgutter.css'

import EventEmitter from './EventEmitter.js'

export default class Code extends EventEmitter
{
    constructor()
    {
        super()

        this.locked = false
        this.preventUpdate = false

        // Textarea
        this.$textarea = document.querySelector('.js-textarea')

        // Use code mirror simple mode
        CodeMirror.defineSimpleMode(
            'simplemode',
            {
                start:
                [
                    { regex: /\s*#.+/, sol: true, token: 'title' },
                    { regex: /(\[)([√xX])(])(\s)(.+)/, token: [null, 'checked', null, null, 'checked-value'] },
                    { regex: /(\[)([!])(])(\s)(.+)/, token: [null, 'danger', null, null, 'danger-value'] },
                    { regex: /(\[)([?])(])(\s)(.+)/, token: [null, 'warning', null, null, 'warning-value'] },
                    { regex: /\[\s]/, token: '' },
                    { regex: /\([^)]+\)/, token: 'parenthesis' },
                    { regex: /\[[^\]]+\]/, token: 'brackets' },
                    { regex: /(")([^"]+)(")/, token: [null, 'italic', null] },
                    { regex: /(\*)([^\*]+)(\*)/, token: [null, 'bold', null] },
                    { regex: /(_)([^_]+)(_)/, token: [null, 'underline', null] },
                    { regex: /(~)([^~]+)(~)/, token: [null, 'lineThrough', null] },
                    { regex: new RegExp(/(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/i), token: 'underline' }
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

        // Commands
        CodeMirror.commands.swapLineUp = (cm) =>
        {
            if(cm.isReadOnly())
            {
                return CodeMirror.Pass
            }

            const ranges = cm.listSelections()
            const linesToMove = []
            let at = cm.firstLine() - 1
            const newSels = []

            for(var i = 0; i < ranges.length; i++)
            {
                const range = ranges[i]
                const from = range.from().line - 1
                let to = range.to().line

                newSels.push({
                    anchor: CodeMirror.Pos(range.anchor.line - 1, range.anchor.ch),
                    head: CodeMirror.Pos(range.head.line - 1, range.head.ch)
                })

                if(range.to().ch == 0 && !range.empty())
                {
                    --to
                }

                if(from > at)
                {
                    linesToMove.push(from, to)
                }
                else if (linesToMove.length)
                {
                    linesToMove[linesToMove.length - 1] = to
                }

                at = to
            }

            cm.operation(() =>
            {
                for (let i = 0; i < linesToMove.length; i += 2)
                {
                    const from = linesToMove[i], to = linesToMove[i + 1]
                    const line = cm.getLine(from)

                    cm.replaceRange('', CodeMirror.Pos(from, 0), CodeMirror.Pos(from + 1, 0), '+swapLine')

                    if(to > cm.lastLine())
                    {
                        cm.replaceRange('\n' + line, CodeMirror.Pos(cm.lastLine()), null, '+swapLine')
                    }
                    else
                    {
                        cm.replaceRange(line + '\n', CodeMirror.Pos(to, 0), null, '+swapLine')
                    }
                }

                cm.setSelections(newSels)
                cm.scrollIntoView()
            })
        }

        CodeMirror.commands.swapLineDown = (cm) =>
        {
            if(cm.isReadOnly())
            {
                return CodeMirror.Pass
            }

            const ranges = cm.listSelections()
            const linesToMove = []
            let at = cm.lastLine() + 1

            for(let i = ranges.length - 1; i >= 0; i--)
            {
                const range = ranges[i]
                let from = range.to().line + 1
                const to = range.from().line

                if(range.to().ch == 0 && !range.empty())
                {
                    from--
                }

                if (from < at)
                {
                    linesToMove.push(from, to)
                }
                else if(linesToMove.length)
                {
                    linesToMove[linesToMove.length - 1] = to
                }

                at = to
            }

            cm.operation(() =>
            {
                for(let i = linesToMove.length - 2; i >= 0; i -= 2)
                {
                    const from = linesToMove[i], to = linesToMove[i + 1]
                    const line = cm.getLine(from)

                    if(from == cm.lastLine())
                    {
                        cm.replaceRange('', CodeMirror.Pos(from - 1), CodeMirror.Pos(from), '+swapLine')
                    }
                    else
                    {
                        cm.replaceRange('', CodeMirror.Pos(from, 0), CodeMirror.Pos(from + 1, 0), '+swapLine')
                        cm.replaceRange(line + '\n', CodeMirror.Pos(to, 0), null, '+swapLine')
                    }
                }

                cm.scrollIntoView()
            })
        }

        // Update key mapping
        const duplicateLine = (codeMirror) =>
        {
            const currentLine = codeMirror.getCursor().line
            codeMirror.replaceRange(`${codeMirror.getLine(currentLine)}\n`, { line: currentLine, ch: 0 })
        }
        const save = (codeMirror) =>
        {
            this.trigger('save')
        }

        CodeMirror.keyMap.default['Alt-Up'] = 'swapLineUp'
        CodeMirror.keyMap.default['Alt-Down'] = 'swapLineDown'
        CodeMirror.keyMap.default['Shift-Tab'] = 'indentLess'
        CodeMirror.keyMap.default['Shift-Cmd-D'] = duplicateLine
        CodeMirror.keyMap.default['Shift-Ctrl-D'] = duplicateLine
        CodeMirror.keyMap.default['Cmd-S'] = save
        CodeMirror.keyMap.default['Ctrl-S'] = save

        // Set code mirror
        this.codeMirror = CodeMirror.fromTextArea(
            this.$textarea,
            {
                // lineNumbers: true,
                foldGutter:
                {
                    rangeFinder: CodeMirror.fold.indent
                },
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],

                scrollbarStyle: 'simple',
                lineWrapping: true,
                indentUnit: 4
            }
        )

        this.codeMirror.on('change', () =>
        {
            // Don't prevent update
            if(!this.preventUpdate)
            {
                // Trigger
                this.trigger('update')

                // Wait a few time then trigger the throttle update
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
            }

            // Reset prevent update
            this.preventUpdate = false
        })

        this.updateTimeout = null
    }

    /**
     * Set value
     */
    setValue(value, preventUpdate = false)
    {
        this.preventUpdate = preventUpdate
        this.codeMirror.setValue(value)
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
