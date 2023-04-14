import styles from './grid.module.css';
import Cell from './cell';
import { useState } from 'react';

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


const Grid = ({numOfRows, numOfCols}: Props) => {
    const [selectStatus, setSelectStatus] = useState<SelectStatus>({currCoord: null, isHighlighting: false, selected: null});

    const mouseOverCell = (row: number, col: number) => {
        setSelectStatus({
            ...selectStatus,
            currCoord: {row, col},
            selected: selectStatus.isHighlighting ? {...selectStatus.selected, endCoord: {row, col}} : {...selectStatus.selected}
        });
    }

    const startSelect = () => {
        setSelectStatus({
            ...selectStatus,
            isHighlighting: true,
            selected: {
                startCoord: {...selectStatus.currCoord},
                endCoord: {...selectStatus.currCoord},
            }
        });
    }

    const endSelect = () => {
        setSelectStatus({
            ...selectStatus,
            isHighlighting: false,
        });
    }

    return (
        <div onMouseUp={endSelect} onMouseDown={startSelect}>
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

const SelectiveGridPage = () => 
<div>
    This is a selectiive grid that allows you to select and highlight cells in the grid below
    <Grid numOfRows={10} numOfCols={10} />
</div>

export default SelectiveGridPage