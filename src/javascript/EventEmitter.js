export default class EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        this.callbacks      = {}
        this.callbacks.base = {}
    }

    /**
     * On
     */
    on(names, callback)
    {
        // Errors
        if(typeof names === 'undefined' || names === '')
        {
            console.warn('wrong names')
            return false
        }

        if(typeof callback === 'undefined')
        {
            console.warn('wrong callback')
            return false
        }

        // Resolve names
        names = this.resolve_names(names)

        // Each name
        for(name of names)
        {
            // Resolve name
            let resolved_name = this.resolve_name(name)

            // Create namespace if not exist
            if(!(this.callbacks[ resolved_name.namespace ] instanceof Object))
                this.callbacks[ resolved_name.namespace ] = {}

            // Create callback if not exist
            if(!(this.callbacks[ resolved_name.namespace ][ resolved_name.value ] instanceof Array))
                this.callbacks[ resolved_name.namespace ][ resolved_name.value ] = []

            // Add callback
            this.callbacks[ resolved_name.namespace ][ resolved_name.value ].push(callback)
        }

        return this
    }

    /**
     * Off
     */
    off(names)
    {
        // Errors
        if(typeof names === 'undefined' || names === '')
        {
            console.warn('wrong name')
            return false
        }

        // Resolve names
        names = this.resolve_names(names)

        // Each name
        for(name of names)
        {
            // Resolve name
            let resolved_name = this.resolve_name(name)

            // Remove namespace
            if(resolved_name.namespace !== 'base' && resolved_name.value === '')
            {
                delete this.callbacks[ resolved_name.namespace ]
            }

            // Remove specific callback in namespace
            else
            {
                // Default
                if(resolved_name.namespace === 'base')
                {
                    // Try to remove from each namespace
                    for(let namespace in this.callbacks)
                    {
                        if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ resolved_name.value ] instanceof Array)
                        {
                            delete this.callbacks[ namespace ][ resolved_name.value ]

                            // Remove namespace if empty
                            if(Object.keys(this.callbacks[ namespace ]).length === 0)
                                delete this.callbacks[ namespace ]
                        }
                    }
                }

                // Specified namespace
                else if(this.callbacks[ resolved_name.namespace ] instanceof Object && this.callbacks[ resolved_name.namespace ][ resolved_name.value ] instanceof Array)
                {
                    delete this.callbacks[ resolved_name.namespace ][ resolved_name.value ]

                    // Remove namespace if empty
                    if(Object.keys(this.callbacks[ resolved_name.namespace ]).length === 0)
                        delete this.callbacks[ resolved_name.namespace ]
                }
            }
        }

        return this
    }

    /**
     * Trigger
     */
    trigger(name, args)
    {
        // Errors
        if(typeof name === 'undefined' || name === '')
        {
            console.warn('wrong name')
            return false
        }

        let final_result, result

        // Default args
        if(!(args instanceof Array))
            args = []

        // Resolve names (should on have one event)
        name = this.resolve_names(name)

        // Resolve name
        name = this.resolve_name(name[ 0 ])

        // Default namespace
        if(name.namespace === 'base')
        {
            // Try to find callback in each namespace
            for(let namespace in this.callbacks)
            {
                if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array)
                {
                    for(let callback of this.callbacks[ namespace ][ name.value ])
                    {
                        result = callback.apply(this, args)

                        if(typeof final_result === 'undefined')
                            final_result = result
                    }
                }
            }
        }

        // Specified namespace
        else if(this.callbacks[ name.namespace ] instanceof Object)
        {
            if(name.value === '')
            {
                console.warn('wrong name')
                return this
            }

            for(let callback of this.callbacks[ name.namespace ][ name.value ])
            {
                result = callback.apply(this, args)

                if(typeof final_result === 'undefined')
                    final_result = result
            }
        }

        return final_result
    }

    /**
     * Resolve names
     */
    resolve_names(names)
    {
        names = names.replace(/[^a-zA-Z0-9 ,\/.]/g, '')
        names = names.replace(/[,\/]+/g, ' ')
        names = names.split(' ')

        return names
    }

    /**
     * Resolve name
     */
    resolve_name(name)
    {
        let new_name = {}
        let parts = name.split('.')

        new_name.original  = name
        new_name.value     = parts[ 0 ]
        new_name.namespace = 'base' // Base namespace

        // Specified namespace
        if(parts.length > 1 && parts[ 1 ] !== '')
            new_name.namespace = parts[ 1 ]

        return new_name
    }
}
