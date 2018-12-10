export default class Position
{
    constructor(_lineIndex = 0, _rowIndex = 0)
    {
        this.lineIndex = _lineIndex
        this.rowIndex = _rowIndex
    }

    clone()
    {
        const position = new Position()
        position.lineIndex = this.lineIndex
        position.rowIndex = this.rowIndex

        return position
    }

    copy(_position)
    {
        this.lineIndex = _position.lineIndex
        this.rowIndex = _position.rowIndex
    }

    isBefore(_position)
    {
        // Not the same line
        if(this.lineIndex !== _position.lineIndex)
        {
            return this.lineIndex < _position.lineIndex
        }
        // Same line
        else
        {
            return this.rowIndex < _position.rowIndex
        }
    }

    isAfter(_position)
    {
        // Return opposite of isBefore
        return !this.isBefore(_position)
    }
}
