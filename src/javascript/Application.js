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

        // On code action
        this.code.actions.on('action', () =>
        {
            // Get state
            const state = this.code.getState()
            state.time = Date.now()
            this.latestPushedState = state

            // Update sync
            this.sync.refs.state.set(state)
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
