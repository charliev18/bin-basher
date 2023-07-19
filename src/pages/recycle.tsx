import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from "react"
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import itemsJSON from "../data/items.json"
import Startup from '@/components/startup';
import { ItemObj } from '@/types/item';
import GameOver from '@/components/gameover';
import LabelledButton from '@/components/labelled_button';
import UserInfo from '@/components/user_info';
import Item from '@/components/item';
import Bin from '@/components/drop_bin';

let interval : NodeJS.Timer;

// Parse and shuffle item array
function loadItems( shuffle : boolean = true ) : Array<ItemObj> {
    var items: Array<ItemObj> = JSON.parse(JSON.stringify(itemsJSON));

    if (shuffle) 
        items.sort(() => Math.random() - 0.5);

    return items;
}

function findByName( items : Array<ItemObj>, name : string) : ItemObj | null {
    let index : number = 0;
    let toReturn : ItemObj | null = null;
    for ( ; index < items.length; index++) {
        if (items[index].name === name) {
            toReturn = items[index];
            break;
        }
    }
    
    return toReturn;
}

export default function Game() {
    const [items, setItems] = useState<Array<ItemObj>>([]);
    const [mistakes, setMistakes] = useState<Array<ItemObj>>([]);
    const [score, setScore] = useState<number>(0);
    const [gameStage, setGameStage] = useState<number>(0);
    const [timeRemaining, setTimeRemaining] = useState<number>(60);
    const [curSelection, setCurSelection] = useState<HTMLElement | null>();

    const [, updateState] = useState<Object>();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        setItems(loadItems());
    }, []);

    useEffect(() => {
        if (gameStage == 1) {
            interval = setInterval(() => {
                setTimeRemaining((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
    }, [gameStage])

    const router = useRouter();
    const basePath = router.basePath || '';

    const goToNextGameStage = () => {
        setGameStage(gameStage + 1);
    }

    const resetGameStage = () => {
        setScore(0);
        setItems(loadItems());
        setGameStage(0);
        setTimeRemaining(60);
    }

    const handleDragOver = ( event : DragOverEvent ) => {
        if ( event.over ) {
            // Do some unhighlighting of previous selection if required
            if (curSelection) {
                curSelection.style.transform = "";
                setCurSelection(null);
            }

            // Do some highlighting
            let overDOM = document.getElementById( event.over.id.toString() );
            if (overDOM) {
                overDOM.style.transform = "scale(1.2)";
                setCurSelection(overDOM);
            }

        } else {
            // Do some unhighlighting
            if (curSelection) {
                curSelection.style.transform = "";
                setCurSelection(null);
            }
        }
    }

    const handleDragEnd = ( event : DragEndEvent ) => {

        if ( event.over ) {
            if ( event.over.id.toString() === items[0].answer ) { // Correct selection
                console.log(`Ending Drag, over: ${event.over.id}`);
                setScore(score + 1);

                if (items[0].next) {
                    let next = findByName(loadItems(false), items[0].next);
                    items.shift();

                    if ( next )
                        items.unshift(next);
                } else {
                    items.shift();
                }
            } else if ( event.over.id.toString() !== 'wash' )  {  // Incorrect selection
                if (!findByName(mistakes, items[0].name))
                    mistakes.push(items[0]);

                items.shift();
            }

            // Do some unhighlighting
            if (curSelection) {
                curSelection.style.transform = "";
                setCurSelection(null);
            }
        }

        forceUpdate();
    }

    // Ran out of items to sort or out of time: Game Over
    if (gameStage == 1 && (items.length == 0 || timeRemaining < 1)) {
        goToNextGameStage();
    }

    return (
      <main className='main-home' style={{ backgroundImage: `url(${basePath}/main_${Math.min(score, 5)}.png)`}}>
        <LabelledButton label="Go To Game Over" e={goToNextGameStage} />
        <div className='wrapper'>
            {gameStage == 0 && 
                <Startup incrementGameStage={goToNextGameStage}/>
            }
            {gameStage == 1 && items.length > 0 &&
                <div>
                    <UserInfo label="Time Remaining" val={timeRemaining.toString()} />
                    <UserInfo label="Score" val={score.toString()} />

                    <DndContext onDragOver={ handleDragOver } onDragEnd={ handleDragEnd }>
                        <Bin
                            type='general'
                            source={`${basePath}/black-bin.png`}
                            xPos='65%'
                            yPos='35%'
                        />
                        <Bin
                            type='recycle'
                            source={`${basePath}/recycling-bin.png`}
                            xPos='65%'
                            yPos='80%'
                        />
                        <Bin
                            type='wash'
                            source={`${basePath}/pond-remove.png`}
                            xPos='5%'
                            yPos='85%'
                        />
        
                        <Item
                            id='item'
                            name={items[0].name}
                            source={`${basePath}/${items[0].image}`}
                        />
                    </DndContext>
                </div>
            }
            {gameStage == 2 &&
                <GameOver basePath={basePath} mistakes={mistakes} resetGameStage={resetGameStage} />
            }
        </div>
      </main>
    )
}
  
