import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { getFullCollectionFromDb, getDocumentsByIdsFromDb, getAuthUsersByIdsFromDb } from "db";
import {
  addDocumentsToCollection,
  updateDocumentInCollection,
  updateObjectKeyInDocument,
  markLoadedAll,
} from "redux/actions";
import { arrayToObject } from "utils";
import { firebaseCollectionConnections, firebaseCollections } from "constants/database";

let alreadyMappedCollections = [];

const withCollection = (collectionName, isShallow = false) => Component => {
  const collectionDocuments = collectionName + "Documents";
  const collectionSize = collectionName + "Size";
  const collectionLoadedAll = collectionName + "LoadedAll";

  class WithCollection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
      };
    }

    componentDidMount() {
      const documentObject = this.props[collectionDocuments];

      if (!documentObject || Object.keys(documentObject).length < 1) {
        this.downloadCollection(collectionName).catch(error => {
          this.setState({ loading: false });
          console.error(error);
        });
      } else {
        this.setState({ loading: false });
      }
    }

    downloadCollection(collectionName, documentIds = undefined, isConnected = false) {
      this.setState({ loading: true });

      if (!documentIds) {
        // we're downloading the main collection
        return getFullCollectionFromDb(collectionName)
          .then(retrievedDocs => {
            if (collectionName === firebaseCollections.USERS) {
              return this.addAuthFieldsToUserDocs(retrievedDocs);
            }
            return retrievedDocs;
          })
          .then(retrievedDocs => {
            this.handleRetrievedDocs(collectionName, retrievedDocs, isConnected);
            this.setState({ loading: false });
          })
          .catch(error => {
            this.setState({ loading: false });
            console.error(error);
          });
      } else {
        // we're downloading a connected collection, so only IDs from main collection should be downloaded
        return getDocumentsByIdsFromDb(collectionName, documentIds)
          .then(retrievedDocs => {
            if (collectionName === firebaseCollections.USERS) {
              return this.addAuthFieldsToUserDocs(retrievedDocs);
            }
            return retrievedDocs;
          })
          .then(retrievedDocs => {
            this.handleRetrievedDocs(collectionName, retrievedDocs, isConnected);
            this.setState({ loading: false });
          })
          .catch(error => {
            this.setState({ loading: false });
            console.error(error);
          });
      }
    }

    handleRetrievedDocs(collectionName, documents, isConnected = false) {
      this.saveRetrievedDocsToRedux(collectionName, documents);

      if (
        this.constructor.hasConnectedCollection(collectionName) &&
        documents &&
        Object.keys(documents) &&
        !isConnected &&
        !isShallow
      ) {
        let collectionConnections = firebaseCollectionConnections[collectionName];
        Object.keys(collectionConnections).forEach(connectedCollection => {
          let foreignKey = collectionConnections[connectedCollection];
          let documentIds = [];

          if (foreignKey === "id") {
            documentIds = Object.keys(documents);
          } else if (foreignKey.split(".").length === 2) {
            const splitForeignKey = foreignKey.split(".");

            if (splitForeignKey[1] === "key") {
              let documentIdArrays = [];
              Object.keys(documents).forEach(key => {
                if (
                  documents[key][splitForeignKey[0]] &&
                  Object.keys(documents[key][splitForeignKey[0]]).length
                )
                  documentIdArrays.push(Object.keys(documents[key][splitForeignKey[0]]));
              });
              documentIds = [].concat.apply([], documentIdArrays);
            } else {
              documentIds = Object.keys(documents).map(key => {
                return documents[key][splitForeignKey[0]][splitForeignKey[1]];
              });
            }
          } else if (foreignKey.split(".").length === 1) {
            documentIds = Object.keys(documents).map(key => {
              return documents[key][foreignKey];
            });
          }
          this.downloadCollection(connectedCollection, documentIds, true);
        });
      }
      this.props.markLoadedAll(collectionName);

      return documents;
    }

    addAuthFieldsToUserDocs(retrievedDocs) {
      return getAuthUsersByIdsFromDb(Object.keys(arrayToObject(retrievedDocs, "id")))
        .then(authUsers => {
          return retrievedDocs.map(doc => {
            if (doc.id && authUsers[doc.id]) {
              doc.email = authUsers[doc.id].email;
            }
            return doc;
          });
        })
        .catch(error => {
          console.error(error);
        });
    }

    static hasConnectedCollection(collectionName) {
      let collectionConnections = firebaseCollectionConnections[collectionName];
      if (collectionConnections && Object.keys(collectionConnections).length) {
        return true;
      }
      return false;
    }

    saveRetrievedDocsToRedux(collectionName, documents) {
      if (Object.keys(documents).length) {
        this.props.addDocumentsToCollection(documents, collectionName);
        this.setState({ loading: false });
      }
      return documents;
    }

    render() {
      return <Component {...this.props} loadingCollection={this.state.loading} />;
    }
  }

  const mapStateToProps = function(state) {
    alreadyMappedCollections.push(collectionName);
    let mappedState = {
      [collectionDocuments]: state.collection[collectionName],
      [collectionSize]: state.database[collectionName].size,
      [collectionLoadedAll]: state.database[collectionName].loadedAll,
    };
    let stateToReturn = { ...mappedState };
    if (!isShallow) {
      stateToReturn = { ...stateToReturn, ...mapConnectedToProps(state, collectionName) };
    }
    return stateToReturn;
  };

  const mapConnectedToProps = function(state, collectionWithConnections) {
    let collectionConnections = firebaseCollectionConnections[collectionWithConnections];
    let mappedState = {};
    if (collectionConnections && Object.keys(collectionConnections).length) {
      Object.keys(collectionConnections).forEach(connectedCollection => {
        const connectedCollectionDocuments = connectedCollection + "Documents";
        const connectedCollectionSize = connectedCollection + "Size";
        const connectedCollectionLoadedAll = connectedCollection + "LoadedAll";

        let connectedMappedState = {
          [connectedCollectionDocuments]: state.collection[connectedCollection],
          [connectedCollectionSize]: state.database[connectedCollection].size,
          [connectedCollectionLoadedAll]: state.database[collectionName].loadedAll,
        };
        mappedState = {
          ...mappedState,
          ...connectedMappedState,
        };
      });
    }
    return mappedState;
  };

  const dispatcher = function(dispatch) {
    return {
      addDocumentsToCollection: function(documents, collectionName) {
        addDocumentsToCollection(documents, collectionName, dispatch);
      },
      markLoadedAll: collectionName => {
        markLoadedAll(collectionName, dispatch);
      },
      updateDocumentInCollection: function(docId, updatedDocument, collectionName) {
        updateDocumentInCollection(docId, updatedDocument, collectionName, dispatch);
      },
      updateObjectKeyInDocument: function(fieldName, fieldKey, fieldValue, docId, collectionName) {
        updateObjectKeyInDocument(fieldName, fieldKey, fieldValue, docId, collectionName, dispatch);
      },
    };
  };

  return compose(connect(mapStateToProps, dispatcher))(WithCollection);
};

export default withCollection;
