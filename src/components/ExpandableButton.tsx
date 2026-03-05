import './ExpandableButton.css'
import {useState} from "react";
import * as React from "react";

interface Props {
    name : string;
    children?: React.ReactNode;
}

function ExpandableButton({name, children} : Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const OnClick = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <div>
            <button
                className={"TerminalButton"}
                onClick={OnClick}
            >{name}
            </button>
            <div className={`content ${isExpanded ? 'expanded' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export default ExpandableButton;