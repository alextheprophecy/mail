import "../../styles/person/icon.css";

const Icon = ({name, pictureData}) => {
    const PICTURE_TYPES = {
        myWebsite: "my-website",
        epfl: "epfl",
        wikiSearch: "wikipedia-search",
        iconColour: "icon-colour"
    }

    const initials = () => {
        const names = name.replace(/[^a-z ]/gi, '').toString().split(" ") //except for spaces
        return names.map((n, i) => (i === 0 ? n.slice(0, 3) : n[0]).toUpperCase()).join('.').concat(".")
    }

    /**
     * sets background colour or not of icon if picture data is only icon colour
     * @return {{backgroundColor}|{}}
     */
    const iconStyle = () => pictureData.type === PICTURE_TYPES.iconColour ? {backgroundColor: pictureData.value} : {}

    return (
        <div className={"icon"} style={iconStyle()}>
            {initials()}
        </div>
    )
}
export default Icon;