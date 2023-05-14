import styles from './grid.module.css';
import Cell, { borderStyle } from './cell';
import Customize from './customize';
import { useEffect, useRef, useState } from 'react';

type Props = {
    numOfCellsPerRow: number
};

type Coord = {
    row: number,
    col: number,
};

type Selected = {
    startCoord: Coord,
    endCoord: Coord
};

type SelectStatus = {
    currCoord: Coord | null,
    isHighlighting: boolean,
    selected: Selected | null,
};

const gridWidth = 500;
const gridStyles = {
    width: `${gridWidth}px`,
    height: `${gridWidth}px`,
    display: 'inline-block'
};

const Grid = ({ numOfCellsPerRow }: Props) => {
    const gridRef = useRef<HTMLDivElement>(null);

    const initialSelectStatus = {currCoord: null, isHighlighting: false, selected: null}
    const [selectStatus, setSelectStatus] = useState<SelectStatus>(initialSelectStatus);

    const mouseOverCell = (row: number, col: number) => {
        setSelectStatus({
            ...selectStatus,
            currCoord: {row, col},
            selected: selectStatus.isHighlighting ? {...selectStatus.selected, endCoord: {row, col}} : {...selectStatus.selected}
        });
    }

    const mouseDownCell = (row: number, col: number) => {
        setSelectStatus({
            ...selectStatus,
            isHighlighting: true,
            selected: {
                startCoord: {row, col},
                endCoord: {row, col},
            }
        });       
    }

    const handleMouseDown = (event: MouseEvent) => {
        if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
            setSelectStatus(initialSelectStatus);
        }
    }

    const handleMouseUp = (event: MouseEvent) => {
        setSelectStatus({
            ...selectStatus,
            isHighlighting: false,
        });       
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseDown, handleMouseUp]);

    return (
        <div ref={gridRef} style={gridStyles}>
            {[...Array(numOfCellsPerRow).keys()].map(rowIndex => 
                <div key={rowIndex} className={styles.row}>
                    {[...Array(numOfCellsPerRow).keys()].map(colIndex => 
                        <Cell key={`${rowIndex},${colIndex}`}
                              rowIndex={rowIndex} 
                              colIndex={colIndex}
                              cellSize={gridWidth / numOfCellsPerRow} 
                              selected={isSelected(rowIndex, colIndex, selectStatus.selected)}
                              isRightEdge={colIndex===numOfCellsPerRow - 1}
                              isBottomEdge={rowIndex===numOfCellsPerRow - 1}
                              mouseOver={mouseOverCell} 
                              mouseDown={mouseDownCell} />)}
                </div>)}
        </div>
    );
}

const isSelected = (rowIndex: number, colIndex: number, selected: Selected|null) => selected && selected.startCoord && selected.endCoord &&
                                                                                    (rowIndex - selected.startCoord.row) * (rowIndex - selected.endCoord.row) <= 0 && 
                                                                                    (colIndex - selected.startCoord.col) * (colIndex - selected.endCoord.col) <= 0;

const SelectiveGridPage = () => {
    const [numOfCellsPerRow, setNumOfCellsPerRow] = useState(0);

    return (
        <div style={{margin: '10px'}}>
            <Customize setNumOfCellsPerRow={(numOfCellsPerRow) => setNumOfCellsPerRow(numOfCellsPerRow)}/>
            
            {numOfCellsPerRow > 0 && 
            <div style={{marginTop: '20px'}}>
                <div>This is a selective grid that allows you to select and highlight cells in the grid below</div>
                <div className={styles.gridContainer}>
                    <Grid numOfCellsPerRow={numOfCellsPerRow} />
                </div>
            </div>}
        </div>
    );
}

export default SelectiveGridPage