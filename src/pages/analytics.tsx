import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Analytics() {
    const [disp, setDisp] = useState<JSX.Element>();
    
    const get_scores = async () => {
        let res = await fetch('/api/get_scores');

        if (!res.ok) {
            setDisp(<div>Something went wrong</div>);
            console.log(res.text);

            return;
        }

        const rows = await res.json();

        const items = [];
        for (let i = 0; i < rows.length; i++) {
            items.push(
                <tr key={i}>
                    <th key={1}>{rows[i].user_name + '\t'}</th>
                    <th key={2}>{rows[i].score  + '\t'}</th>
                    <th key={3}>{rows[i].time  + '\t'}</th>
                </tr>);
        }
        setDisp(<table><thead><tr><th>{'Name\t'}</th><th>{'Score\t'}</th><th>{'Timestamp\t'}</th></tr></thead><tbody>{items}</tbody></table>);
    }

    useEffect(() => {
        get_scores();
    }, []);

    return (
      <main className='analytics'>
        {disp}
      </main>
    )
}
