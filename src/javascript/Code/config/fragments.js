export default
{
    lines:
    [
        {
            regex: /\s*#+(.+)/,
            replacement: '<span class="title">$0</span>'
        }
    ],
    sub:
    [
        {
            regex: /http/,
            replacement: '<a href="$0"></a>'
        }
    ]
}
