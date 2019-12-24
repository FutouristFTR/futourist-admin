import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

import { appRoutes } from "routes";
import { Places, Users, Outfits, Bundles, Reviews } from "appViews";

import PromptModal from "appComponents/Prompt/PromptModal";
import Sidebar from "appComponents/Navigation/Sidebar";
import UserAvatar from "appComponents/User/UserAvatar";
import { withFirebaseAuth } from "higherOrderComponents";
import AppNotification from "appComponents/Notifications/AppNotification";
import appVersion from "constants/appVersion";
import internalServer from "db/servers/internalServer";
import { setProjectId } from "redux/actions/projectActions";
import { FullSizeLoader } from "appComponents/Loaders";

function renderSubpage(match) {
  return (
    <Switch>
      <Route exact path={appRoutes.HOME} render={() => <Redirect to={appRoutes.REVIEWS} />} />
      <Route path={appRoutes.PLACES + "/:id?"} component={Places} />
      <Route path={appRoutes.USERS + "/:id?"} component={Users} />
      <Route path={appRoutes.OUTFITS + "/:id?"} component={Outfits} />
      <Route path={appRoutes.BUNDLES + "/:id?"} component={Bundles} />
      <Route path={appRoutes.REVIEWS + "/:id?"} component={Reviews} />
    </Switch>
  );
}

class App extends React.Component {
  componentDidMount() {
    internalServer.get("/getProjectId").then(response => {
      this.props.setProjectId(response.data.projectId);
    });
  }

  render() {
    if (!this.props.projectId) return <FullSizeLoader />;
    return (
      <main>
        <div className="wrapper">
          <Sidebar />
          <div className="mainContainer">
            <div className="topBar">
              <div className="row">
                <div className="col-6">
                  <i
                    className="fas fa-bars menuButton"
                    onClick={() => {
                      document.getElementById("sidebar").style.display = "initial";
                    }}
                  ></i>
                </div>
                <div className="col-6">
                  <UserAvatar />
                </div>
              </div>
            </div>
            <AppNotification />
            <PromptModal />
            <div className="content">{renderSubpage(this.props.match)}</div>
          </div>
        </div>

        <section className="footerSection">
          <h6>Admin dashboad version {appVersion}</h6>
        </section>
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    projectId: state.project.projectId,
  };
};

const dispatcher = function(dispatch) {
  return {
    setProjectId: function(projectId) {
      setProjectId(projectId, dispatch);
    },
  };
};

export default compose(connect(mapStateToProps, dispatcher))(withFirebaseAuth(App));
