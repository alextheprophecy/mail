import Person from "./person.component";
import "../../styles/person/personqueue.css";
import {useEffect, useRef, useState} from "react";
import {waitFor} from "@testing-library/react";

const START_Z_DISTANCE = 175
const ITEM_Z_DISTANCE = 70
const ITEM_Y_DISTANCE = 45
const ITEM_X_OFFSET = 40

const UNFOCUSED_Z_OFFSET = 50;
const UNFOCUSED_Y_OFFSET = 60;

const PersonQueue = (props) => {
    const [scrollIndex, setScrollIndex] = useState(0)
    const [focused, setFocused] = useState(-1) //default -1: no person is focused

    const canAnimate = useRef(true)
    const prevList = useRef([])
    const canChangePos = useRef(true)

    const arraysEqual = (a, b) => {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        return a.every((val, i) => JSON.stringify(val) === JSON.stringify(b[i]))
    }

    const changeFocus = (index) => {
        setFocused(index)
        //TODO: logic to find and show person mail subject
        // if(index===-1)return
        //const msg = list[index].msg
    }

    const dragHandle = (index) => {
        if (!props.drag) props.setDragData(props.queueIndex, index)
        props.setDrag(true)
    }

    const scrollHandle = (event) => {
        const delta = -Math.max(-1, Math.min(1, (event.deltaY)))//.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
        setScrollIndex(Math.min(props.list.length - 1, Math.max(0, scrollIndex + delta)))
    }

    const people = () => {
        if (canChangePos.current) {
            if (!arraysEqual(prevList.current, props.list)) { //list was changed
                if(prevList.current.length<props.list.length) {//new element added
                    setScrollIndex(0)
                    canChangePos.current = false
                    const a = Promise.resolve().then(() => canChangePos.current = true);
                }else{ //element removed; find index of removal
                    setScrollIndex(Math.max(0,scrollIndex-1))
                }
            }
            prevList.current = props.list //update previous list ref
        }

        return props.list.map((p, i) => {
            const n = i - scrollIndex
            const animatingFirstPerson = !canChangePos.current&&i===0
            if (n < 0 || animatingFirstPerson) return "" //if scroll past this index, dont show this person


            return (<Person key={prevList[i]} index={i} setFocusedPerson={changeFocus} dragHandle={dragHandle}
                            opacity={opacityFunction(n)}
                            pos={canChangePos.current?positionFunction(i):positionFunction(i - 1)}
                            transition={canChangePos.current}
                            picture={p.picture} name={p.name}/>)
        })
    }

    const positionFunction = (i) => {
        const n = i - scrollIndex

        let yOffset = 0
        let zOffset = 0
        if (focused !== -1 && focused !== i) {
            yOffset = (i < focused ? UNFOCUSED_Y_OFFSET : -UNFOCUSED_Y_OFFSET)
            zOffset = (i < focused ? UNFOCUSED_Z_OFFSET : -UNFOCUSED_Z_OFFSET)
        }
        return {
            'x': Math.pow(-1, i) * ITEM_X_OFFSET,
            'y': -n * ITEM_Y_DISTANCE + yOffset,
            'z': START_Z_DISTANCE - smoothingFunction(n) * ITEM_Z_DISTANCE + zOffset
        }
    }

    const smoothingFunction = (x) => { //smoothing function I designed on www.desmos.com
        const base = 1.2
        return (Math.log(x + 5) / Math.log(base)) - 10
    }

    const opacityFunction = (x) => {
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