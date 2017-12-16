export default class Logs
{
    /**
     * Constructor
     */
    constructor()
    {
        this.$container = document.querySelector('.js-logs')
        this.$messages = this.$container.querySelector('.js-messages')

        this.limit = 10
        this.$allMessages = []
    }

    /**
     * Add message
     */
    addMessage(text = '', type = 'default')
    {
        // Fetch clock
        const date = new Date()

        let hours = `${date.getHours()}`
        if(hours.length === 1)
        {
            hours = `0${hours}`
        }

        let minutes = `${date.getMinutes()}`
        if(minutes.length === 1)
        {
            minutes = `0${minutes}`
        }

        let seconds = `${date.getSeconds()}`
        if(seconds.length === 1)
        {
            seconds = `0${seconds}`
        }

        const clock = `${minutes}:${seconds}`

        // Create message element
        const $message = document.createElement('div')
        $message.classList.add('message')
        $message.classList.add(type)
        $message.innerText = `${clock} - ${text}`

        this.$messages.appendChild($message)
        this.$allMessages.push($message)

        if(this.$allMessages.length > this.limit)
        {
            const $message = this.$allMessages.shift()
            this.$messages.removeChild($message)
        }
    }
}
