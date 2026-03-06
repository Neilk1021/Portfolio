
import './App.css'
import './components/ExpandableButton'
import ExpandableButton from "./components/ExpandableButton.tsx";
import RouterLink from "./components/RouterLink.tsx";

function Home() {

  return (
    <div className={"HomePage"}>
      <div className={"Header"}>
        <h1>c:/Users/Neil</h1>
      </div>
      <div className={"Content"}>
        <ExpandableButton name={"Games"} children={
            <>
                <RouterLink name="Japanese Salaryman" link={"japanese_salaryman"}/>
                <RouterLink name="Salaryman Surveillance" link={"surveillance"}/>
                <RouterLink name="S.A.R.G.E" link={"japanese_salaryman"}/>
                <RouterLink name="Dope Ass Game Simulator" link={"japanese_salaryman"}/>
                <RouterLink name="Ultracult" link={"japanese_salaryman"}/>
            </>}>
        </ExpandableButton>

        <ExpandableButton name={"Systems/Software"} children={
            <>
                <RouterLink name="N-Body Simulation" link={"japanese_salaryman"}/>
                <RouterLink name="VGDC - Pitch Sorting" link={"japanese_salaryman"}/>
                <RouterLink name="College ROI Calculator" link={"japanese_salaryman"}/>
                <RouterLink name="Generic C++ Terminal Framework" link={"japanese_salaryman"}/>
            </>
        }/>
          <ExpandableButton name={"About"}/>
          <ExpandableButton name={"Resume"}/>
          <ExpandableButton name={"Contact"}/>
      </div>
    </div>
  )
}

export default Home;


//        <button className={"TerminalButton"}>Games</button>
//         <button className={"TerminalButton"}>Systems/Software</button>
//         <button className={"TerminalButton"}>Blog</button>
//         <button className={"TerminalButton"}>About</button>
//         <button className={"TerminalButton"}>Contact</button>