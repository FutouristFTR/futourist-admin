import React, { Component } from "react";
import ReactPlayer from "react-player";
import queryString from "query-string";

import {
  getAuthUsersPage,
  updateAuthUser,
  getAuthUsersByEmailsFromDb,
  getAuthUsersByIdsFromDb,
} from "db/admin";
import { withNotifications, withPrompt } from "higherOrderComponents";
import { withRouter, Link } from "react-router-dom";
import QueryFilter from "appComponents/QueryFilter/QueryFilter";
import { FullSizeLoader } from "appComponents/Loaders";
import Card from "appComponents/Cards/Card";
import { hasScrolledToBottom } from "utils";
import { paginatedBatchSize } from "constants/database";
import { appRoutes } from "routes";

class Users extends Component {
  constructor(props) {
    super(props);

    let queryParams =
      props.location && props.location.search ? queryString.parse(props.location.search) : {};

    this.state = {
      users: [],
      nextPageToken: null,
      loading: true,
      defaultSearch: {
        term: queryParams.uid ? queryParams.uid : queryParams.email ? queryParams.email : "",
        fieldIndex: queryParams.email ? 1 : 0,
      },
    };
  }

  componentDidMount() {
    if (this.state.defaultSearch.term) {
      if (this.state.defaultSearch.fieldIndex === 0) {
        this.getById(this.state.defaultSearch.term);
      } else if (this.state.defaultSearch.fieldIndex === 1) {
        this.getByEmail(this.state.defaultSearch.term);
      }
    } else {
      this.getPaginatedData();
    }
    window.addEventListener("scroll", () => this.handleScroll());
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", () => this.handleScroll());
    window.scrollTo(0, 0);
  }

  handleScroll() {
    if (hasScrolledToBottom() && this.state.nextPageToken && !this.state.loading) {
      this.getPaginatedData();
    }
  }

  handleSearch({ term, field }) {
    if (!term) {
      this.getPaginatedData();
      this.props.history.push(appRoutes.USERS);
    } else {
      if (field === "email") {
        this.getByEmail(term);
      } else if (field === "uid") this.getById(term);

      this.props.history.push(appRoutes.USERS + "?" + field + "=" + term);
    }
  }

  getPaginatedData() {
    this.setState({ loading: true });
    getAuthUsersPage(paginatedBatchSize, this.state.nextPageToken || undefined)
      .then(response => {
        this.setState({
          users: [...this.state.users, ...response.users],
          nextPageToken: response.nextPageToken,
          loading: false,
        });
      })
      .catch(err => console.log(err));
  }

  getByEmail(email) {
    this.setState({ users: [], loading: true });
    getAuthUsersByEmailsFromDb([email]).then(users => this.setState({ users, loading: false }));
  }

  getById(id) {
    this.setState({ users: [], loading: true });
    getAuthUsersByIdsFromDb([id]).then(users => this.setState({ users, loading: false }));
  }

  toggleDisableUser(user, index) {
    updateAuthUser(user.uid, { disabled: !user.disabled }).then(() => {
      let newUsers = Array.from(this.state.users);
      newUsers[index].disabled = !user.disabled;
      this.setState({ users: newUsers });
    });
  }

  renderMedia(review) {
    if (review.type === "image")
      return (
        <img
          alt="Review"
          className={"d-block w-100"}
          style={{ width: "100%" }}
          src={review.mediaLinks["310x550"]}
        />
      );
    else if (review.type === "video")
      return (
        <div className={"d-block w-100"}>
          <ReactPlayer
            controls
            style={{ width: "100%" }}
            url={`https://stream.mux.com/${review.mediaId}.m3u8`}
            width="100%"
            height="unset"
          />
        </div>
      );
  }

  render() {
    // return <div></div>;

    let { users, loading } = this.state;
    return (
      <div>
        <h2>Users</h2>
        <p>Displaying {(users && users.length) || 0} documents&nbsp;</p>
        <div className="row">
          <div className="col-sm-12 col-md-9">
            <QueryFilter
              onClick={whereQuery => this.handleSearch(whereQuery)}
              default={this.state.defaultSearch}
              fields={[
                { value: "uid", label: "User ID" },
                { value: "email", label: "User email" },
              ]}
            />
          </div>
        </div>

        <div className="row">
          {users.map((user, index) => {
            let userId = user.uid;

            const userStatusColor = user.disabled ? "red" : "green";
            const userButtonType = user.disabled ? "success" : "danger";
            const userButtonText = user.disabled ? "Disabled" : "Enabled";

            let userActions = (
              <button
                type="button"
                className={`btn btn-outline-${userButtonType}`}
                id={"editBundleButton-" + userId}
                onClick={() => this.toggleDisableUser(user, index)}
              >
                {user.disabled ? "Enable" : "Disable"}
              </button>
            );

            return (
              <div className="col-sm-12 col-md-6 col-xl-4" key={user.uid}>
                <Card className="collectionListCard">
                  <h3>
                    <strong>{index + 1}.</strong>{" "}
                    <span>{user.username || user.email || user.uid}</span>
                  </h3>
                  <div>
                    {user.profilePhoto && user.profilePhoto["500x500"] ? (
                      <img className="placeImage" src={user.profilePhoto["500x500"]} alt="User" />
                    ) : (
                      <div style={{ width: "100%", textAlign: "center" }}>
                        <i
                          style={{ fontSize: 72, margin: "50px auto" }}
                          className="fas fa-camera"
                        />
                      </div>
                    )}
                  </div>
                  <br />
                  <div>
                    Status:{" "}
                    <span className="" style={{ color: userStatusColor }}>
                      <strong>{userButtonText}</strong>
                    </span>
                  </div>
                  <div>
                    UID: <strong>{(user && user.uid) || "/"}</strong>
                  </div>
                  <div>
                    Username: <strong>{(user && user.username) || "/"}</strong>
                  </div>
                  <div>
                    Email: <strong>{(user && user.email) || "/"}</strong>
                  </div>
                  <div>
                    Bio: <strong>{user.bio}</strong>
                  </div>
                  <div>
                    Reviews: <strong>{user.reviews ? user.reviews.length : 0}</strong>
                    {(user.reviews && user.reviews.length && (
                      <Link className="normal-link" to={appRoutes.REVIEWS + "?userId=" + user.uid}>
                        {" "}
                        - See all reviews
                      </Link>
                    )) ||
                      ""}
                  </div>
                  <br />
                  <div>{userActions}</div>
                </Card>
              </div>
            );
          })}
        </div>
        {loading ? <FullSizeLoader /> : null}
      </div>
    );
  }
}

export default withNotifications(withPrompt(withRouter(Users)));
