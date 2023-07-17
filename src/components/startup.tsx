import LabelledButton from '@/components/labelled_button';
import { MouseEventHandler } from 'react';

export default function Startup({ incrementGameStage } : { incrementGameStage:MouseEventHandler }) {
    return (
        <div className="startup">
            <h2>Bin Busters</h2>
            <h4>How To Play:</h4>
            <ul>
                <li>Sort items correctly in the black general waste bin or the blue recycling bin</li>
                <li>Some items are dirty and need to be cleaned in the pond before sorting</li>
            </ul>
            <LabelledButton label="Let's Go!" e={ incrementGameStage }/>
        </div>
    )
}
