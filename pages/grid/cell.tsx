import styles from './grid.module.css';

type Props = {
    rowIndex: number,
    colIndex: number,
    selected: boolean,
    mouseOver: (row: number, col: number) => void,
};

const Cell = ({rowIndex, colIndex, selected, mouseOver}: Props) => 
    <div className={styles.cell} style={{backgroundColor: selected? 'red' : 'white'}} onMouseOver={() => mouseOver(rowIndex, colIndex)}>

    </div>;

export default Cell