import React, {Component, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {Container} from "reactstrap";
import {AppFooter, AppHeader} from "@coreui/react";
import {PropagateLoader} from "react-spinners";
import {getSettings} from "../../services/common";
import {Helmet} from "react-helmet";
import {changeSettings} from "../../redux/actions/settings";
import Auth from "../../services/auth/Auth";
import Sider from "./SiderMenu";
import routes from "../../routes";
import Callback from "../../services/auth/Callback";
import {connect} from "react-redux";
import {ApiService} from "../../services/ApiService";
import "./DefaultLayout.scss";

const auth = new Auth();
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

class DefaultLayout extends Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.facilityKey !== this.props.facilityKey && prevProps.facilityKey) {
      this.setState({
        isLoading: true
      }, () => this.setState({isLoading: false}))
    }
  }

  async componentDidMount() {
    if (!this.props.facilitiesData.length) {
      let data = await this._apiService.getFacilities();
      if (!data.error) {
        const newState = {};
        if (!this.props.facilityKey && (data || []).length > 0) {
          newState.selectedKey = data[0].PKey_Facility;
          localStorage.setItem('facilityKey', data[0].PKey_Facility);
          newState.facilityKey = data[0].PKey_Facility;
        }
        this.props.onChangeSettings({
          facilitiesData: data || [],
          ...newState
        });
        this.setState({
          isLoading: false,
        })
      }
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  loading = () => <div className="loading">{' '}<PropagateLoader color={'#165d93'} /></div>

  signOut = () => {
    auth.logout();
  }

  render() {
    const {theme, sideBarCollapsed, headerColor, headerBGColor, bodyColor, bodyBGColor, evenRowBgColor,
    buttonBGColor, buttonTextColor, menuIconColor, menuTextColor, menuBGColor, menuBorderColor, sectionTextColor, sectionBGColor, rowHoverColor, rowHoverBGColor} = this.props;
    const {isLoading} = this.state;
    const getClasses = () => {
      let colorString = '';
      if (headerColor) {
        colorString += ` grid-header-${headerColor}`;
      }
      if (headerBGColor) {
        colorString += ` grid-header-bg-${headerBGColor}`;
      }
      if (bodyColor) {
        colorString += ` grid-body-${bodyColor}`;
      }
      if (bodyBGColor) {
        colorString += ` grid-body-bg-${bodyBGColor}`;
      }
      if (evenRowBgColor) {
        colorString += ` grid-even-row-${evenRowBgColor}`;
      }
      if (buttonBGColor) {
        colorString += ` button-bg-${buttonBGColor}`;
      }
      if (buttonTextColor) {
        colorString += ` button-text-${buttonTextColor}`;
      }
      if (menuIconColor) {
        colorString += ` menu-icon-${menuIconColor}`;
      }
      if (menuTextColor) {
        colorString += ` menu-text-${menuTextColor}`;
      }
      if (menuBGColor) {
        colorString += ` menu-bg-${menuBGColor}`;
      }
      if (menuBorderColor) {
        colorString += ` menu-border-${menuBorderColor}`;
      }
      if (sectionTextColor) {
        colorString += ` section-text-${sectionTextColor}`;
      }
      if (sectionBGColor) {
        colorString += ` section-bg-${sectionBGColor}`;
      }
      if (rowHoverColor) {
        colorString += ` row-hover-${rowHoverColor}`;
      }
      if (rowHoverBGColor) {
        colorString += ` row-hover-bg-${rowHoverBGColor}`;
      }
      return colorString;
    }
    return (
      <div className={`app ${theme === 'dark' ? 'black' : 'light'} ${getClasses()}`}>
        <AppHeader fixed>
          <Suspense fallback={<div/>}>
            <DefaultHeader onLogout={this.signOut} history={this.props.history}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <Sider/>
          <main className="main">
            {/*<AppBreadcrumb appRoutes={routes}/>*/}
            {
              isLoading ? this.loading() :
                <Container fluid>
                  <Suspense fallback={this.loading()}>
                    <Switch>
                      <Route exact path="/callback" render={(props) => {
                        handleAuthentication(props);
                        return <Callback {...props} />
                      }}/>
                      {routes.map((route, idx) => {
                        return route.component ? (
                          <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={props => (
                              <>
                              <Helmet>
                                <title>{route.title || route.name} {getSettings('logoText') ? ` - ${getSettings('logoText')}` : ''}</title>
                              </Helmet>
                              <div className="page-title">
                                <div className="page-logo-square">{route.logo}</div><div className="page-name">{route.name}</div>
                              </div>
                              <route.component {...props} />
                              </>
                            )} />
                        ) : (null);
                      })}
                      <Redirect from="/" to="/dashboard" />
                    </Switch>
                  </Suspense>
                </Container>
            }
          </main>
        </div>
        <AppFooter className={sideBarCollapsed ? 'collapsed' : ''}>
          <Suspense fallback={<div/>}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
  sideBarCollapsed: state.settings.sideBarCollapsed,
  headerColor: state.settings.headerColor,
  headerBGColor: state.settings.headerBGColor,
  bodyColor: state.settings.bodyColor,
  bodyBGColor: state.settings.bodyBGColor,
  evenRowBgColor: state.settings.evenRowBgColor,
  buttonBGColor: state.settings.buttonBGColor,
  buttonTextColor: state.settings.buttonTextColor,
  menuIconColor: state.settings.menuIconColor,
  menuTextColor: state.settings.menuTextColor,
  menuBGColor: state.settings.menuBGColor,
  menuBorderColor: state.settings.menuBorderColor,
  sectionTextColor: state.settings.sectionTextColor,
  sectionBGColor: state.settings.sectionBGColor,
  facilityKey: state.settings.facilityKey,
  facilitiesData: state.settings.facilitiesData || [],
  rowHoverColor: state.settings.rowHoverColor,
  rowHoverBGColor: state.settings.rowHoverBGColor,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeSettings: (state) => {
    return dispatch(changeSettings(state))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout)

