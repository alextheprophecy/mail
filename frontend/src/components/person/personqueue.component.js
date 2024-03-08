import Person from "./person.component";
import "../../styles/person/personqueue.css";
import {useEffect, useRef, useState} from "react";

const START_Z_DISTANCE = 200
const ITEM_Z_DISTANCE = 70
const ITEM_Y_DISTANCE = 45
const ITEM_X_OFFSET = 40

const END_LIST_COUNT_MIN = 20 //when scrolled s.t. n elements left, load more mails
const MAX_RENDER_COUNT = 25
const PersonQueue = (props) => {
    const [scrollIndex, setScrollIndex] = useState(0)
    const [focused, setFocused] = useState(-1) //default -1: no person is focused

    const prevList = useRef(props.list)
    const canAnimate = useRef(true)

    const arraysEqual = (a, b) => {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        return a.every((val, i) => JSON.stringify(val) === JSON.stringify(b[i]))
    }

    const firstElementDiffers = (a, b) => {
        return JSON.stringify(a[0]) !== JSON.stringify(b[0])
    }

    const changeFocus = (index, boundingRect) => {
        setFocused(index) //TODO: remove? and use playground select state? but then rerenders this personqueue when select a person in another queue...
        props.setSelect([boundingRect, index < 0 ? -1 : props.queueIndex, index >= 0 ? props.list[index] : null])
    }

    const dragHandle = (index) => {
        if (!props.drag) {
            setFocused(-1)
            props.setDragData(props.queueIndex, index)
        }
        props.setDrag(true)
    }

    const scrollHandle = (event) => {
        const delta = -Math.max(-1, Math.min(1, (event.deltaY)))//.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
        setScrollIndex(Math.min(props.list.length - 1, Math.max(0, scrollIndex + delta)))
        //replenish queue (add new mails to top) if scrolled past threshhold
        //TODO: uncomment during production
        //if (props.list.length - scrollIndex <= END_LIST_COUNT_MIN) props.replenishQueue(props.list.length)
    }

    const people = () => {
        if (canAnimate.current) {
            //TODO: when to animate queue? under which conditions.
            if (firstElementDiffers(prevList.current, props.list)) {      //if (!arraysEqual(prevList.current, props.list)) { //list was changed
                if (prevList.current.length < props.list.length) {//new element added
                    setScrollIndex(0)
                    canAnimate.current = false
                    Promise.resolve().then(() => canAnimate.current = true);
                } else {
                    //TODO: element removed; find index of removal
                    setScrollIndex(Math.max(0, scrollIndex - 1))
                }
            }
            prevList.current = props.list //update previous list ref
        }

        //TODO: fix bent over people layering looks wrong, people in-front clipping under people behind
        return props.list.map((m, i) => {
            const n = i - scrollIndex
            const animatingFirstPerson = !canAnimate.current && i === 0
            if (n < 0 || n > MAX_RENDER_COUNT || animatingFirstPerson) return "" //if scroll past this index, dont show this person

            return (<Person index={i} setFocusedPerson={changeFocus} dragHandle={dragHandle}
                            opacity={opacityFunction(n, i)}
                            transform={canAnimate.current ? positionFunction(i) : positionFunction(i - 1)}
                            transition={canAnimate.current}
                            personData={personDataFunction(m)}/>)
        })
    }

    const personDataFunction = (mail) => {
        return {picture: mail.picture, name: mail.name, date: mail.date, time: mail.time}
    }

    const positionFunction = (i) => {
        const n = i - scrollIndex
        const bendOver = focused !== -1 && focused !== i && i < focused

        return {
            'x': Math.pow(-1, i) * ITEM_X_OFFSET,
            'y': -n * ITEM_Y_DISTANCE,
            'z': START_Z_DISTANCE - smoothingFunction(n) * ITEM_Z_DISTANCE,
            bendOver: bendOver
        }
    }
    const smoothingFunction = (x) => { //smoothing function I designed on www.desmos.com
        const base = 1.2
        return (Math.log(x + 5) / Math.log(base)) - 10
    }

    const opacityFunction = (x, i) => {
        if (i === focused) return 100
        return Math.max(100 - 5 * x, 50)
    }

    const brightnessFunction = (x) => {
        return Math.max(0.1 * x, 0)
    }

    return (
        <div className={"queue-container"} onMouseEnter={() => props.queueHover(props.queueIndex)}>
            <p className={"queue-name"}>{props.title}</p>
            <div className={"queue-wrapper"} onWheel={scrollHandle}>
                {people()}
            </div>
            {props.selected ? <div className={"queue-blur-layer"}/> : ""}
        </div>
    )
}

export default PersonQueue;