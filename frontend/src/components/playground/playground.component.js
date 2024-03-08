import "../../styles/playground/playground.css";
import {useEffect, useState} from "react";

import axios from 'axios';

import PersonQueue from "../person/personqueue.component";
import DraggablePerson from "../person/draggable.person.component";
import TrashBin from "./trashbin.component";
import Refresh from "../navbar/refresh.component";
import Snippet from "./snippet.component";
import LabelMenu from "./label-menu.component";
import {hover} from "@testing-library/user-event/dist/hover";

const Playground = () => {
    const LABELS = ["INBOX", "EPFL", "SENT", "IMPORTANT"]//, "INBOX", "TRASH"]//["INBOX", "CHAT", "SENT", "SPAM"]
    const COUNT = 5
    const LOAD_BATCH = 5

    const [mails, setMails] = useState(new Array(LABELS.length).fill([]))

    const [drag, setDrag] = useState(false)
    const [dragData, setDragData] = useState(0) //currently dragged person object
    const [oldDragState, setOldDragState] = useState([-1, -1]) //label index and array index of person pre-drag
    const [select, setSelect] = useState([{top: 0, bottom: 0}, null]) //stores data on person selected in a queue [0]: y function position, [1]: queue index, [2]: person mail data

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
                        label: label,
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
                            }).then(pic => {
                                return {...mailInfo, picture: pic.data}
                            })
                        )
                    )
                })
            })
        ).then((res) => setMails(LABELS.map((l, i) => res[i])))
    }

    const loadMorePeopleInQueue = (queueIndex, lastMailIndex) => {
        return axios.get("http://localhost:4000/mails/mails", {
            params: {
                count: LOAD_BATCH,
                label: LABELS[queueIndex],
                index: lastMailIndex
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
                    }).then(pic => {
                        return {...mailInfo, picture: pic.data}
                    })
                )
            )
        }).then(res => addPersonToQueue(queueIndex, res, lastMailIndex))
    }

    const onMouseMove = (e) => setMousePos([e.clientX, e.clientY])
    const onMouseUp = () => {
        //dropping dragged person
        if (drag) {
            if (hoveredQueue === -1) return setDrag(false)
            addPersonToQueue(hoveredQueue, dragData, hoveredQueue === oldDragState[0] ? oldDragState[1] : 0)
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
     * @param personIndex
     */
    const addPersonToQueue = (queueIndex, personData, personIndex = 0) => {
        if (personIndex < 0 || queueIndex < 0) throw new Error("index can't be negative or else duplicates arrays")
        //if personData is an array of people, use spread operator on data
        setMails(personData.length ?
            [...mails.slice(0, queueIndex), [...mails[queueIndex].slice(0, personIndex), ...personData, ...mails[queueIndex].slice(personIndex)], ...mails.slice(queueIndex + 1)] :
            [...mails.slice(0, queueIndex), [...mails[queueIndex].slice(0, personIndex), personData, ...mails[queueIndex].slice(personIndex)], ...mails.slice(queueIndex + 1)])
    }

    const listMails = (labelIndex) => {
        //TODO: (cosmetic) fade in people profiles
        return mails[labelIndex].map((m, i) => {
            return {
                picture: m.picture,
                subject: m.subject,
                name: m.senderName,
                email: m.senderEmail,
                date: m.date,
                time: m.time
            }
        }).map(m => m)
    }

    const setDraggedPersonData = (labelIndex, personIndex) => {
        setDragData(mails[labelIndex][personIndex])
        setOldDragState([labelIndex, personIndex])
        removePersonFromQueue(labelIndex, personIndex)
    }

    const personQueues = () => {
        const x = hoveredQueue
        return LABELS.map((l,i)=>{
            return i===x?<div className={"queue-container"}></div>:queueComponent(l,i)
        })
    }

    const highlightedQueue = () => {
        const x= hoveredQueue
        return LABELS.map((l,i)=>{
            return i!==x?<div className={"queue-container"} style={{pointerEvents:"none"}} ></div>:queueComponent(l,i)
        })
    }

    const queueComponent = (l, i) => <PersonQueue queueIndex={i} title={l} list={listMails(i)}
                                                  queueHover={setHoveredQueue} selected={drag && hoveredQueue === i}
                                                  drag={drag} setDrag={setDrag}
                                                  setSelect={setSelect}
                                                  setDragData={setDraggedPersonData}
                                                  replenishQueue={(lastMailIndex) => loadMorePeopleInQueue(i, lastMailIndex)}/>




    const draggedPerson = () => {
        return <DraggablePerson data={dragData} pos={{x: mousePos[0], y: mousePos[1], z: 150}}/>
    }

    return (
        <>
            <div className="playground" onMouseUp={onMouseUp}>
                <Refresh whenRefresh={() => {
                    fetchMailsAndPictures()
                }}/>
                {drag ? draggedPerson() : ""}
                {personQueues()}
                <Snippet data={select}/>
                <TrashBin hovered={() => setHoveredQueue(-1)} open={drag}/>
            </div>
            <div className="playground" onMouseUp={onMouseUp}>
                {highlightedQueue()}
            </div>
        </>
    )
//            <LabelMenu/>
}

export default Playground;