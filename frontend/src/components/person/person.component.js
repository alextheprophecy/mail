import "../../styles/person/person.css";

const Person = (props) => {
    const randomImage = () => {
        const images = ["musk", "man", "face"]
        const i = Math.floor(Math.random()*images.length)
        return images[i]
    }

    return (
        <img src={`faces/${props.image}.png`} className={"person"} style={{transform: `rotateX(10deg) translate3d(${props.pos.x}px, ${props.pos.y}px, ${props.pos.z}px)`,
            filter: `contrast(${props.opacity}%)`}}/>
    )
}

export default Person;