import Person from "./person.component";
import "../../styles/person/personqueue.css";
import {useEffect, useState} from "react";

const START_Z_DISTANCE = 150
const ITEM_Z_DISTANCE = 70
const ITEM_Y_DISTANCE = 45
const ITEM_X_OFFSET = 35

const UNFOCUSED_Z_OFFSET = 50;
const UNFOCUSED_Y_OFFSET = 60;

const PersonQueue = ({list, title}) => {
    const [queue, setQueue] = useState(list)
    const [scrollIndex, setScrollIndex] = useState(0)
    const [focused, setFocused] = useState(-1) //default -1: no person is focused

    const changeFocus = (index) => {
        setFocused(index)
        //TODO: logic for telling playground which person/text to show
        if(index===-1)return
        const msg = list[index].msg
    }

    const dragHandle = (index) => {
    }

    const scrollHandle = (event) => {
        const delta = -Math.max(-1, Math.min(1, (event.deltaY)))//.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
        setScrollIndex(Math.min(queue.length - 1, Math.max(0, scrollIndex + delta)))
    }

    const people = () => {
        return queue.map((p, i) => {
            const n = i - scrollIndex
            if (n < 0) return "" //if scroll past this index, dont show this person
            let yOffset = 0
            let zOffset = 0
            if (focused !== -1 && focused !== i) {
                yOffset = (i < focused ? UNFOCUSED_Y_OFFSET : -UNFOCUSED_Y_OFFSET)
                zOffset = (i < focused ? UNFOCUSED_Z_OFFSET : -UNFOCUSED_Z_OFFSET)
            }
            return (<Person index={i} setFocusedPerson={changeFocus} dragHandle={dragHandle} opacity={100 - 4 * n}
                            pos={{
                                'x': Math.pow(-1, i) * ITEM_X_OFFSET,
                                'y': -n * ITEM_Y_DISTANCE + yOffset,
                                'z': START_Z_DISTANCE - smoothingFunction(n) * ITEM_Z_DISTANCE + zOffset
                            }}
                            image={p.image}/>)
        })
    }

    const smoothingFunction = (x) => { //smoothing function I designed on www.desmos.com
        const base = 1.2
        return (Math.log(x + 5) / Math.log(base)) - 10
    }

    return (
        <div className={"queue-container"}>
            <p className={"queue-name"}>{title}</p>
            <div className={"queue-wrapper"} onWheel={scrollHandle}>
                {people()}
            </div>
        </div>
    )
}

export default PersonQueue;