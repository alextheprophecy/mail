import Person from "./person.component";
import "../../styles/person/personqueue.css";

const START_Z_DISTANCE = 170
const ITEM_Z_DISTANCE = 55
const ITEM_Y_DISTANCE = 100
const ITEM_X_OFFSET = 65
const PersonQueue = ({info}) => {

    const people = () => {
        return info.map((p, i) => {
            return (<Person opacity={100-4*i}
                pos={{'x':Math.pow(-1, i) * ITEM_X_OFFSET, 'y': -i*ITEM_Y_DISTANCE, 'z': START_Z_DISTANCE - smoothingFunction(i) * ITEM_Z_DISTANCE}}
                            image={p.image}/>)
        })
    }

    const smoothingFunction = (x) => { //smoothing function I designed on www.desmos.com
        const base = 1.2
        return (Math.log(x+5) / Math.log(base)) -10
    }

    return (
        <div className={"queue-wrapper"}>
            {people()}
        </div>
    )
}

export default PersonQueue;