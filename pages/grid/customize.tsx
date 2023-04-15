import { FormEvent, useState } from "react";
import { useRef } from "react";

type Props = {
    setGridSize: (numOfRows: number, numOfCols: number) => void
};

const Customize = ({ setGridSize }: Props) => {
    const rowInput = useRef<HTMLInputElement>(null);
    const colInput = useRef<HTMLInputElement>(null);

    const [warning, setWarning] = useState<string | null>(null);

    const setRowsAndCols = (e: FormEvent) => {
        e.preventDefault();
        const row = Number(rowInput?.current.value);
        const col = Number(colInput?.current.value);

        if (Number.isInteger(row) && 
            row > 0 && 
            row <= 100 && 
            Number.isInteger(col) && 
            col > 0 && 
            col <= 100) {
            setWarning(null);
            setGridSize(row, col);
        } else {
            setWarning('Your input for number of rows and columns should be between 1 and 100');
        }

        rowInput.current.value = '';
        colInput.current.value = '';
    }
    return (<div>
                <form onSubmit={setRowsAndCols}>
                    <div>
                        <label>Enter the number of rows in the grid: {' '}<input type="text" ref={rowInput}/></label>
                    </div>
                    <div>
                        <label>Enter the number of columns in the grid: {' '}<input type="text" ref={colInput}/></label>
                    </div>
                    <div>
                        <input type="submit" />
                    </div>
                    {
                        warning ? warning : <div></div>
                    }
                </form>
            </div>);
}

export default Customize