import React from "react";
import GuideModal from '../components/home/guide/GuideModal'

var GuideContext = React.createContext();

const GuideProvider = ({children}) => {
    var [guide, setGuide] = React.useState(!localStorage.getItem("guide"));

    var openGuide = () => {
        setGuide(true);
    }

    var closeGuide = () => {
        setGuide(false);
    }

    return (
        <GuideContext.Provider value={ {guide, openGuide, closeGuide} }>
            <GuideModal/>
            {children}
        </GuideContext.Provider>
    )
}

export { GuideContext, GuideProvider };