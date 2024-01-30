import "../../styles/person/icon.css";

const Icon = (props) => {
    const PICTURE_TYPES = {
        myWebsite: "my-website",
        epfl: "epfl",
        wikiSearch: "wikipedia-search",
        iconColour: "icon-colour"
    }

    const initials = () => {
        if(!props.name)return "ERR"
        const names = props.name.replace(/[^a-z ]/gi, '').toString().split(" ") //except for spaces
        const firstAndLast = [names[0], names.pop()]
        return firstAndLast.map((n, i) => (i === 0 ? n.slice(0, 3) : n[0]).toUpperCase()).join('.').concat(".")
    }

    /**
     * sets background colour or not of icon if picture data is only icon colour
     * @return {{backgroundColor}|{}}
     */
    const iconStyle = () => props.pictureData.type === PICTURE_TYPES.iconColour ? {backgroundColor: props.pictureData.value} : {}

    return (
        <div className={props.drag?"drag-icon":"icon"} style={iconStyle()}>
            {initials()}
        </div>
    )
}
export default Icon;