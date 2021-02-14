const { EMPTY_BUFFER } = require('./consts')

const buildHttpTransaction = (chromeTransaction) => {
    const { requestContext, request, response } = chromeTransaction

    return {
        id: requestContext.requestId,

        method: request.method,
        uri: request.url,
        headers: request.headers,
        body: request.postData ? Buffer.from(request.postData) : EMPTY_BUFFER,

        responseCode: response.status,
        responseMessage: response.statusText,
        responseHeaders: response.headers,
        responseBody: response.body ? Buffer.from(response.body) : EMPTY_BUFFER
    }
}

module.exports = {
    buildHttpTransaction
}
