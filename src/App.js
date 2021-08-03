import FetchApIBeginner from "./FetchApIBeginner";
import NavBar from "./NavBar";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Intermediate from "./Intermediate";
import Home from "./Home";

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/beginner" exact component={FetchApIBeginner} />
        <Route path="/intermediate" exact component={Intermediate} />
      </Switch>
    </Router>
  );
}

export default App;
