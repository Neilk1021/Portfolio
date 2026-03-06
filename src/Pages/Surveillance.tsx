import './Surveillance.css'
import {Link} from "react-router-dom";

export default function Surveillance() {
    return (
        <>
            <div className={"SurveillancePage"}>
                <Link to={"/"} className={"Header"}>
                    <h1>c:/Games/Salaryman_Surveillance</h1>
                </Link>
                <div className={"body"}>
                    <div className={"Left"}>
                        <div className={"Content"}>
                            <h2>Synopsis</h2>
                            <p>Collect information on people and then combine it to make more
                                valuable information and sell it to make a lot of money. Fabricate favors from people's
                                data to unlock more abilities.
                            </p>
                            <h2>Feats</h2>
                            <h2>Responsibilities</h2>
                        </div>
                    </div>
                    <div className={"Right"}>
                    </div>
                </div>
            </div>

        </>
    );
}