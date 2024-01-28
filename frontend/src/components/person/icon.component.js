import "../../styles/person/icon.css";
const Icon = ({name}) => {
    const initials = () => {
        const names = name.split(" ")
        return names.map(n=>n[0].toUpperCase()).join('.')
    }

    return (
        <div className={"icon"}>
            {initials()}
        </div>
    )
}
export default Icon;