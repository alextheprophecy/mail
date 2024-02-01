import "../../styles/playground/trashbin.css";
import {useState} from "react";

const TrashBin = (props) => {
    return (
        <div className={"trash-bin-container"}>
            <div className={"bin-inner"} onMouseEnter={props.hovered} style={{rotate:`${props.open?0:-90}deg`}}>
                <img className={"bin-image"} src={"ui/delete.png"}/>
            </div>
        </div>
    )
}
export default TrashBin;