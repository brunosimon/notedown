import Code from './Code/index.js'
import Sync from './Sync.js'

export default class Application
{
    constructor()
    {
        this.code = new Code()
        this.sync = new Sync()
    }

    destruct()
    {
        this.code.destruct()
    }
}
