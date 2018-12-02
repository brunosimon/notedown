import Code from './Code/index.js'

export default class Application
{
    constructor()
    {
        this.code = new Code()
    }

    destruct()
    {
        this.code.destruct()
    }
}
