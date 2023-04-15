import styles from './grid.module.css';
import Cell from './cell';
import Customize from './customize';
import { useEffect, useRef, useState } from 'react';

type Props = {
    numOfRows: number,
    numOfCols: number
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

type GridSize = {
    numOfRows: number,
    numOfCols: number,
};


const Grid = ({numOfRows, numOfCols}: Props) => {
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

    const handleMouseDown = (event: MouseEvent) => {
        if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
            setSelectStatus(initialSelectStatus);
        } else {
            setSelectStatus({
                ...selectStatus,
                isHighlighting: true,
                selected: {
                    startCoord: {...selectStatus.currCoord},
                    endCoord: {...selectStatus.currCoord},
                }
            });            
        }
        console.log(selectStatus);
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
        <div ref={gridRef} className={styles.grid}>
            {[...Array(numOfRows).keys()].map(rowIndex => 
                <div key={rowIndex} className={styles.row}>
                    {[...Array(numOfCols).keys()].map(colIndex => 
                        <Cell key={`${rowIndex},${colIndex}`}
                              rowIndex={rowIndex} 
                              colIndex={colIndex} 
                              selected={isSelected(rowIndex, colIndex, selectStatus.selected)}
                              mouseOver={mouseOverCell} />)}
                </div>)}
        </div>
    );
}

const isSelected = (rowIndex: number, colIndex: number, selected: Selected|null) => selected && selected.startCoord && selected.endCoord &&
                                                                                    (rowIndex - selected.startCoord.row) * (rowIndex - selected.endCoord.row) <= 0 && 
                                                                                    (colIndex - selected.startCoord.col) * (colIndex - selected.endCoord.col) <= 0;

const SelectiveGridPage = () => {
    const [gridSize, setGridSize] = useState<GridSize>({numOfRows: 0, numOfCols: 0});

    return (
        <div>
            <Customize setGridSize={(numOfRows: number, numOfCols: number) => setGridSize({numOfRows, numOfCols})}/>
            This is a selective grid that allows you to select and highlight cells in the grid below
            <div><Grid numOfRows={gridSize.numOfRows} numOfCols={gridSize.numOfCols} /></div>
        </div>
    );
}

export default SelectiveGridPage