import { MouseEventHandler } from "react";

export default function LabelledButton({ label, e, disabled=false } : { label:string, e:MouseEventHandler, disabled?:boolean }) {
    return (
      <button className='labelled-button' onClick={e} disabled={disabled}>{label}</button>
    );
}
