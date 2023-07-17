import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities'

export default function Item({ id, name, source } : { id:string, name:string, source:string }) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <button className='draggableItem' ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <img src={source} />
            <div>{name}</div>
        </button>
    );
}
