import "../../styles/person/person.css";
import {useState} from "react";

const Person = (props) => {
    const [colour, setColour] = useState("transparent")
    const [focus, setFocus] = useState(false)

    const onHover = () => {
        setColour("red")
    }

    const exitHover = () => {
        setColour("transparent")
    }

    return (
        <div className={"person"}
             style={{
                 transform: `rotateX(10deg) translate3d(${props.pos.x}px, ${props.pos.y}px, ${props.pos.z}px)`,
                 filter: `contrast(${props.opacity}%)`,
                 backgroundColor: `${colour}`

             }}
        >
            <img className={"profile"} src={`faces/${props.image}.png`}/>
            <svg viewBox={"0 0 500 500"}>
                <g className={"hover-shape"} onMouseOver={onHover} onMouseOut={exitHover}>
                    <ellipse fill="white" cx={"250"} cy={"175"} rx={"110"} ry={"125"}/>
                    <path fill="white" d={"M 0 500 L 500 500 L 475 390 L 350 300 L 250 275 L 150 300 L 25 390 L 0 500 Z"}/>
                </g>
            </svg>

        </div>)
}
//
export default Person;