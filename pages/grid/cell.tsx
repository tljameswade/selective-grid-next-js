type Props = {
    rowIndex: number,
    colIndex: number,
    selected: boolean,
    cellSize: number,
    isRightEdge: boolean,
    isBottomEdge: boolean,
    mouseOver: (row: number, col: number) => void,
    mouseDown: (row: number, col: number) => void,
};

export const borderStyle = '1px solid #d1d3de';

const getCellStyles = (selected: boolean, cellSize: number, isRightEdge: boolean, isBottomEdge: boolean) => {
    return {
        backgroundColor: selected ? '#9de3eb' : 'white',
        borderLeft: borderStyle,
        borderTop: borderStyle,
        borderRight: isRightEdge ? borderStyle : 'none',
        borderBottom: isBottomEdge ? borderStyle : 'none',
        width: `${cellSize}px`,
        height: `${cellSize}px`
    };
}

const Cell = ({rowIndex, colIndex, selected, cellSize, isRightEdge, isBottomEdge, mouseOver, mouseDown}: Props) => 
    <div style={getCellStyles(selected, cellSize, isRightEdge, isBottomEdge)} onMouseOver={() => mouseOver(rowIndex, colIndex)} onMouseDown={() => mouseDown(rowIndex, colIndex)}/>

export default Cell