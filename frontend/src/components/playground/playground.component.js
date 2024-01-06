import PersonQueue from "../person/personqueue.component";
import "../../styles/playground/playground.css";
const Playground = () => {

    return (
        <div className="playground">
            <PersonQueue info={[['img', 'msg'], ['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'],['img', 'msg'], ['img', 'msg'], ['img', 'msg'], ['img', 'msg']]}/>
            <PersonQueue info={[['img', 'msg'], ['img', 'msg'], ['img', 'msg'], ['img', 'msg']]}/>
            <PersonQueue info={[['img', 'msg']]}/>
            <PersonQueue info={[['img', 'msg']]}/>
        </div>
    )

}

export default Playground;