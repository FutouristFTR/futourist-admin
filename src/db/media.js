import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";

export { addPhotos };

function addPhotos(collectionName, documentId, type, files, progressCb) {
  return firebase
    .auth()
    .currentUser.getIdToken()
    .then(token => {
      const uploaders = files.map((file, index) => {
        const formData = new FormData();

        formData.append(file.name, file, file.name);
        const uploadConfig = {
          onUploadProgress: progressEvt => {
            const currentPercentage = Math.floor((progressEvt.loaded * 100) / progressEvt.total);
            progressCb(currentPercentage, index);
          },
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${token}`,
          },
        };

        const uploadUrl = `${
          process.env.REACT_APP_CLOUD_FUNCTIONS_URL
        }/addPhotos/${collectionName}/${documentId}/${type || ""}`;
        return axios.post(uploadUrl, formData, uploadConfig).then(result => result.data);
      });

      return axios.all(uploaders).then(results => [].concat.apply([], results));
    });
}
