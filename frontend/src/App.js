import React,{Fragment} from 'react'
import {BrowserRouter as Router,Switch,Route,Redirect} from "react-router-dom";

import Client_Dashbord from './components/Dashbords/Client_Dashbord';
import Login from "./components/Authtication/Login";
import Register from "./components/Authtication/Register";

function App() {
  return (
    <Fragment>
    {/*}  <Router>
        <Switch>
          <Route path="/register" component={Register}  />
        </Switch>
      </Router>*/}
       {/*<Register />*/}
       <Login />
       
    </Fragment>
  );
}

export default App;
