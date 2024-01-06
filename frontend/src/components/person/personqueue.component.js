import Person from "./person.component";
import "../../styles/person/personqueue.css";

const START_Z_DISTANCE = 170
const ITEM_Z_DISTANCE = 50
const ITEM_Y_DISTANCE = 50
const ITEM_X_OFFSET = 55

const PersonQueue = ({info}) => {

    const people = () => {
        return info.map((p, i) => {
            return (<Person
                pos={{'x':Math.pow(-1, i) * ITEM_X_OFFSET, 'y': -i*ITEM_Y_DISTANCE, 'z': START_Z_DISTANCE - i * ITEM_Z_DISTANCE}}
                            image={p.image}/>)
        })
    }

    return (
        <div className={"queue-wrapper"}>
            {people()}
        </div>
    )
}

export default PersonQueue;