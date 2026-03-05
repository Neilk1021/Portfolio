import './JSM.css'
import {Link} from "react-router-dom";

import preview_one from '../assets/jsm_test_one.jpg'
import preview_two from '../assets/jsm_test_two.jpg'
import preview_three from '../assets/jsm_test_three.jpg'

function JSM(){

    return (
        <>
        <div className={"JSMPage"}>
            <div className={"body"}>
                <div className={"Left"}>
                    <Link to={"/"} className={"Header"}>
                        <h1>c:/Games/Japanese_Salaryman</h1>
                    </Link>
                    <div className={"Content"}>
                        <h2>Synopsis</h2>
                        <p>Persona meets Factorio</p>
                        <p>You are a 30-something salaryman working a dead-end job when
                            you get pulled into stealing some information from your company to pay off your
                            gambling debts.
                        </p>

                        <h2>Feats</h2>
                        <ul>
                            <li>2.5k Wishlists on Steam</li>
                            <li>800 Demo Downloads</li>
                            <li>100% Positive rating on Steam with 20 reviews.</li>
                        </ul>
                        <h2>Responsibilities</h2>
                        <p>I was the team lead for the game directing a team of 12, specifically I: </p>
                        <ul>
                            <li>Designed & Engineered all core gameplay systems</li>
                            <li>Authored a custom interpreted scripting language in C# for managing in-game cutscenes,
                                significantly improving the narrative team's workflow.</li>
                            <li>Designed and implemented a robust event-driven day system using SQL for the backend and a
                                custom Unity tool for the frontend, enabling designers to rapidly create and modify in-game
                                daily schedules.</li>

                        </ul>
                    </div>
                </div>
                <div className={"Right"}>
                    <img src={preview_one}/>
                    <img src={preview_two}/>
                </div>
            </div>
        </div>

        </>
    )
}

export default JSM;