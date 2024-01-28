import "../../styles/person/person.css";
import {useState} from "react";
import Icon from "./icon.component";

const Person = (props) => {
    const HOVERED_BRIGHT_INCR = 1.15
    const UNFOCUSED_BRIGHT = 1
    const HOVERED_SIZE_INCR = 1.05
    const FOCUSED_SIZE_INCR = 1.15
    const UNFOCUSED_SIZE = 1

    const [size, setSize] = useState(1)
    const [brightness, setBrightness] = useState(1)

    const [focus, setFocus] = useState(false) //is focusing current person component

    const [hold, setHold] = useState(false) //is holding mouse down
    const [startHold, setStartHold] = useState([0, 0]) //mouse down starting coordinates
    const [drag, setDrag] = useState(false) //is dragging current person component
    const DRAG_MIN_DISTANCE = 20
    const onHover = () => {
        setBrightness(HOVERED_BRIGHT_INCR)
        setSize(HOVERED_SIZE_INCR)
    }

    const exitHover = () => {
        props.setFocusedPerson(-1)
        setFocus(false)
        setHold(false)

        setBrightness(UNFOCUSED_BRIGHT)
        setSize(UNFOCUSED_SIZE)
    }

    const onMove = (e) => {
        /**
         * dragging
         */
        if (hold && (euclDistOldHold(e.clientX, e.clientY) >= DRAG_MIN_DISTANCE)) {
            alert("movin")

        }
    }

    const onMouseUp = (e) => {
        /**
         * clicking
         */
        if (hold) {
            props.setFocusedPerson(props.index)
            setFocus(true)
            setSize(FOCUSED_SIZE_INCR)
        }

        setHold(false)
    }

    const onMouseDown = (e) => {
        setStartHold([e.clientX, e.clientY])
        setHold(true)
    }

    /**
     * euclidean dist between current x,y pos and old mouse position
     * @param x
     * @param y
     * @return {number}
     */
    const euclDistOldHold = (x, y) => {
        return Math.sqrt(Math.pow(startHold[0] - x, 2) + Math.pow(startHold[1] - y, 2));
    }

    return (
        <div className={"person"}
             style={{
                 transform: `rotateX(10deg) translate3d(${props.pos.x}px, ${props.pos.y}px, ${props.pos.z}px) scale(${size})`,
                 filter: `contrast(${props.opacity}%) brightness(${brightness})`,
             }}
        >
            <Icon name={"Alexandre Marie Bourgoin"}/>
            <svg viewBox={"0 0 500 500"}>
                <g className={"hover-shape"} onMouseOver={onHover} onMouseOut={exitHover}
                   onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMove}>
                    <ellipse fill="white" cx={"250"} cy={"175"} rx={"105"} ry={"150"}/>
                    <path fill="white"
                          d={"M 0 500 L 500 500 L 475 390 L 350 300 L 250 275 L 150 300 L 25 390 L 0 500 Z"}/>
                </g>
            </svg>
        </div>
    )
}
//            <img className={"profile"} src={`faces/${props.image}.png`}/>
export default Person;