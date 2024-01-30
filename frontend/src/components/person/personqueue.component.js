import Person from "./person.component";
import "../../styles/person/personqueue.css";
import {useEffect, useState} from "react";

const START_Z_DISTANCE = 150
const ITEM_Z_DISTANCE = 70
const ITEM_Y_DISTANCE = 45
const ITEM_X_OFFSET = 35

const UNFOCUSED_Z_OFFSET = 50;
const UNFOCUSED_Y_OFFSET = 60;

const PersonQueue = (props) => {
    const [scrollIndex, setScrollIndex] = useState(0)
    const [focused, setFocused] = useState(-1) //default -1: no person is focused
    const [dragging, setDragging] = useState(false) //is user dragging a person around

    const changeFocus = (index) => {
        setFocused(index)
        //TODO: logic to find and show person mail subject
        // if(index===-1)return
        //const msg = list[index].msg
    }

    const dragHandle = (index) => {
        if (!props.drag) props.removePerson(index)
        props.setDrag(true)
        props.setDragData(props.list[index])
    }

    const letGoHandle = () => {}//TODO: this implementation might prove useful for drag dropping people -> setDragging(false)

    const scrollHandle = (event) => {
        const delta = -Math.max(-1, Math.min(1, (event.deltaY)))//.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
        setScrollIndex(Math.min(props.list.length - 1, Math.max(0, scrollIndex + delta)))
    }

    const people = () => {
        return props.list.map((p, i) => {
            const n = i - scrollIndex
            if (n < 0) return "" //if scroll past this index, dont show this person
            let yOffset = 0
            let zOffset = 0
            if (focused !== -1 && focused !== i) {
                yOffset = (i < focused ? UNFOCUSED_Y_OFFSET : -UNFOCUSED_Y_OFFSET)
                zOffset = (i < focused ? UNFOCUSED_Z_OFFSET : -UNFOCUSED_Z_OFFSET)
            }
            return (<Person index={i} setFocusedPerson={changeFocus} dragHandle={dragHandle} letGoHandle={letGoHandle}
                            opacity={opacityFunction(n)}
                            pos={{
                                'x': Math.pow(-1, i) * ITEM_X_OFFSET,
                                'y': -n * ITEM_Y_DISTANCE + yOffset,
                                'z': START_Z_DISTANCE - smoothingFunction(n) * ITEM_Z_DISTANCE + zOffset
                            }}
                            picture={p.picture} name={p.name}/>)
        })
    }

    const smoothingFunction = (x) => { //smoothing function I designed on www.desmos.com
        const base = 1.2
        return (Math.log(x + 5) / Math.log(base)) - 10
    }

    const opacityFunction = (x) => {
        return Math.max(100 - 5 * x, 50)
    }

    return (
        <div className={"queue-container"} onMouseOver={()=>props.queueHover(props.index)}>
            <p className={"queue-name"}>{props.title}</p>
            <div className={"queue-wrapper"} onWheel={scrollHandle}>
                {people()}
            </div>
        </div>
    )
}

export default PersonQueue;