import PersonQueue from "../person/personqueue.component";
import "../../styles/playground/playground.css";
const Playground = () => {

    return (
        <div className="playground">
            <PersonQueue info={[{image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'man', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}]}/>
            <PersonQueue info={[{image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}]}/>
            <PersonQueue info={[{image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'musk', msg:'msg'}, {image:'man', msg:'msg'}, {image:'man', msg:'msg'}, {image:'man', msg:'msg'}]}/>
            <PersonQueue info={[{image:'musk', msg:'msg'}]}/>
        </div>
    )

}

export default Playground;