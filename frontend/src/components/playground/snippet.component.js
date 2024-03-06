import "../../styles/playground/snippet.css";
import Lottie, {LottieRef} from "lottie-react";
import animationData from "../../lottiefiles/mail-animation.json"
import {useEffect, useRef, useState} from "react";
import {wait} from "@testing-library/user-event/dist/utils";

const Snippet = (props) => {
    const [shrunk, shrink] = useState(false)
    const [msg, setMsg] = useState(["", ""])
    const lottieRef = useRef();
    const HEIGHT_FACTOR = 0


    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(3.5)
            lottieRef.current.playSegments([0, 35], true)
            shrink(false)
        }
    }, [props.data[0]]);

    const boxHeight = () => {
        return props.data[0].bottom - props.data[0].top
    }
    const topPos = () => {
        return props.data[0].top - HEIGHT_FACTOR * boxHeight()
    }

    const width = () => Math.min(boxHeight(), 250)

    const showMessage = () => {
        shrink(true)
        if(props.data[2]){
            const data = props.data[2]
            setMsg([data.email,data.subject])
        }
    }

    return (
        //TODO: make animation: letter mail opens, text is already hald showing through opening, mail mail falls off and dissapears down, leaving text
        //TODO: (visual bug) on person drag, snippet stays visible until hover other person
        props.data[0] ? (
            <div className={"snippet-container"}
                 style={{
                     top: `${topPos()}px`,
                     left: `${props.data[0].right}px`,
                     width: `${width()}px`
                 }}>

                <Lottie lottieRef={lottieRef} className={"snippet-img"} animationData={animationData} loop={false}
                        onComplete={() => showMessage()} style={{opacity: `${shrunk ? 0 : 1}`}}
                />
                <div className={"snippet-text-container"} style={{opacity: `${shrunk ? 1 : 0}`, scale:`${shrunk ? 1 : 0.5}`}}>
                    <div className={"snippet-text-header"}>
                        {msg[0]}
                    </div>
                    <div className={"snippet-text"}>
                        {msg[1]}
                    </div>
                </div>

            </div>) : ""
    )
}
export default Snippet;