export default class Controller
{
    /**
     * Constructor
     */
    constructor()
    {
        this.shouldOpen = false
        this.canOpen = true
        this.opened = false
        this.$container = document.querySelector('.js-controller')
        this.$area = this.$container.querySelector('.js-area')

        this.setPosition()
        this.setItems()
        this.setDesktopGesture()
        this.setLoop()
    }

    /**
     * Set position
     */
    setPosition()
    {
        this.position = {}
        this.position.target = { x: 200, y: 200 }
        this.position.current = { x: this.position.target.x, y: this.position.target.y }
        this.position.rounded = { x: this.position.target.x, y: this.position.target.y }

        this.$container.style.transform = `translateX(${this.position.rounded.x}px) translateY(${this.position.rounded.y}px)`
    }

    /**
     * Set items
     */
    setItems()
    {
        this.items = []

        const $items = this.$container.querySelectorAll('.js-item')

        let index = 0

        for(const $item of $items)
        {
            const item = {}

            item.$element = $item
            item.current = {}
            item.current.x = 0
            item.current.y = 0
            item.target = {}
            item.target.x = 0
            item.target.y = 0
            item.rounded = {}
            item.rounded.x = 0
            item.rounded.y = 0
            item.index = index

            this.items.push(item)

            index++
        }
    }

    /**
     * Set desktop gesture
     */
    setDesktopGesture()
    {
        /**
         * Container position
         */
        const previous = { x: 0, y: 0 }

        const mouseDownCallback = (event) =>
        {
            event.preventDefault()

            previous.x = event.clientX
            previous.y = event.clientY

            window.addEventListener('mousemove', mouseMoveCallback)
            window.addEventListener('mouseup', mouseUpCallback)
        }

        const mouseMoveCallback = (event) =>
        {
            event.preventDefault()

            const offset = {}
            offset.x = event.clientX - previous.x
            offset.y = event.clientY - previous.y

            previous.x = event.clientX
            previous.y = event.clientY

            this.position.target.x += offset.x
            this.position.target.y += offset.y
        }

        const mouseUpCallback = (event) =>
        {
            event.preventDefault()

            window.removeEventListener('mousemove', mouseMoveCallback)
            window.removeEventListener('mouseup', mouseUpCallback)
        }

        this.$area.addEventListener('mousedown', mouseDownCallback)

        /**
         * Items
         */
        const mouseEnterCallback = () =>
        {
            this.shouldOpen = true
        }

        const mouseLeaveCallback = () =>
        {
            this.shouldOpen = false
        }

        this.$container.addEventListener('mouseenter', mouseEnterCallback)
        this.$container.addEventListener('mouseleave', mouseLeaveCallback)
    }

    /**
     * Set loop
     */
    setLoop()
    {
        const loop = () =>
        {
            window.requestAnimationFrame(loop)

            this.loop()
        }

        loop()
    }

    /**
     * Loop
     */
    loop()
    {
        /**
         * Position
         */
        this.position.current.x += (this.position.target.x - this.position.current.x) * 0.2
        this.position.current.y += (this.position.target.y - this.position.current.y) * 0.2

        const roundedX = Math.round(this.position.current.x * 10) / 10
        const roundedY = Math.round(this.position.current.y * 10) / 10

        // Verify if value changed
        if(roundedX !== this.position.rounded.x || roundedY !== this.position.rounded.y)
        {
            this.position.rounded.x = roundedX
            this.position.rounded.y = roundedY

            this.$container.style.transform = `translateX(${this.position.rounded.x}px) translateY(${this.position.rounded.y}px)`


        }

        /**
         * Items
         */
        for(const item of this.items)
        {
            item.current.x += (item.target.x - item.current.x) * 0.2
            item.current.y += (item.target.y - item.current.y) * 0.2

            const roundedX = Math.round(item.current.x * 10) / 10
            const roundedY = Math.round(item.current.y * 10) / 10

            // Verify if value changed
            if(roundedX !== item.rounded.x || roundedY !== item.rounded.y)
            {
                item.rounded.x = roundedX
                item.rounded.y = roundedY

                item.$element.style.transform = `translateX(${item.rounded.x}px) translateY(${item.rounded.y}px)`
            }
        }
    }

    /**
     * Open
     */
    open()
    {
        if(!this.canOpen)
        {
            return
        }

        const segmentAngle = Math.PI * 2 / this.items.length
        const radius = 45

        for(const item of this.items)
        {
            item.target.x = Math.sin(segmentAngle * item.index) * 45
            item.target.y = Math.cos(segmentAngle * item.index) * 45
        }
    }

    /**
     * Close
     */
    close()
    {
        for(const item of this.items)
        {
            item.target.x = 0
            item.target.y = 0
        }
    }
}
