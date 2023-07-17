import { useDroppable } from "@dnd-kit/core";

export default function Bin({ type, source, xPos, yPos } : { type:string, source:string, xPos:string, yPos:string }) {
    const {setNodeRef} = useDroppable({
        id: type,
    });
      
    return (
        <div ref={setNodeRef} id={type} className='bin' style={{
            position: 'absolute',
            left: `${xPos}`,
            top: `${yPos}`
        }}> 
            <img src={source} />
        </div>
    );
}
