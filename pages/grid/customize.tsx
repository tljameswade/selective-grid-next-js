import { FormEvent, useState } from "react";
import { useRef } from "react";

type Props = {
    setNumOfCellsPerRow: (numOfCellsPerRow: number) => void
};

const Customize = ({ setNumOfCellsPerRow }: Props) => {
    const rowInput = useRef<HTMLInputElement>(null);

    const [warning, setWarning] = useState<string | null>(null);

    const setRowsAndCols = (e: FormEvent) => {
        e.preventDefault();
        const row = Number(rowInput?.current.value);

        if (Number.isInteger(row) && 
            row > 0 && 
            row <= 100) {
            setWarning(null);
            setNumOfCellsPerRow(row);
        } else {
            setWarning('Your input for number of cells in a row should be between 1 and 100');
        }

        rowInput.current.value = '';
    }
    return (<div>
                <form onSubmit={setRowsAndCols}>
                    <div>
                        <label>Enter the number of cells in a row in the grid: {' '}<input type="text" ref={rowInput}/></label>
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