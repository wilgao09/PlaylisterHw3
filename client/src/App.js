import "./App.css";
import { React } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Banner, ListSelector, PlaylistCards, Statusbar } from "./components";
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    return (
        <div id="app-root">
            <Router>
                <Banner />
                <Switch>
                    <Route path="/" exact component={ListSelector} />
                    <Route
                        path="/playlist/:id"
                        exact
                        component={PlaylistCards}
                    />
                </Switch>
                <Statusbar />
            </Router>
        </div>
    );
};

export default App;
