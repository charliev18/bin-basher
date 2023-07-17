import LabelledButton from '@/components/labelled_button';
import { MouseEventHandler, useState, useCallback } from 'react';
import { ItemObj } from '@/types/item';
import { FaArrowRight } from 'react-icons/fa'

function MistakeCorrection({ item } : { item:ItemObj }) {
    return (
        <div>
            <h2>{item.name}</h2>
            <h4>{item.facts}</h4>
            <img src={item.image} />
        </div>
    )
}

export default function GameOver({ mistakes, resetGameStage } : { mistakes:Array<ItemObj>, resetGameStage:MouseEventHandler }) {
    const [remaining, setRemaining] = useState<Array<ItemObj>>(mistakes);
    const [, updateState] = useState<Object>();
    const forceUpdate = useCallback(() => updateState({}), []);

    return (
        <div>
            {remaining.length > 0 &&
                <div className="mistake-desc">
                    <MistakeCorrection item={remaining[0]} />
                    <button onClick={() => {remaining.shift(); forceUpdate()}}><FaArrowRight /></button>
                </div>
            }

            {mistakes.length == 0 &&
                <div>
                    <h2>Thank You For Playing!</h2>
                    <h4>and remember</h4>
                    <ul>
                        <li>3 R's - Reduce, Reuse, then Recycle, and don't forget to wash your recycling first</li>
                        <li>Don't pollute - Recycle to maintain the environment and wildlife</li>
                        <li>Save Resources - Recycling saves energy and resources required to use new materials</li>
                    </ul>

                    <LabelledButton label="Play Again" e={ resetGameStage }/>
                </div>
            }
        </div>
    )
}
