import Code from './Code/index.js'
import Sync from './Sync.js'

export default class Application
{
    constructor()
    {
        this.code = new Code()
        this.sync = new Sync()

        let latestData = null

        this.code.on('updated', (_data) =>
        {
            if(this.sync.ref)
            {
                const data = {
                    time: Date.now(),
                    text: _data.text
                }
                console.log('data', data)
                latestData = data

                this.sync.ref.set(data)
            }
        })

        this.sync.on('update', (_data) =>
        {
            if(latestData === null || _data.text !== latestData.text)
            {
                // Text
                this.code.lines.empty()
                this.code.lines.addText(_data.text)
            }
        })
    }

    destruct()
    {
        this.code.destruct()
    }
}
