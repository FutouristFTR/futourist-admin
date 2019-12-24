import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { firebaseCollections } from "constants/database";
import { bundleStatuses } from "constants/statusCodes";

import {
  searchInObject,
  makeImageUrl,
  makeSortedArrayFromObject,
  sortArray,
  dateToString,
  takeFirstXElementsOfArray,
  hasScrolledToBottom,
} from "utils";
import { withCollection } from "higherOrderComponents";
import { setDocumentWithMergeInDb } from "db";

import Card from "appComponents/Cards/Card";
import SearchInput from "appComponents/Search/SearchInput";
import FullSizeLoader from "appComponents/Loaders/FullSizeLoader";
import SortingButtons from "appComponents/Sorting/SortingButtons";
// import FilterButtons from "appComponents/Sorting/FilterButtons";
import { AddBundle, EditBundle } from "appViews";
import { fileTypes } from "constants/media";
import { appRoutes } from "routes";

const scrollRowSize = 50;

class Bundles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bundlesDocuments: props.bundlesDocuments,
      filteredBundles: makeSortedArrayFromObject(props.bundlesDocuments),
      renderedBundles: takeFirstXElementsOfArray(
        makeSortedArrayFromObject(props.bundlesDocuments),
        scrollRowSize
      ),
      renderedCount: 0,
      loadingCollection: props.loadingCollection,
      editingBundle: null,
      editModalOpened: false,
      searchText: "",
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleEditClicked = this.handleEditClicked.bind(this);
    this.openEditingModal = this.openEditingModal.bind(this);
  }

  componentDidMount() {
    // for rendering more places once we scroll to the bottom
    window.addEventListener("scroll", () => this.handleScroll());
  }

  componentWillUnmount() {
    // for rendering more places once we scroll to the bottom
    window.removeEventListener("scroll", () => this.handleScroll());
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.loadingCollection === true &&
      this.props.loadingCollection === false &&
      this.props.match.params.id &&
      this.props.bundlesDocuments[this.props.match.params.id] &&
      this.state.editModalOpened === false
    ) {
      this.setState({ editModalOpened: true });
      this.openEditingModal(this.props.bundlesDocuments[this.props.match.params.id]);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};
    if (JSON.stringify(nextProps.bundlesDocuments) !== JSON.stringify(prevState.bundlesDocuments)) {
      newState.bundlesDocuments = nextProps.bundlesDocuments;
      newState.filteredBundles = makeSortedArrayFromObject(nextProps.bundlesDocuments);
      if (prevState.searchText.length > 0) {
        // search with same query again, when new places come in
        let searchResults = searchInObject(prevState.searchText, nextProps.bundlesDocuments);
        newState.filteredBundles = makeSortedArrayFromObject(searchResults);
      }
      newState.renderedBundles = takeFirstXElementsOfArray(newState.filteredBundles, scrollRowSize);
      newState.renderedCount = newState.renderedBundles.length;

      if (prevState.editingBundle) {
        newState.editingBundle = nextProps.bundlesDocuments[prevState.editingBundle.id];
      }
    }
    if (nextProps.loadingCollection !== prevState.loadingCollection) {
      newState.loadingCollection = nextProps.loadingCollection;
    }
    return Object.keys(newState).length ? newState : null;
  }

  handleScroll() {
    if (hasScrolledToBottom()) {
      this.renderMoreRows();
    }
  }

  handleSearch(e) {
    let searchText = e.target.value;
    this.setState({ searchText });
    let searchResults = searchInObject(searchText, this.props.bundlesDocuments);
    const filteredBundles = makeSortedArrayFromObject(searchResults);
    const renderedBundles = takeFirstXElementsOfArray(filteredBundles, scrollRowSize);

    this.setState({
      filteredBundles,
      renderedBundles,
    });
  }

  handleSort(fieldName, order) {
    const filteredBundles = sortArray(this.state.filteredBundles, fieldName, order);
    const renderedBundles = takeFirstXElementsOfArray(filteredBundles, scrollRowSize);
    this.setState({
      filteredBundles,
      renderedBundles,
    });
  }

  handleStatusChange(statusCode, bundleId) {
    statusCode = parseInt(statusCode, 10);
    setDocumentWithMergeInDb(bundleId, { status: statusCode }, firebaseCollections.BUNDLES)
      .then(() => {
        this.props.updateDocumentInCollection(
          bundleId,
          { status: statusCode },
          firebaseCollections.BUNDLES
        );
        this.forceUpdate();
      })
      .catch(error => {
        this.forceUpdate();
        console.error(error);
      });
  }

  handleEditClicked(bundle) {
    this.setState({
      editingBundle: bundle,
    });
    this.props.history.push(appRoutes.BUNDLES + "/" + bundle.id);
  }

  openEditingModal(bundle) {
    this.handleEditClicked(bundle);
    document.getElementById("hiddenEditBundleModalOpener").click();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState.filteredBundles) !== JSON.stringify(this.state.filteredBundles) ||
      JSON.stringify(nextState.renderedBundles) !== JSON.stringify(this.state.renderedBundles) ||
      JSON.stringify(nextState.editingBundle) !== JSON.stringify(this.state.editingBundle) ||
      this.props.loadingCollection !== nextProps.loadingCollection
    );
  }

  renderMoreRows() {
    if (this.state.filteredBundles.length > this.state.renderedCount) {
      const newrenderedCount = this.state.renderedCount + 50;
      let renderedBundles = takeFirstXElementsOfArray(this.state.filteredBundles, newrenderedCount);
      this.setState({
        renderedBundles: renderedBundles,
        renderedCount: newrenderedCount,
      });
    }
  }

  render() {
    let renderedBundles = this.state.renderedBundles;
    return (
      <div>
        <h2>Collections</h2>
        <p>
          Displaying {renderedBundles && renderedBundles.length}/
          {Object.keys(this.props.bundlesDocuments).length || 0} documents&nbsp;
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#addBundleModal"
            onClick={() => null}
          >
            <i className="fas fa-plus" /> Add Collection
          </button>
        </p>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <SearchInput onChange={this.handleSearch} />
          </div>
          <div className="col-sm-12 col-md-6">
            <SortingButtons
              onClick={(fieldName, order) => this.handleSort(fieldName, order)}
              fieldList={[
                { displayText: "Name", fieldName: "name" },
                { displayText: "ID", fieldName: "id" },
                { displayText: "Updated", fieldName: "updated" },
                { displayText: "Created", fieldName: "created" },
                { displayText: "Status", fieldName: "status" },
              ]}
            />
            {/* <FilterButtons
              onClick={(fieldName, order) => null}
              fieldList={[{ displayText: "Only enabled", fieldName: "status", fieldValue: "100" }]}
            /> */}
          </div>
        </div>

        <div>
          {this.props.loadingCollection ? <FullSizeLoader /> : null}
          {renderedBundles.map((bundle, index) => {
            let bundleId = bundle.id;
            let created = new Date(bundle.created);
            let updated = bundle.updated ? new Date(bundle.updated) : null;

            const bundleStatusColor =
              bundle.status >= 100 && bundle.status < 200
                ? "success"
                : bundle.status >= 200
                ? "danger"
                : "warning";
            const bundleStatusText =
              bundle.status >= 100 && bundle.status < 200
                ? `Enabled (${bundle.status})`
                : bundle.status >= 200
                ? `Disabled (${bundle.status})`
                : `Draft (${bundle.status})`;

            let bundleActions = (
              <div>
                <div className="btn-group">
                  <button type="button" className={"btn btn-" + bundleStatusColor}>
                    {bundleStatusText}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-${bundleStatusColor} dropdown-toggle dropdown-toggle-split`}
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <div className="dropdown-menu">
                    {Object.keys(bundleStatuses).map(statusCode => (
                      <a
                        className="dropdown-item"
                        onClick={e => this.handleStatusChange(statusCode, bundleId)}
                        key={statusCode}
                      >
                        {statusCode + ": " + bundleStatuses[statusCode]}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary"
                    id={"editBundleButton-" + bundleId}
                    data-toggle="modal"
                    data-target="#editBundleModal"
                    onClick={() => this.handleEditClicked(bundle)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );

            return (
              <Card key={bundleId} className="collectionListCard">
                <div className="row">
                  <div className="col-md-4">
                    <h3>
                      <strong>{index + 1}.</strong> <span>{bundle.title || bundle.id}</span>
                    </h3>
                    <div>
                      {bundle.coverPhoto ? (
                        <img
                          className="placeImage"
                          src={makeImageUrl(
                            bundle.coverPhoto.id,
                            bundleId,
                            firebaseCollections.BUNDLES,
                            1280,
                            fileTypes.COVER
                          )}
                          alt="Bundle"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div>
                      Title: <strong>{bundle.title}</strong>
                    </div>
                    <div>
                      Subtitle: <strong>{bundle.subtitle}</strong>
                    </div>
                    <div>
                      ID: <strong>{bundle.id}</strong>
                    </div>
                    <div>
                      Created: <strong>{created ? dateToString(created) : "/"}</strong>
                    </div>
                    <div>
                      Updated: <strong>{updated ? dateToString(updated) : "/"}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div>{bundleActions}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <EditBundle currentBundle={this.state.editingBundle} />
        <AddBundle openEditingModal={this.openEditingModal} />
        <button
          className="btn btn-outline-primary"
          id="hiddenEditBundleModalOpener"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#editBundleModal"
        />
      </div>
    );
  }
}

export default withCollection(firebaseCollections.BUNDLES)(withRouter(Bundles));
