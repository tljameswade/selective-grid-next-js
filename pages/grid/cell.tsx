import styles from './grid.module.css';

type Props = {
    rowIndex: number,
    colIndex: number,
    selected: boolean,
};

const Cell = ({rowIndex, colIndex, selected}: Props) => 
    <div className={styles.cell} style={{backgroundColor: selected? 'red' : 'white'}}>

    </div>;

export default Cell