import "../../styles/person/person.css";
import {useState} from "react";
import Icon from "./icon.component";

const DraggablePerson = (props) => {
    const [size, setSize] = useState(1)
    const [brightness, setBrightness] = useState(1)


    return (
        <div className={"draggable-person"}
             style={{
                 transform: `translate(${props.pos.x}px, ${props.pos.y}px) scale(${size})`
             }}
        >
            <Icon name={props.data.name} pictureData={props.data.picture}/>

            <svg viewBox={"0 0 500 500"}>
                <g className={"hover-shape"}>
                    <ellipse fill="transparent" cx={"250"} cy={"175"} rx={"105"} ry={"150"}/>
                    <path fill="hsl(36, 39%, 59%)"
                          d={"M 0 500 L 500 500 L 475 390 L 350 300 L 250 275 L 150 300 L 25 390 L 0 500 Z"}/>
                </g>
            </svg>
        </div>
    )
}
//            <img className={"profile"} src={`faces/${props.picture}.png`}/>
export default DraggablePerson;