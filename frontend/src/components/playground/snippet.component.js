import "../../styles/playground/snippet.css";
import Lottie, {LottieRef} from "lottie-react";
import animationData from "../../lottiefiles/mail-animation.json"
import {useEffect, useRef, useState} from "react";
import {wait} from "@testing-library/user-event/dist/utils";
import Person from "../person/person.component";
import {FOCUSED_SIZE_INCR} from "../person/person.constants";

const Snippet = (props) => {
    const HEIGHT_FACTOR = 0
    const opacity = useRef(0)
    const changing = useRef(false)

    useEffect(() => {
        if (!props.data[0]) opacity.current = 0
        setTimeout(() => {
            console.log("change" + props.data[0])
            opacity.current = 1
        }, 1000);
    }, [props.data[0]]);

    return (
        //TODO: make animation: letter mail opens, text is already hald showing through opening, mail mail falls off and dissapears down, leaving text
        //TODO: (visual bug) on person drag, snippet stays visible until hover other person
        <>

        </>
        /* {props.data[0] ?
                <div className={"speech-shape"} style={{
                    bottom: `${props.data[0].bottom}px`,
                    left: `${props.data[0].left + props.data[0].width/2}px`,
                    height: `${props.data[0].height*FOCUSED_SIZE_INCR}px`
                }}>
                    <div></div>
                </div>
                 : ""}


                 <img key={opacity.current} src={"ui/speechbubble.svg"} style={{
                    top: `${topPos()}px`,
                    left: `${props.data[0].right - (width() / 4)}px`,
                    width: `${width()}px`,
                    height: `${boxHeight()}px`,
                    opacity: 1
                }} className={"speech-bubble"}/>

                (<div className={"snippet-container"}
             style={{
                 top: `${topPos()}px`,
                 left: `${props.data[0].right}px`,
                 width: `${Math.min(boxHeight(), 250)}px`
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

        </div>) */

    )
}
export default Snippet;