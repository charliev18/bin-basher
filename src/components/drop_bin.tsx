import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";

export default function Bin({ type, source, xPos, yPos, children } : { type:string, source:string, xPos:string, yPos:string, children?:any }) {
    const {setNodeRef} = useDroppable({
        id: type,
    });
      
    return (
        <div ref={setNodeRef} id={type} className='bin' style={{
            position: 'absolute',
            left: `${xPos}`,
            top: `${yPos}`
        }}> 
            <Image src={source} alt={type} fill={true} />
            {children}
        </div>
    );
}
