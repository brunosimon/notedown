import Code from './Code/index.js'
import Sync from './Sync.js'

export default class Application
{
    constructor()
    {
        this.code = new Code()
        this.sync = new Sync()

        // State change trigger updated event
        let latestPushedState = null

        // On code action
        this.code.actions.on('action', () =>
        {
            // Get state
            const state = this.code.getState()
            state.time = Date.now()
            latestPushedState = state

            // Update sync
            this.sync.ref.set(state)
        })

        // On sync update
        this.sync.on('update', (_data) =>
        {
            // Not the latest pushed state
            if(latestPushedState === null || _data.text !== latestPushedState.text)
            {
                // Update code
                this.code.lines.setText(_data.text)
            }
        })
    }

    destruct()
    {
        this.code.destruct()
    }
}
