import "../../styles/person/person.css";
import {useRef, useState} from "react";
import Icon from "./icon.component";
import {
    BENT_OVER_OPACITY, BENT_OVER_X_ROT,
    DRAG_MIN_DISTANCE, FOCUSED_BRIGHT_INCR, FOCUSED_SIZE_INCR,
    HOVERED_BRIGHT_INCR,
    HOVERED_SIZE_INCR,
    INITIAL_BRIGHT,
    INITIAL_SIZE, INITIAL_X_ROT, TRANSITION_TIME
} from "./person.constants";

const Person = (props) => {

    const [showSubject, setShowSubject] = useState(false)

    const [size, setSize] = useState(1)
    const [brightness, setBrightness] = useState(1)

    const [hold, setHold] = useState(false) //is holding mouse down
    const [startHold, setStartHold] = useState([0, 0]) //mouse down starting coordinates

    const personRef = useRef()

    const onHover = () => {
        setBrightness(HOVERED_BRIGHT_INCR)
        setSize(HOVERED_SIZE_INCR)
    }

    const exitHover = () => {
        props.setFocusedPerson(-1)
        setShowSubject(false)
        setHold(false)

        setBrightness(INITIAL_BRIGHT)
        setSize(INITIAL_SIZE)
    }

    const onMove = (e) => {
        /**
         * dragging
         */
        if (hold && (euclDistOldHold(e.clientX, e.clientY) >= DRAG_MIN_DISTANCE)) {
            props.dragHandle(props.index)
        }
    }

    const onMouseUp = () => {
        /**
         * clicking
         */
        if (hold) {
            setShowSubject(true)
            props.setFocusedPerson(props.index, personRef.current.getBoundingClientRect())
            setBrightness(FOCUSED_BRIGHT_INCR)
            setSize(FOCUSED_SIZE_INCR)
        }
        setHold(false)
    }

    const onMouseDown = (e) => {
        setStartHold([e.clientX, e.clientY])
        setHold(true)
    }

    /**
     * Euclidean dist between current x,y pos and old mouse position
     * @param x
     * @param y
     * @return {number}
     */
    const euclDistOldHold = (x, y) => {
        return Math.sqrt(Math.pow(startHold[0] - x, 2) + Math.pow(startHold[1] - y, 2));
    }

    return (
        <div ref={personRef} className={"person"}
             style={{
                 transform: `translate3d(${props.transform.x}px, ${props.transform.y}px, ${props.transform.z}px) scale(${size}) rotateX(${props.transform.bendOver?BENT_OVER_X_ROT:INITIAL_X_ROT}deg)`,
                 filter: `contrast(${props.opacity}%) brightness(${brightness}) opacity(${props.transform.bendOver?BENT_OVER_OPACITY:1})`,
                 transition: `transform ease ${props.transition?TRANSITION_TIME:0}s`

             }}
        >
            {showSubject?
                <div className={"subject-container"}>
                    <div className={"subject-slider"}></div>
                </div> :""}

            <Icon.Icon name={props.personData.name} pictureData={props.personData.picture}/>

            <svg viewBox={"0 0 500 500"}>
                <g className={"hover-shape"} onMouseEnter={onHover} onMouseLeave={exitHover}
                   onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMove}>
                    <ellipse fill="transparent" cx={"250"} cy={"175"} rx={"105"} ry={"150"}/>
                    <path fill="hsl(36, 40%, 59%)"
                          d={"M 0 500 L 500 500 L 475 390 L 350 300 L 250 275 L 150 300 L 25 390 L 0 500 Z"}/>
                </g>
            </svg>
            <div className={"person-date"}>
                {props.personData.date}
                <div className={"person-time"}>{props.personData.time}</div>
            </div>
        </div>
    )
}
//            <img className={"profile"} src={`faces/${props.picture}.png`}/>
export default Person;