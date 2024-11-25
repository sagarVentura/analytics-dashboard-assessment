import { Outlet } from "react-router-dom";
import Header from "./Header";

function Landing() {
  return (
    <div>
        <Header/>
        <Outlet/>
        
    </div>
  )
}
export default Landing