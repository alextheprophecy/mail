import "../../styles/person/person.css";
import {useState} from "react";

const Person = (props) => {
    const HOVERED_BRIGHT_INCR = 1.15
    const UNFOCUSED_BRIGHT = 1
    const HOVERED_SIZE_INCR = 1.05
    const FOCUSED_SIZE_INCR = 1.15
    const UNFOCUSED_SIZE = 1

    const [size, setSize] = useState(1)
    const [brightness, setBrightness] = useState(1)

    const [focus, setFocus] = useState(false)

    const onHover = () => {
        setBrightness(HOVERED_BRIGHT_INCR)
        setSize(HOVERED_SIZE_INCR)

    }
    const exitHover = () => {
        props.setFocusedPerson(-1)
        setFocus(false)

        setBrightness(UNFOCUSED_BRIGHT)
        setSize(UNFOCUSED_SIZE)
    }
    const onClick = () => {
        if (focus) showSubject()
        props.setFocusedPerson(props.index)
        setFocus(true)

        setSize(FOCUSED_SIZE_INCR)
    }

    const showSubject = () => {

    }

    return (
        <div className={"person-container"}>
            <div className={"text-container"}>
                {focus ? (<div className={"speech-bubble"}>

                    Subject matter: IMPORTANT NEWS
                </div>) : ""}
            </div>

            <div className={"person-image-container"}>
                <div className={"person"}
                     style={{
                         transform: `rotateX(10deg) translate3d(${props.pos.x}px, ${props.pos.y}px, ${props.pos.z + (focus?300:0)}px) scale(${size})`,
                         filter: `contrast(${props.opacity}%) brightness(${brightness})`,
                     }}
                >
                    <svg viewBox={"0 0 500 500"}>
                        <g className={"hover-shape"} onMouseOver={onHover} onMouseOut={exitHover} onClick={onClick}>
                            <ellipse fill="white" cx={"250"} cy={"175"} rx={"110"} ry={"125"}/>
                            <path fill="white"
                                  d={"M 0 500 L 500 500 L 475 390 L 350 300 L 250 275 L 150 300 L 25 390 L 0 500 Z"}/>
                        </g>
                    </svg>
                </div>
            </div>
        </div>)
}
//
export default Person;