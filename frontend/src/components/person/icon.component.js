import "../../styles/person/icon.css";

const Icon = ({name, colour}) => {
    const ImageTypes = {
        myWebsite: "my-website",
        epfl: "epfl",
        wikiSearch: "wikipedia-search",
        iconColour: "icon-colour"
    }


    const initials = () => {
        const names = name.replace(/[^a-z ]/gi, '').toString().split(" ") //except for spaces
        return names.map((n,i) => (i===0?n.slice(0,4):n[0]).toUpperCase()).join('.').concat(".")
    }

    return (
        <div className={"icon"} style={{backgroundColor:colour}}>
            {initials()}
        </div>
    )
}
export default Icon;