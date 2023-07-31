import Image from "next/image";

export default function Backgrounds({ toDisplay, basePath } : { toDisplay:number, basePath:string }) {
    return (
        <div style={{ position:"absolute", height:'100vh', width:'100vw' }}> 
            {Array.from({length: 6}, (x, i) => i).map((i) => (
                <Image key={i} className='main-bg' src={`${basePath}/main_${i}.jpg`} alt={`bg-${i}`} fill={true} priority={true} style={{ display:toDisplay == i ? 'block' : 'none' }} />
            ))}
        </div>
    );
}
