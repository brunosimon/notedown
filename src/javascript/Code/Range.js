import Position from './Position.js'

export default class Range
{
    constructor(_start = null, _end = null)
    {
        this.start = _start === null ? new Position() : _start
        this.end = _end === null ? new Position() : _end
    }

    clone()
    {
        const range = new Range()
        range.start.copy(this.start)
        range.end.copy(this.end)

        return range
    }

    copy(_range)
    {
        this.start.copy(_range.start)
        this.end.copy(_range.end)
    }

    isReversed()
    {
        return this.start.isAfter(this.end)
    }

    normalize()
    {
        // Start if after end
        if(this.isReversed())
        {
            // Reverse start and end
            const start = this.end
            const end = this.start

            this.start = start
            this.end = end
        }
    }
}
