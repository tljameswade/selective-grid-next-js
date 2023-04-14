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

const Grid = ({numOfRows, numOfCols}: Props) => {
    const [selected, setSelected] = useState();
    return (
        <div>
            {[...Array(numOfRows).keys()].map(rowIndex => 
                <div key={rowIndex} className={styles.row}>
                    {[...Array(numOfCols).keys()].map(colIndex => 
                        <Cell rowIndex={rowIndex} 
                              colIndex={colIndex} 
                              selected={isSelected(rowIndex, colIndex, selected)}/>)}
                </div>)}
        </div>
    );
}

const isSelected = (rowIndex: number, colIndex: number, selected: Selected|null) => selected && 
                                                                                    rowIndex >= selected.startCoord.row &&
                                                                                    rowIndex <= selected.endCoord.row &&
                                                                                    colIndex >= selected.startCoord.col &&
                                                                                    colIndex <= selected.endCoord.col;

const SelectiveGridPage = () => 
<div>
    This is a selectiive grid that allows you to select and highlight cells in the grid below
    <Grid numOfRows={10} numOfCols={10} />
</div>

export default SelectiveGridPage