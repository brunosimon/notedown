import Application from './Application.js'

window.application = new Application()

if(module.hot)
{
    module.hot.dispose(() =>
    {
        window.location.reload()
    })
}
