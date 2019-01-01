export default
[
    // Title
    {
        regex: /^(\s*)(#+.+)/,
        replacement: '$1<span class="title">$2</span>'
    },
    // Task success
    {
        regex: /(\s*-\s)(\[)([√xX])(])(\s*)(.*)/,
        replacement: '<span class="success">$1<span class="task-delimiter">$2</span><span class="task-value">$3</span><span class="task-delimiter">$4</span>$5<span class="task-description">$6</span></span>'
    },
    // Task danger
    {
        regex: /(\s*-\s)(\[)([!])(])(\s*)(.*)/,
        replacement: '<span class="danger">$1<span class="task-delimiter">$2</span><span class="task-value">$3</span><span class="task-delimiter">$4</span>$5<span class="task-description">$6</span></span>'
    },
    // Task warning
    {
        regex: /(\s*-\s)(\[)([?])(])(\s*)(.*)/,
        replacement: '<span class="warning">$1<span class="task-delimiter">$2</span><span class="task-value">$3</span><span class="task-delimiter">$4</span>$5<span class="task-description">$6</span></span>'
    },
    // Task empty
    {
        regex: /(\s*-\s)(\[)([ ])(])(\s*)(.*)/,
        replacement: '<span class="empty">$1<span class="task-delimiter">$2</span><span class="task-value">$3</span><span class="task-delimiter">$4</span>$5<span class="task-description">$6</span></span>'
    },
    // Task canceled
    {
        regex: /(\s*-\s)(\[)([-])(])(\s*)(.*)/,
        replacement: '<span class="canceled">$1<span class="task-delimiter">$2</span><span class="task-value">$3</span><span class="task-delimiter">$4</span>$5<span class="task-description">$6</span></span>'
    },
    // Parenthesis
    {
        regex: /(\()([^)]+)(\))/,
        replacement: '<span class="parenthesis"><span class="parenthesis-delimiter">$1</span>$2<span class="parenthesis-delimiter">$3</span></span>'
    },
    // Brackets
    {
        regex: /(\[)([^\]]+)(\])/,
        replacement: '<span class="brackets"><span class="bracket-delimiter">$1</span>$2<span class="bracket-delimiter">$3</span></span>'
    },
    // Strong
    {
        regex: /(\*)([^*]+)(\*)/,
        replacement: '<span class="strong"><span class="strong-delimiter">$1</span><span class="strong-value">$2</span><span class="strong-delimiter">$3</span></span>'
    },
    // Quote
    {
        regex: /(")([^"]+)(")/,
        replacement: '<span class="quote"><span class="quote-delimiter">$1</span><span class="quote-value">$2</span><span class="quote-delimiter">$3</span></span>'
    },
    // Strike
    {
        regex: /(~)([^~]+)(~)/,
        replacement: '<span class="strike"><span class="strike-delimiter">$1</span><span class="strike-value">$2</span><span class="strike-delimiter">$3</span></span>'
    },
    // Link
    {
        regex: /(?:ftp|http|https|file):\/\/(?:\w+:{0,1}\w*@)?(?:\S+)(?::[0-9]+)?(?:\/|\/(?:[\w#!:.?+=&%@!\-/]))?/,
        replacement: '<a href="$0" target="_blank" draggable="false" class="link">$0</a>',
        noSubFragments: true
    },
    // Comment
    {
        regex: /\/\/.+/,
        replacement: '<span class="comment">$0</span>'
    }
]
