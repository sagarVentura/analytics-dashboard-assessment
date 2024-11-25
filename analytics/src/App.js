import logo from './logo.svg';
import './App.css';
import {  RouterProvider } from "react-router-dom";
import appRoute from './AppRoutes'


function App() {
  return (
    <div className="App">
      <RouterProvider router={appRoute} />
    </div>
  );
}

export default App;
