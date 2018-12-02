export default class Line
{
    constructor(_text = '')
    {
        // Element
        this.$element = document.createElement('div')
        this.$element.classList.add('line')

        // Text
        this.$text = document.createElement('span')
        this.$text.classList.add('text')
        this.$element.appendChild(this.$text)

        // Set up
        this.originalText = null
        this.styledText = []

        // Set initial text
        this.setText(_text)
    }

    setText(_text)
    {
        // Didn't change
        if(_text === this.originalText)
        {
            return
        }

        this.originalText = _text

        this.updateStyled()
    }

    updateStyled()
    {
        this.styledText = [ this.originalText ]

        this.updateDOM()
    }

    updateDOM()
    {
        // Remove
        while(this.$text.children.length)
        {
            this.$text.children[0].remove()
        }

        // Add
        for(const _part of this.styledText)
        {
            const $part = document.createElement('span')
            $part.classList.add('part')
            $part.textContent = _part
            this.$text.appendChild($part)
        }
    }
}
