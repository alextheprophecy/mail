import Person from "./person.component";
import "../../styles/person/personqueue.css";
import {useEffect, useState} from "react";

const START_Z_DISTANCE = 150
const ITEM_Z_DISTANCE = 55
const ITEM_Y_DISTANCE = 45
const ITEM_X_OFFSET = 35
const PersonQueue = ({list, title}) => {
    const [queue, setQueue] = useState(list)
    const [scrollPointer, setScrollPointer] = useState(0)

    const scrollHandle = (event) => {
        const delta = Math.max(-1, Math.min(1, (event.deltaY)))//.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
        setScrollPointer(Math.min(queue.length-1, Math.max(0, scrollPointer+delta)))
    }

    const people = () => {
        return queue.map((p, i) => {
            const n = i-scrollPointer
            if (n<0) return "" //if scroll past this index, dont show this person

            return (<Person opacity={100 - 4 * n}
                            pos={{
                                'x': Math.pow(-1, i) * ITEM_X_OFFSET,
                                'y': -n * ITEM_Y_DISTANCE,
                                'z': START_Z_DISTANCE - smoothingFunction(n) * ITEM_Z_DISTANCE
                            }}
                            image={p.image}/>)
        })
    }

    const smoothingFunction = (x) => { //smoothing function I designed on www.desmos.com
        const base = 1.2
        return (Math.log(x + 5) / Math.log(base)) - 10
    }

    return (
        <div>
            <p className={"queue-name"}>{title}</p>
            <div className={"queue-wrapper"} onWheel={scrollHandle}>
                {people()}
            </div>
        </div>
    )
}

export default PersonQueue;