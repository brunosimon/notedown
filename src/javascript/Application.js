import Code from './Code/index.js'
import Sync from './Sync.js'

export default class Application
{
    constructor()
    {
        this.code = new Code()

        this.sync = new Sync()
        this.sync.on('update', (_data) =>
        {
            console.log('_data', _data)
        })
    }

    destruct()
    {
        this.code.destruct()
    }
}
