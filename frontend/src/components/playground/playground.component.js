import PersonQueue from "../person/personqueue.component";
import "../../styles/playground/playground.css";
const Playground = () => {

    return (
        <div className="playground">
            <PersonQueue title={"EPFL"} list={[{image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'man', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}]}/>
            <PersonQueue title={"Work"} list={[{image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}]}/>
            <PersonQueue title={"Friends"} list={[{image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'man', msg:'msg'}, {image:'man', msg:'msg'}]}/>
            <PersonQueue title={"Spam"} list={[{image:'musk', msg:'msg'}]}/>
        </div>
    )

}

export default Playground;