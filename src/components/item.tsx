import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities'
import Image from "next/image";

export default function Item({ id, name, source } : { id:string, name:string, source:string }) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <button className='draggableItem' ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Image src={source} alt={name} width={100} height={100} priority={true} />
            <div className="imgLabel">{name}</div>
        </button>
    );
}
