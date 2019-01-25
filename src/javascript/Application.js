import Code from './Code/index.js'
import Sync from './Sync.js'

import initialText from './config/initialText.js'

export default class Application
{
    constructor()
    {
        // Set up
        this.latestPushedState = null
        this.$element = document.querySelector('.notedown')

        this.setCode()
        this.setSync()
    }

    setCode()
    {
        this.code = new Code({
            $target: this.$element
        })

        // Set code from local storage
        let lastState = window.localStorage.getItem('lastState')

        if(lastState)
        {
            lastState = JSON.parse(lastState)
            this.code.lines.addText(lastState.text)
        }

        // Lock
        this.code.lock()

        // On code action
        this.code.actions.on('action', () =>
        {
            // Get state
            const state = this.code.getState()
            state.time = Date.now()
            this.latestPushedState = state

            // Update sync
            this.sync.refs.state.set(state)

            // Save to local storage
            window.localStorage.setItem('lastState', JSON.stringify(state))

            // Save to daily local storage
            let dailyState = window.localStorage.getItem('dailyState')
            let shouldSaveDailyState = false

            if(dailyState)
            {
                dailyState = JSON.parse(dailyState)
                const date = new Date(dailyState.time)
                const day = date.getDay()

                const currentDate = new Date(state.time)
                const currentDay = currentDate.getDay()

                if(day !== currentDay)
                {
                    shouldSaveDailyState = true
                }
            }
            else
            {
                shouldSaveDailyState = true
            }

            if(shouldSaveDailyState)
            {
                window.localStorage.setItem('dailyState', JSON.stringify(state))
            }
        })
    }

    setSync()
    {
        this.sync = new Sync()

        // On first sync
        this.sync.on('firstSync', (_value) =>
        {
            // No data yet
            if(_value === null)
            {
                // Create data
                this.code.lines.setText(initialText)

                // Sync state
                const state = this.code.getState()
                this.sync.refs.main.set({
                    state: state
                })
            }

            // Has already data
            else
            {
                this.code.setState(_value.state)
            }

            // Unlock
            this.code.unlock()
        })

        // On state update
        this.sync.on('stateUpdate', (_state) =>
        {
            // No state
            if(_state === null)
            {
                return
            }

            // Not the latest pushed state
            if(this.latestPushedState === null || _state.text !== this.latestPushedState.text)
            {
                // Update code
                this.code.lines.setText(_state.text)
            }
        })
    }

    destruct()
    {
        this.code.destruct()
    }
}
