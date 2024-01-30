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

    const [hold, setHold] = useState(false) //is holding mouse down
    const [startHold, setStartHold] = useState([0, 0]) //mouse down starting coordinates
    const DRAG_MIN_DISTANCE = 15

    const onHover = () => {
        setBrightness(HOVERED_BRIGHT_INCR)
        setSize(HOVERED_SIZE_INCR)
    }

    const exitHover = () => {
        props.setFocusedPerson(-1)
        setHold(false)

        setBrightness(UNFOCUSED_BRIGHT)
        setSize(UNFOCUSED_SIZE)
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
            props.setFocusedPerson(props.index)
            setSize(FOCUSED_SIZE_INCR)
        }
        setHold(false)
        //TODO:USE THIS TO IMPLEMENT ADDITION TO QUEUES
        props.letGoHandle()
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
        <div className={"person"}
             style={{
                 transform: `rotateX(10deg) translate3d(${props.pos.x}px, ${props.pos.y}px, ${props.pos.z}px) scale(${size})`,
                 filter: `contrast(${props.opacity}%) brightness(${brightness})`,
             }}
        >
            <Icon name={props.name} pictureData={props.picture}/>

            <svg viewBox={"0 0 500 500"}>
                <g className={"hover-shape"} onMouseOver={onHover} onMouseOut={exitHover}
                   onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMove}>
                    <ellipse fill="transparent" cx={"250"} cy={"175"} rx={"105"} ry={"150"}/>
                    <path fill="hsl(36, 40%, 59%)"
                          d={"M 0 500 L 500 500 L 475 390 L 350 300 L 250 275 L 150 300 L 25 390 L 0 500 Z"}/>
                </g>
            </svg>
        </div>
    )
}
//            <img className={"profile"} src={`faces/${props.picture}.png`}/>
export default Person;