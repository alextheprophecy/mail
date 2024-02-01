import "../../styles/playground/playground.css";
import {useEffect, useState} from "react";

import axios from 'axios';

import PersonQueue from "../person/personqueue.component";
import DraggablePerson from "../person/draggable.person.component";
import TrashBin from "./trashbin.component";
import Refresh from "./refresh.component";

const Playground = () => {
    const LABELS = ["INBOX", "SENT", "TRASH"]//, "INBOX", "TRASH"]//["INBOX", "CHAT", "SENT", "SPAM"]
    const COUNT = 25
    const [mails, setMails] = useState(new Array(LABELS.length).fill([]))

    const [drag, setDrag] = useState(false)
    const [dragData, setDragData] = useState(0) //currently dragged person object
    const [oldDragState, setOldDragState] = useState([-1, -1]) //label index and array index of person pre-drag
    const [mousePos, setMousePos] = useState([0, 0])
    const [hoveredQueue, setHoveredQueue] = useState(0) //index of queue that mouse is hovering. an index of -1 represents the bin
    /**
     * parallel fetch of mails by labels filters-> for each mail parallel fetch of people by mail senderEmail info -> concatenation of results as array for n labels of [mail informations for label i, picture for label i]
     * then stores data into mail array state once all concurrent promises are handled
     */
    const fetchMailsAndPictures = (count = COUNT) => {
        Promise.all(
            LABELS.map((label, i) => {
                return axios.get("http://localhost:4000/mails/mails", {
                    params: {
                        count: count,
                        label: label
                    }
                }).then(resMails => {
                    if (resMails.data.length === 0) return Promise.resolve([])
                    return Promise.all(
                        resMails.data.map(mailInfo =>
                            axios.get("http://localhost:4000/people/person", {
                                params: {
                                    email: mailInfo.senderEmail,
                                    name: mailInfo.senderName
                                }
                            })
                                .then(pic => {
                                    return {...mailInfo, picture: pic.data}
                                })
                        )
                    )
                })
            })
        ).then((res) => setMails(LABELS.map((l, i) => res[i])))
    }
    const onMouseMove = (e) => setMousePos([e.clientX, e.clientY])
    const onMouseUp = () => {
        //dropping dragged person
        if (drag) {
            if (hoveredQueue === -1) return setDrag(false)
            addPersonToQueue(hoveredQueue, dragData, hoveredQueue === oldDragState[0])
        }
        setDrag(false)
    }

    useEffect(() => {
        fetchMailsAndPictures()
        window.addEventListener('mousemove', onMouseMove)
        return (() => window.removeEventListener('mousemove', onMouseMove))
    }, []);

    const removePersonFromQueue = (queueIndex, personIndex) => {
        const newQueue = mails[queueIndex]
        newQueue.splice(personIndex, 1)
        setMails([...mails.slice(0, queueIndex), newQueue, ...mails.slice(queueIndex + 1)])
    }

    /**
     * add a person to one of the queues, for now adding person to front of queue
     * @param queueIndex
     * @param personData
     * @param putBackInPreviousQueue
     */
    const addPersonToQueue = (queueIndex, personData, putBackInPreviousQueue) => {
        const personIndex= putBackInPreviousQueue?oldDragState[1]:0
        if (personIndex < 0 || queueIndex < 0) throw new Error("index can't be negative or else duplicates arrays")
        setMails([...mails.slice(0, queueIndex), [...mails[queueIndex].slice(0, personIndex), personData, ...mails[queueIndex].slice(personIndex)], ...mails.slice(queueIndex + 1)])
    }

    const listMails = (labelIndex) => {
        //TODO: (cosmetic) fade in people profiles
        return mails[labelIndex].map((m, i) => {
            return {picture: mails[labelIndex][i].picture, msg: m.subject, name: m.senderName}
        }).map(m => m)
    }

    const setDraggedPersonData = (labelIndex, personIndex) => {
        setDragData(mails[labelIndex][personIndex])
        setOldDragState([labelIndex, personIndex])
        removePersonFromQueue(labelIndex, personIndex)
    }

    const personQueues = () => {
        return LABELS.map((l, i) =>
            <PersonQueue queueIndex={i} title={l} list={listMails(i)}
                         queueHover={setHoveredQueue} selected={drag && hoveredQueue === i}
                         drag={drag} setDrag={setDrag}
                         setDragData={setDraggedPersonData}
            />
        )
    }

    const draggedPerson = () => {
        return <DraggablePerson data={dragData} pos={{x: mousePos[0], y: mousePos[1], z: 150}}/>
    }

    return (
        <div className="playground" onMouseUp={onMouseUp}>
            <Refresh whenRefresh={() => {
                fetchMailsAndPictures()
            }}/>
            {drag ? draggedPerson() : ""}
            {personQueues()}
            <TrashBin hovered={() => setHoveredQueue(-1)} open={drag}/>
        </div>
    )

}

export default Playground;