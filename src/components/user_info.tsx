
export default function UserInfo({ label, val } : { label:string, val:string }) {
    return (
        <div className='user-info'>
            <p>{label}</p>
            <p>{val}</p>
        </div>
    )
}
