import "../../styles/person/person.css";

const Person = (props) => {

    return (
        <img src="faces/musk.png" className={"person"}  style={{transform: `rotateX(10deg) translate3d(${props.pos.x}px, ${props.pos.y}px, ${props.pos.z}px)`,
            filter: `contrast(${props.opacity}%)`}}/>
    )
}

export default Person;