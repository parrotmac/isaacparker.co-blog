class FileUploadHelper {
    constructor(apiUrlBase) {
        this.apiUrlBase = apiUrlBase;
    }

    REQUEST_TYPES = {
        GET: 'GET',
        POST: 'POST',
        DELETE: 'DELETE'
    };

    sendUploadRequest(url, authToken, uploadForm, filename) {
        const uploadRequest = new Request(
            url,
            {
                method: 'POST',
                credentials: 'include',
                body: uploadForm
            }
        );

        uploadRequest.headers.append('Accept', 'application/json');
        uploadRequest.headers.append('Content-Disposition', `attachment; filename=${filename}`);

        if(typeof authToken !== 'undefined') {
            uploadRequest.headers.append("Authorization", `Bearer ${authToken}`);
        }

        return fetch(
            uploadRequest
        ).then(
            res => res.json()
        )
    }

    sendFetchRequest(url, authToken, method=this.REQUEST_TYPES.GET, body) {

        let requestOptions = {
            method: method,
            credentials: 'include'
        };

        if(typeof body !== 'undefined') {
            requestOptions.body = JSON.stringify(body);
        }

        const constructedRequest = new Request(url, requestOptions);

        constructedRequest.headers.append("Content-Type", "application/json");
        constructedRequest.headers.append("Accept", "application/json");

        if(typeof authToken !== 'undefined') {
            constructedRequest.headers.append("Authorization", `Bearer ${authToken}`);
        }

        return fetch(
            constructedRequest
        ).then(
            res => {
                if(res.ok) {
                    if (res.status === 204) {
                        // A 204 Doesn't have a response body
                        return true
                    }
                    return res.json()
                } else {
                    return Promise.reject({
                        msg: "Response wasn't ok"
                    })
                }
            }
        )
    }

    uploadFile(uploadForm, filename, authToken) {
        return this.sendUploadRequest(`${this.apiUrlBase}/upload`, authToken, uploadForm, filename)
    }

    deleteFile(filename, authToken) {
        return this.sendFetchRequest(`${this.apiUrlBase}/${filename}`, authToken, this.REQUEST_TYPES.DELETE)
    }

    getFiles(authToken) {
        return this.sendFetchRequest(this.apiUrlBase, authToken)
    }

}

export default FileUploadHelper
