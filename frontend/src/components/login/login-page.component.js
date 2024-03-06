import "../../styles/login/login-page.css";
import Icon from "../person/icon.component";

const LoginPage = (props) => {
    return (
        <div className={"login-page-container"}>
            <h1>Mailable</h1>
            <div className={"login-fields"}>
                <div className={"login-icons"}>
                    <Icon.Icon name={"Login"} fullName={true} pictureData={{type: Icon.PICTURE_TYPES.iconColour, value:"hsl(20,46%,41%)"}}/>
                    <svg viewBox={"0 0 500 500"}>
                        <g onClick={props.onLogin}>
                            <ellipse fill="transparent" cx={"250"} cy={"175"} rx={"105"} ry={"150"}/>
                            <path fill="hsl(20,46%,41%)"
                                  d={"M 0 500 L 500 500 L 475 390 L 350 300 L 250 275 L 150 300 L 25 390 L 0 500 Z"}/>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;