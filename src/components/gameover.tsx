import LabelledButton from '@/components/labelled_button';
import LoadingButton from './loading_button';
import { MouseEventHandler, useState, useCallback, useRef, Dispatch, SetStateAction, MouseEvent } from 'react';
import { ItemObj } from '@/types/item';
import { FaArrowRight } from 'react-icons/fa'
import { GrClose } from 'react-icons/gr'
import Modal from 'react-modal';
import Image from 'next/image';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


interface ApiResp {
    exists: boolean;
}

async function submitScore( username:string, score:number ) {
    let res = await fetch('/api/add_score', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            score: score,
        }),
        headers: {'Content-Type': 'application/json', Accept: 'application/json'} });

    if (!res.ok) {
        console.log('submission failed');
        return {};
    }
}

async function createNewPlayer( username:string, score:number ) {
    
    console.log(JSON.stringify({
        username: username,
        score: score,
    }));
    
    let res = await fetch('/api/add_user', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            score: score,
        }),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'} });

    if (!res.ok) {
        console.log('Player creation failed');
        return {};
    }

    submitScore( username, score );
}

function MistakeCorrection({ basePath, item } : { basePath:string, item:ItemObj }) {
    return (
        <div>
            <h2>{item.name}</h2>
            <h4>{item.facts}</h4>
            <Image src={`${basePath}/${item.image}`} alt={item.name} width={100} height={100} />
        </div>
    )
}

export default function GameOver({ basePath, mistakes, score, resetGameStage, username, setUsername } : { basePath:string, mistakes:Array<ItemObj>, score:number, resetGameStage:MouseEventHandler, username:string, setUsername:Dispatch<SetStateAction<string>> }) {
    const [remaining, setRemaining] = useState<Array<ItemObj>>(mistakes);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [newLoading, setNewLoading] = useState<boolean>(false);
    const [retLoading, setRetLoading] = useState<boolean>(false);
    const [awaitingApi, setAwaitingApi] = useState<boolean>(false);
    const [saveDisabled, setSaveDisabled] = useState<boolean>(false);

    const [, updateState] = useState<Object>();
    const forceUpdate = useCallback(() => updateState({}), []);

    const ref = useRef<HTMLInputElement>(null);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleSave = () => {
        if (username !== '') {
            setSaveDisabled(true);
            submitScore(username, score );
        } else {
            openModal();
        }
    }

    const submitUsername = async ( e:MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, elem:HTMLInputElement | null, newPlayer:boolean ) => {
        e.preventDefault(); 

        setAwaitingApi(true);
        newPlayer ? setNewLoading(true) : setRetLoading(true);

        if (!elem) {
            setErrorMsg("Scores are not working right now");
            console.log("Something went wrong, no input element detected");

            setAwaitingApi(false);
            newPlayer ? setNewLoading(false) : setRetLoading(false);
            return;
        }

        // VALIDATION
        let res = await fetch(`/api/user_exists?username=${elem.value}`);

        if (!res.ok) {
            setErrorMsg("Scores are not working right now");
            console.log(res.text);

            setAwaitingApi(false);
            newPlayer ? setNewLoading(false) : setRetLoading(false);
            return;
        }

        let userExists = (await res.json() as ApiResp).exists;

        if (userExists && newPlayer) { // Invalid: Username taken
            setErrorMsg("Username taken, either select 'Returning Player' or try another username.");

            setAwaitingApi(false);
            newPlayer ? setNewLoading(false) : setRetLoading(false);
            return;
        }

        if (!userExists && !newPlayer) { // Invalid: User does not exist
            setErrorMsg("Username not recognised, select 'New Player' to register.");

            setAwaitingApi(false);
            newPlayer ? setNewLoading(false) : setRetLoading(false);
            return;
        }

        // Valid!

        setUsername(elem.value);

        if (newPlayer) 
            createNewPlayer( elem.value, score ); 
        else
            submitScore( elem.value, score );

        setSaveDisabled(true);
        setAwaitingApi(false);
        newPlayer ? setNewLoading(false) : setRetLoading(false);
        closeModal();
    }

    return (
        <div>
            {remaining.length > 0 &&
                <div className="mistake-desc">
                    <MistakeCorrection basePath={basePath} item={remaining[0]} />
                    <button onClick={() => {remaining.shift(); forceUpdate()}}><FaArrowRight /></button>
                </div>
            }

            {mistakes.length == 0 &&
                <div className="end-card">
                    <h2>Nice Job!</h2>
                    <h2>Your Score: {score}</h2>
                    <h4>Thank You For Playing!</h4>
                    <h4>And Remember</h4>
                    <ul>
                        <li>3 R&apos;s - Reduce, Reuse, then Recycle, and don&apos;t forget to wash your recycling first</li>
                        <li>Don&apos;t pollute - Recycle to maintain the environment and wildlife</li>
                        <li>Save Resources - Recycling saves energy and resources required to use new materials</li>
                    </ul>

                    <div className="button-group">
                        <LabelledButton label="Save Score" e={ handleSave } disabled={saveDisabled} />
                        <LabelledButton label="Play Again" e={ (e) => { setSaveDisabled(false); resetGameStage(e) } } />
                    </div>

                    <Modal
                        isOpen={modalOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Score Modal"
                    >
                        <button className='closeBtn' onClick={ closeModal }><GrClose /></button>
                        <form>
                            <div>
                                <label>Username:
                                    <input ref={ref} />
                                    {errorMsg && 
                                        <div className='inputInvalid'>{errorMsg}</div>
                                    }
                                </label>
                            </div>
                            <div>
                                <LoadingButton text="New Player" onClick={ (e) => { submitUsername(e, ref.current, true) }} loading={newLoading} disabled={awaitingApi} />
                                <LoadingButton text="Returning Player" onClick={ (e) => { submitUsername(e, ref.current, false) }} loading={retLoading} disabled={awaitingApi} />
                            </div>
                        </form>
                    </Modal>
                </div>
            }
        </div>
    )
}
