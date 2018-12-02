export default class Line
{
    constructor(_text = '')
    {
        // Element
        this.$element = document.createElement('pre')
        this.$element.classList.add('line')

        // Set up
        this.originalText = null
        this.styledText = []

        // Set initial text
        this.setSelection()
        this.setParts()
        this.updateText(_text)
    }

    setSelection()
    {
        this.selection = {}
        this.selection.$element = document.createElement('div')
        this.selection.$element.classList.add('selection')
        this.$element.appendChild(this.selection.$element)
    }

    setParts()
    {
        this.parts = {}
        this.parts.$element = document.createElement('div')
        this.parts.$element.classList.add('parts')
        this.$element.appendChild(this.parts.$element)
    }

    updateText(_text)
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
        while(this.parts.$element.children.length)
        {
            this.parts.$element.children[0].remove()
        }

        // Add
        for(const _part of this.styledText)
        {
            const $part = document.createElement('span')
            $part.classList.add('part')
            if(this.styledText.length === 1 && _part === '')
            {
                $part.innerHTML = '&#8203;'
            }
            else
            {
                $part.textContent = _part
            }
            this.parts.$element.appendChild($part)
        }
    }

    updateSelection(_startX, _endX)
    {
        this.selection.$element.style.left = `${_startX}px`
        this.selection.$element.style.width = `${_endX - _startX}px`
    }
}
