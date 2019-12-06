import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {PropagateLoader} from "react-spinners";
import {createStore} from "redux";
import {Provider} from "react-redux";
import Loadable from "react-loadable";
import {allReducers} from "./redux/reducers";
import Auth from "./services/auth/Auth";
import {getSettings} from "./services/common";
import "./App.scss";
import "antd/dist/antd.min.css";
import "react-perfect-scrollbar/dist/css/styles.css";

const auth = new Auth();

const store = createStore(
  allReducers,
  {},
  window.devToolsExtension && window.devToolsExtension()
);

const loading = () => <div className="loading" style={{width: '100%'}}>{' '}<PropagateLoader color={'#165d93'} /></div>;

const ReportViewer = Loadable({
  loader: () => import('./views/Reports/ReportViewer'),
  loading: () => null
});

const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading: () => null
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

class App extends Component {

  constructor(props) {
    super(props);
    if (localStorage.getItem('idToken')) {
      auth.renewSession();
    } else {
      window.location.href = '/login';
    }
  }

  componentDidMount() {
    try {
      if (window.signalR && getSettings('signalRMethod') && getSettings('signalRUrl')) {
        let connection = new window.signalR.HubConnectionBuilder().withUrl(getSettings('signalRUrl')).build();

        connection.on(getSettings('signalRMethod'), function () {
          alert('Recieved');
        });
        connection.start().catch(function (err) {
          return console.error(err.toString());
        });
      }
    } catch (err) {}
  }

  render() {
    return (
     <Provider store={store}>
        <BrowserRouter>
            <Switch>
              <Route exact path="/404" name="Page 404" component={Page404} />
              <Route exact path="/500" name="Page 500" component={Page500} />
              <Route exact path="/report-viewer" name="Page 500" component={ReportViewer} />
              <Route path="/" name="Home" component={DefaultLayout} />
            </Switch>
        </BrowserRouter>
     </Provider>
    );
  }
}

export default App;
