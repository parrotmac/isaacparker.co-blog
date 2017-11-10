class APIHelper {
    constructor(apiUrlBase) {
        this.apiUrlBase = apiUrlBase;
    }

    REQUEST_TYPES = {
        GET: 'GET',
        POST: 'POST',
        PATCH: 'PATCH',
        DELETE: 'DELETE'
    };


    sendFetchRequest(url, authToken, method=this.REQUEST_TYPES.GET, body) {

        const requestOptions = {
            method: method,
            credentials: 'include'
        };

        if(typeof body !== 'undefined') {
            requestOptions.body = body;
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
            res => res.json()
        )
    }


    getItem(id, authToken) {
        return this.sendFetchRequest(`${this.apiUrlBase}/${id}`, authToken)
    }

    addItem(payload, authToken) {
        return this.sendFetchRequest(this.apiUrlBase, authToken, this.REQUEST_TYPES.POST, payload)
    }

    saveItem(id, payload, authToken) {
        return this.sendFetchRequest(`${this.apiUrlBase}/${id}`, authToken, this.REQUEST_TYPES.PATCH, payload)
    }

    deleteItem(id, authToken) {
        return this.sendFetchRequest(`${this.apiUrlBase}/${id}`, authToken, this.REQUEST_TYPES.DELETE)
    }

    getItemsListing(authToken) {
        return this.sendFetchRequest(this.apiUrlBase, authToken)
    }

}

export default APIHelper
