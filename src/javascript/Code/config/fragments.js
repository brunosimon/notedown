export default
[
    {
        regex: /(\s*)(#+.+)/,
        replacement: '$1<span class="title">$2</span>'
    },
    {
        regex: /(\s*-\s)(\[)(.)(])(\s+)(.+)/,
        replacement: '$1<span class="task-delimiter">$2</span><span class="task-status">$3</span><span class="task-delimiter">$4</span>$5<span class="task-value">$6</span>'
    },
    {
        regex: /(\()([^)]+)(\))/,
        replacement: '<span class="parenthese-delimiter">$1</span>$2<span class="parenthese-delimiter">$3</span>'
    }
]
