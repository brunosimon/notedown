export default class Cursor
{
    constructor()
    {
        // Element
        this.$element = document.createElement('div')
        this.$element.classList.add('cursor')

        // Bar
        this.$bar = document.createElement('div')
        this.$bar.classList.add('bar')
        this.$element.appendChild(this.$bar)

        // Set
        this.active = false

        this.start = { line: 0, row: 0 }
        this.end = { line: 0, row: 0 }
    }
}
