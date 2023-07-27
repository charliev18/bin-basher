import { MouseEventHandler  } from "react"

export default function LoadingButton({ text, onClick, loading, disabled } : { text:string, onClick:MouseEventHandler<HTMLButtonElement>, loading:boolean, disabled:boolean }) {
    return (
        <button className="loading-btn" onClick={onClick} disabled={disabled}>
            {!loading ? text : 'Checking...'}
        </button>
    )
}
