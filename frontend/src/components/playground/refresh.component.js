import "../../styles/playground/refresh.css";

const Refresh = (props) => {
    return (
        <div className={"refresh-button"} onClick={()=>props.whenRefresh()}>
            <img className={"refresh-img"} src={"ui/refresh2.png"}/>
        </div>
    )
}
export default Refresh;