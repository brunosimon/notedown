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
        this.length = 0
        this.fragments = []

        // Set initial text
        this.setSelection()
        this.setFragments()
        this.updateText(_text)
    }

    setSelection()
    {
        this.selection = {}
        this.selection.$element = document.createElement('div')
        this.selection.$element.classList.add('selection')
        this.$element.appendChild(this.selection.$element)
    }

    setFragments()
    {
        this.fragments = {}
        this.fragments.$element = document.createElement('div')
        this.fragments.$element.classList.add('fragments')
        this.$element.appendChild(this.fragments.$element)
    }

    updateText(_text)
    {
        // Didn't change
        if(_text === this.originalText)
        {
            return
        }

        // Clear
        while(this.fragments.$element.children.length)
        {
            this.fragments.$element.children[0].remove()
        }

        // Update DOM
        if(_text === '')
        {
            this.fragments.$element.innerHTML = '&#8203'
        }
        else
        {
            // Create new fragments
            const fragments = [ ...fragmentsConfig ]
            const fragmentsHTML = this.applyFragments(_text, fragments)

            this.fragments.$element.innerHTML = fragmentsHTML
        }

        // Save
        this.originalText = _text
        this.length = this.originalText.length
    }

    applyFragments(_text, _fragments)
    {
        const fragmentIndex = _fragments.findIndex((_item) => _text.match(_item.regex))

        // No fragment found (end)
        if(fragmentIndex === -1)
        {
            return _text
        }

        // Extract fragment from fragments
        const fragment = _fragments[fragmentIndex]
        const newFragments = [ ..._fragments ]
        newFragments.splice(fragmentIndex, 1)

        // Find matches
        const matches = _text.match(fragment.regex)
        let text = fragment.replacement

        // Apply fragments to text before and after match
        let beforeText = _text.slice(0, matches.index)
        beforeText = beforeText !== '' ? this.applyFragments(beforeText, _fragments) : ''
        let afterText = _text.slice(matches.index + matches[0].length, _text.length)
        afterText = afterText !== '' ? this.applyFragments(afterText, _fragments) : ''

        // Apply fragments to matches parts
        for(let i = 0; i < matches.length; i++)
        {
            let _match = matches[i]
            if(i > 0 && !fragment.noSubFragments)
            {
                _match = this.applyFragments(_match, newFragments)
            }

            text = text.replace(new RegExp(`\\$${i}`, 'g'), _match)
        }

        // Concatenate
        text = `${beforeText}${text}${afterText}`

        // Return
        return text
    }

    updateSelection(_startX, _endX)
    {
        this.selection.$element.style.left = `${_startX}px`
        this.selection.$element.style.width = `${_endX - _startX}px`
    }
}
