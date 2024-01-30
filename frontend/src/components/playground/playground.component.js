import PersonQueue from "../person/personqueue.component";
import DraggablePerson from "../person/draggable.person.component";

import "../../styles/playground/playground.css";
import {useEffect, useState} from "react";

import axios from 'axios';
import {hover} from "@testing-library/user-event/dist/hover";

const Playground = () => {
    const LABELS = ["INBOX", "SENT", "TRASH"]//, "INBOX", "TRASH"]//["INBOX", "CHAT", "SENT", "SPAM"]
    const COUNT = 10
    const [mails, setMails] = useState(new Array(LABELS.length).fill([]))
    const [pictures, setPictures] = useState(new Array(LABELS.length).fill([]))

    const [drag, setDrag] = useState(false)
    const [dragData, setDragData] = useState(0) //currently dragged person object
    const [mousePos, setMousePos] = useState([0, 0])
    const [hoveredQueue, setHoveredQueue] = useState(0) //index of queue that mouse is hovering

    /**
     * parallel fetch of mails by labels filters-> for each mail parallel fetch of people by mail senderEmail info -> concatenation of results as array for n labels of [mail informations for label i, picture for label i]
     * then stores data into states once all concurrent promises are handled
     */
    const fetchMailsAndPictures = (count) => {
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
                            axios.get("http://localhost:4000/people/person", {params: {email: mailInfo.senderEmail}})
                                .then(pics => [mailInfo, pics.data])
                        )
                    )
                })
            })
        ).then((res) => {
            setMails(
                LABELS.map((l, i) => res[i].map(e => e[0]))
            )
            setPictures(
                LABELS.map((l, i) => res[i].map(e => e[1]))
            )
        })
    }

    const onMouseMove = (e) => {
        setMousePos([e.clientX, e.clientY])
    }

    useEffect(() => {
        fetchMailsAndPictures(COUNT)
        window.addEventListener('mousemove', onMouseMove)
        return (() => window.removeEventListener('mousemove', onMouseMove))
    }, []);

    const removePersonFromQueue = (queueIndex, personIndex, list, setList) => {
        const newQueue = list[queueIndex]
        newQueue.splice(personIndex, 1)
        setList([...list.slice(0, queueIndex), newQueue, ...list.slice(queueIndex + 1)])
    }

    /**
     * add a person to one of the queues, for now adding person to front of queue
     * @param queueIndex
     * @param personData
     */
    const addPersonToQueue = (queueIndex, personData) => {

    }


    const listMails = (labelIndex) => {
        //TODO: (cosmetic) fade in people profiles
        return mails[labelIndex].map((m, i) => {
            return {picture: pictures[labelIndex][i], msg: m.subject, name: m.senderName}
        })
    }

    const personQueues = () => {
        return LABELS.map((l, i) =>
            <PersonQueue index={i} title={l} list={listMails(i)}
                         queueHover={(i) => setHoveredQueue(i)}
                         drag={drag} setDrag={setDrag} setDragData={setDragData}
                         removePerson={(p) => {
                             removePersonFromQueue(i, p, mails, setMails)
                             removePersonFromQueue(i, p, pictures, setPictures)
                         }}
            />
        )
    }

    const draggedPerson = () => {
        return <DraggablePerson data={dragData} pos={{x: mousePos[0], y: mousePos[1], z: 150}}/>
    }

    return (
        <div className="playground" onMouseUp={() => setDrag(false)}>
            {drag ? draggedPerson() : ""}
            {personQueues()}
        </div>
    )

}

export default Playground;