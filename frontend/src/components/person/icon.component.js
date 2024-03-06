import "../../styles/person/icon.css";

const PP_WIDTH = 100 //epfl-profile in icon.css
const PP_HEIGHT = 110 //epfl-profile in icon.css
const PP_PADDING = 10 //epfl-profile in icon.css

const PICTURE_TYPES = {
    myWebsite: "my-website",
    epfl: "epfl",
    wikiSearch: "wikipedia-search",
    iconColour: "icon-colour"
}
const Icon = (props) => {
    const initials = () => {
        if (!props.name || props.name.length === 0) return "ERR"
        if (props.fullName) return props.name
        const names = props.name.replace(/[^a-z ]/gi, '').toString().split(" ") //except for spaces
        //TODO: fix familyname
        const firstAndLast = [names[0], names.pop()]// (names[0] === lastName) ? [names[0], names.pop()] : [names[0]]
        return firstAndLast.map((n, i) => (i === 0 ? n.toUpperCase().slice(0, 3) : n.toUpperCase())[0]).join('.').concat(".")
    }

    const epflProfilePicture = () => {
        const ratioW = PP_WIDTH / props.pictureData.faceW
        const ratioH = PP_HEIGHT / props.pictureData.faceH
        const style = props.pictureData ?
            {
                left: `${PP_PADDING-props.pictureData.faceX * ratioW}px`,
                top: `${PP_PADDING-props.pictureData.faceY * ratioH}px`,
                width: `${props.pictureData.imgW * ratioW}px`,
                height: `${props.pictureData.imgH * ratioH}px`
            } : {}

        return <img className={"icon-image"} style={style} width={"100px"} src={props.pictureData ?
            props.pictureData.url : "https://people.epfl.ch/private/common/photos/links/107537.jpg"}/>
    }

    /**
     * sets background colour or not of icon if picture data is icon colour
     * @return {{backgroundColor}|{}}
     */
    const iconStyle = () => props.pictureData.type === PICTURE_TYPES.iconColour ? {backgroundColor: props.pictureData.value} :
        {width:`${PP_WIDTH}px`, height:`${PP_HEIGHT}px`, padding:`${PP_PADDING}px`}

    const className = () => props.drag ? "drag-icon" : props.pictureData.type === PICTURE_TYPES.iconColour ? "icon" : "epfl-profile"
    return (
        <div className={className()} style={iconStyle()}>
            {props.pictureData.type === PICTURE_TYPES.iconColour ? initials() : epflProfilePicture()}
        </div>
    )
}

export default {Icon, PICTURE_TYPES};