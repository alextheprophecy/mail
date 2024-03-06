import "../styles/main.css";
import Playground from "./playground/playground.component";
import {useState} from "react";
import LoginPage from "./login/login-page.component";

const Main = () => {
    const [loggedIn, logIn] = useState(false)
    return (
        <div className={"main-container"}>
            {loggedIn?<Playground/>:<LoginPage onLogin={()=>logIn(true)}/>}

        </div>
    )
}

export default Main;