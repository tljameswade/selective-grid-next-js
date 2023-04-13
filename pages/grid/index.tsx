import styles from './grid.module.css';
import Cell from './cell';

type Props = {
    numOfRows: number,
    numOfCols: number
};

const Grid = ({numOfRows, numOfCols}: Props) => {
    return (
        <div>
            {[...Array(numOfRows).keys()].map(rowIndex => 
                <div key={rowIndex} className={styles.row}>
                    {[...Array(numOfCols).keys()].map(colIndex => 
                        <Cell />)}
                </div>)}
        </div>
    );
}

const SelectiveGridPage = () => 
<div>
    This is a selectiive grid that allows you to select and highlight cells in the grid below
    <Grid numOfRows={10} numOfCols={10} />
</div>

export default SelectiveGridPage