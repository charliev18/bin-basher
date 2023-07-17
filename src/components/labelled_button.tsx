import { MouseEventHandler } from "react";

export default function LabelledButton({ label, e } : { label:string, e:MouseEventHandler }) {
    return (
      <button className='labelled-button' onClick={e}>{label}</button>
    );
}
