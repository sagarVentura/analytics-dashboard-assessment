import App from "./component/TableFilter";

const { createBrowserRouter } = require("react-router-dom");
const { default: Landing } = require("./Landing");
const { default: Table } = require("./component/Table");

const Routes=createBrowserRouter([
    {
        path:"/",
        element:<Landing/>,
        children:[
            {
           path:"/",
        element:<App/>,
            },
            {
                path:"/graph",
                element:<Table/>
            }
        ]
        
    }
]);

export default Routes;