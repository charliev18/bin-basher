import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from "react"
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { GiCheckMark, GiCrossMark } from 'react-icons/gi'
import { IconContext } from 'react-icons';
import itemsJSON from "../data/items.json"
import Startup from '@/components/startup';
import { ItemObj } from '@/types/item';
import GameOver from '@/components/gameover';
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

function preloadImage( url : string ) {
    var img = new Image();
    img.src = url;
}

export default function Game() {
    const [items, setItems] = useState<Array<ItemObj>>([]);
    const [mistakes, setMistakes] = useState<Array<ItemObj>>([]);
    const [score, setScore] = useState<number>(0);
    const [gameStage, setGameStage] = useState<number>(0);
    const [timeRemaining, setTimeRemaining] = useState<number>(60);
    const [curSelection, setCurSelection] = useState<HTMLElement | null>();
    const [username, setUsername] = useState<string>('');
    const [checkStyle, setCheckStyle] = useState<{ opacity:number, left:number, top:number, transition:string }>({ opacity:0, left:0, top:0, transition:"none" });
    const [crossStyle, setCrossStyle] = useState<{ opacity:number, left:number, top:number, transition:string }>({ opacity:0, left:0, top:0, transition:"none" });
    const [mousePos, setMousePos] = useState<{ x:number, y:number }>({x:0,y:0});

    const [, updateState] = useState<Object>();
    const forceUpdate = useCallback(() => updateState({}), []);

    const router = useRouter();
    const basePath = router.basePath || '';

    useEffect(() => {
        setItems(loadItems());
        for (let i = 0; i < 6; i++) {
            preloadImage(`${basePath}/main_${i}.png`);
        }

        // Function to update mouse position on mousemove
        const updateMousePosition = (event:MouseEvent) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };

        const updateTouchPosition = (event:TouchEvent) => {
            setMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
        }

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('touchmove', updateTouchPosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.addEventListener('touchmove', updateTouchPosition);
        };
    }, []);

    useEffect(() => {
        if (gameStage == 1) {
            interval = setInterval(() => {
                setTimeRemaining((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
    }, [gameStage]);

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
                setScore(score + 1);

                let pos = {l: mousePos.x, t: mousePos.y}
                setCheckStyle({ left: pos.l, top: pos.t, opacity: 1, transition: 'none' });

                // After 1 second, reset the icon style to hide the icon
                setTimeout(() => {
                    setCheckStyle({ left: pos.l, top: pos.t - 20, opacity: 0, transition: 'all 2s' });
                }, 100);

                if (items[0].next) {
                    let next = findByName(loadItems(false), items[0].next);
                    items.shift();

                    if ( next )
                        items.unshift(next);
                } else {
                    items.shift();
                }
            } else if ( event.over.id.toString() !== 'wash' )  {  // Incorrect selection
                let pos = {l: mousePos.x, t: mousePos.y}
                setCrossStyle({ left: pos.l, top: pos.t, opacity: 1, transition: 'none' });

                // After 1 second, reset the icon style to hide the icon
                setTimeout(() => {
                    setCrossStyle({ left: pos.l, top: pos.t, opacity: 0, transition: 'all 2s' });
                }, 100);

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
        <IconContext.Provider value={{ color: "green", size: '2.5em' }}>
            <div className="check-icon" style={{ left:checkStyle.left + 'px', top:checkStyle.top + 'px', opacity: checkStyle.opacity, transition: checkStyle.transition }}>
                <GiCheckMark />
            </div>
        </IconContext.Provider>
        <IconContext.Provider value={{ color: "red", size: '2.5em' }}>
            <div className="cross-icon" style={{ left:crossStyle.left + 'px', top:crossStyle.top + 'px', opacity: crossStyle.opacity, transition: crossStyle.transition }}>
                <GiCrossMark />
            </div>
        </IconContext.Provider>
        <div className='wrapper'>
            {gameStage == 0 && 
                <Startup incrementGameStage={goToNextGameStage}/>
            }
            {gameStage == 1 && items.length > 0 &&
                <div>
                    <UserInfo label="Time Remaining" val={timeRemaining.toString()} />
                    <UserInfo label="Score" val={score.toString()} />
                    <UserInfo label="Pos" val={mousePos.x + ', ' + mousePos.y} />

                    <DndContext onDragOver={ handleDragOver } onDragEnd={ handleDragEnd } modifiers={ [restrictToFirstScrollableAncestor] }>
                        <Bin
                            type='general'
                            source={`${basePath}/black-bin.png`}
                            xPos='65%'
                            yPos='25%'
                        />
                        <Bin
                            type='recycle'
                            source={`${basePath}/recycling-bin.png`}
                            xPos='65%'
                            yPos='60%'
                        />
                        <Bin
                            type='wash'
                            source={`${basePath}/pond-remove.png`}
                            xPos='5%'
                            yPos='65%'
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
                <GameOver basePath={basePath} mistakes={mistakes} score={score} resetGameStage={resetGameStage} username={username} setUsername={setUsername} />
            }
        </div>
      </main>
    )
}
  
