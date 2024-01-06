import "../../styles/person/person.css";

const Person = (props) => {

    return (
        <img src="face.png" className={"box"}  style={{transform: `rotateX(10deg) translate3d(${props.pos.x}px, ${props.pos.y}px, ${props.pos.z}px)`}}/>
    )
}

export default Person;