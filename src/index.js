import CodeMirror from 'codemirror'
import 'codemirror/addon/mode/simple.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/lib/codemirror.css'

import './style.styl'


const $textarea = document.createElement('textarea')
$textarea.innerHTML = `
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur ver. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam maiores aperiam pariatur explicabo odio dicta culpa perspiciatis aliquid nihil sapiente labore asperiores, exercitationem possimus esse blanditiis, quas repellendus non voluptate!
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
        // The start state contains the rules that are intially used
        start:
        [
            { regex: /\s*#.+/, sol: true, token: 'title' },
            { regex: /\(.+\)/, token: 'parenthesis' },
            { regex: /(\[)([√xX])(])(\s)(.+)/, token: [null, 'checked', null, null, 'checked-value'] },
            { regex: /(\[)([!])(])(\s)(.+)/, token: [null, 'danger', null, null, 'danger-value'] },
            { regex: /(\[)([?])(])(\s)(.+)/, token: [null, 'warning', null, null, 'warning-value'] },
            { regex: /\[\s]/, token: '' },
            { regex: /\[.+\]/, token: 'brackets' }

            // { regex: /test/, token: 'test2' },
            // // The regex matches the token, the token property contains the type
            // { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
            // // You can match multiple tokens at once. Note that the captured
            // // groups must span the whole string in this case
            // { regex: /(function)(\s+)([a-z$][\w$]*)/, token: ['keyword', null, 'variable-2'] },
            // // Rules are matched in the order in which they appear, so there is
            // // no ambiguity between this one and the one above
            // { regex: /(?:function|var|return|if|for|while|else|do|this)\b/, token: 'keyword' },
            // { regex: /true|false|null|undefined/, token: 'atom' },
            // { regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: 'number' },
            // { regex: /\/\/.*/, token: 'comment' },
            // { regex: /\/(?:[^\\]|\\.)*?\//, token: 'variable-3' },
            // // A next property will cause the mode to move to a different state
            // { regex: /\/\*/, token: 'comment', next: 'comment' },
            // { regex: /[-+\/*=<>!]+/, token: 'operator' },
            // // indent and dedent properties guide autoindentation
            // { regex: /[\{\[\(]/, indent: true },
            // { regex: /[\}\]\)]/, dedent: true },
            // { regex: /[a-z$][\w$]*/, token: 'variable' },
            // // You can embed other modes with the mode property. This rule
            // // causes all code between << and >> to be highlighted with the XML
            // // mode.
            // { regex: /<</, token: "meta", mode: { spec: 'xml', end: />>/ } }
        ],
        // The multi-line comment state.
        comment: [
            { regex: /.*?\*\//, token: 'comment', next: 'start' },
            { regex: /.*/, token: 'comment' }
        ],
        // The meta property contains global information about the mode. It
        // can contain properties like lineComment, which are supported by
        // all modes, and also directives like dontIndentStates, which are
        // specific to simple modes.
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