import fragmentsConfig from './config/fragments.js'

export default class Line
{
    constructor(_text = '')
    {
        // Element
        this.$element = document.createElement('pre')
        this.$element.classList.add('line')

        // Set up
        this.originalText = null
        this.fragments = []

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
        this.fragments = {}
        this.fragments.$element = document.createElement('div')
        this.fragments.$element.classList.add('fragment')
        this.$element.appendChild(this.fragments.$element)

        this.fragments.items = []
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
        for(const _fragment of fragmentsConfig.lines)
        {
            const lineMatches = this.originalText.match(_fragment.regex)
            let fragmented = _fragment.replacement

            if(lineMatches)
            {
                // console.log(lineMatches)
                let i = 0
                for(const _match of lineMatches)
                {
                    console.log(_match)
                    fragmented = fragmented.replace(`$${i}`, _match)
                    i++
                }

                console.log(fragmented)
            }
            // const fragmented = this.originalText.replace(_fragment.regex, _fragment.replacement)
            // console.log(fragmented)
        }
        this.fragments.items = [ this.originalText ]

        this.updateDOM()
    }

    updateDOM()
    {
        // Remove
        while(this.fragments.$element.children.length)
        {
            this.fragments.$element.children[0].remove()
        }

        // Add
        for(const _fragment of this.fragments.items)
        {
            const $fragment = document.createElement('span')
            $fragment.classList.add('fragment')
            if(this.fragments.length === 1 && _fragment === '')
            {
                $fragment.innerHTML = '&#8203;'
            }
            else
            {
                $fragment.textContent = _fragment
            }
            this.fragments.$element.appendChild($fragment)
        }
    }

    updateSelection(_startX, _endX)
    {
        this.selection.$element.style.left = `${_startX}px`
        this.selection.$element.style.width = `${_endX - _startX}px`
    }
}
