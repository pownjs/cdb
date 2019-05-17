const cri = require('chrome-remote-interface')

class NetworkTool {
    constructor() {
        this.clients = {}
        this.interval = null
        this.hookedClients = {}
        this.interceptionOptions = null
    }

    onRequest() {}

    onResponse() {}

    async interceptRequest(request) {
        return request
    }

    async interceptResponse(response) {
        return response
    }

    async onRequestWillBeSent(Network, params) {
        const { request, ...context } = params

        try {
            // TODO: only trigger if we know data is available

            const { postData } = await Network.getRequestPostData({ requestId: context.requestId })

            request.postData = postData
        }
        catch (e) {}

        await this.onRequest(request, context)
    }

    async onResponseReceived(Network, params) {
        const { response, ...context } = params

        try {
            // TODO: only trigger if we know data is available

            const { body } = await Network.getResponseBody({ requestId: context.requestId })

            response.body = body
        }
        catch (e) {}

        await this.onResponse(response, context)
    }

    async onRequestIntercepted(Network, params) {
        const { interceptionId, request, ...context } = params

        let interceptionError
        let interceptionRequest

        try {
            interceptionRequest = await this.interceptRequest(request, context)
        }
        catch (e) {
            interceptionError = e
        }

        if (interceptionError) {
            interceptionRequest = {
                errorReason: e.message
            }
        }

        Network.continueInterceptedRequest({ interceptionId, ...interceptionRequest })
    }

    hookClient(client) {
        if (this.hookedClients[client.id]) {
            return
        }

        const { types = ['Document', 'XHR', 'Fetch'], patterns = ['*'] } = this.interceptionOptions || {}

        client.Network.setRequestInterception({
            patterns: [].concat(...types.map((resourceType) => {
                return patterns.map((urlPattern) => {
                    return { resourceType, urlPattern }
                })
            }))
        })
    }

    unhookClient(client) {
        delete this.hookedClients[client.id]

        client.Network.setRequestInterception({
            patterns: []
        })
    }

    requestInterceptionON(options) {
        this.interceptionOptions = options

        for (const client of Object.values(this.clients)) {
            this.hookClient(client)
        }
    }

    requestInterceptionOFF() {
        this.interceptionOptions = null

        for (const client of Object.values(this.clients)) {
            this.unhookClient(client)
        }
    }

    intercept(options) {
        this.requestInterceptionON(options)
    }

    async onConnect(client) {
        if (this.interceptionOptions) {
            this.hookClient(client)
        }

        const { Network } = client

        Network.requestWillBeSent(this.onRequestWillBeSent.bind(this, Network))
        Network.responseReceived(this.onResponseReceived.bind(this, Network))
        Network.requestIntercepted(this.onRequestIntercepted.bind(this, Network))

        const k = 1024 * 1024 * 1045

        Network.enable({
            maxTotalBufferSize: k,
            maxResourceBufferSize: k,

            maxPostDataSize: k
        })
    }

    async doConnect(options) {
        const targets = await cri.List(options)

        targets.forEach(async(target) => {
            if (target.type !== 'page') {
                return
            }

            if (this.clients[target.id]) {
                return
            }

            const client = await cri({ ...options, target: target.id })

            await this.onConnect(client)

            client.on('disconnect', () => {
                delete this.clients[target.id]
            })

            this.clients[target.id] = client
        })
    }

    async connect(options) {
        const { pollInterval = 1000 } = options || {}

        setInterval(this.doConnect.bind(this, options), pollInterval)

        await this.doConnect(options)
    }

    async disconnect() {
        clearInterval(this.interval)

        await Promise.all(Object.entries(this.clients).map(async([name, client]) => {
            delete this.clients[name]

            await client.removeAllListeners()
            await client.close()
        }))
    }
}

class NetworkTransactionTool extends NetworkTool {
    constructor(options) {
        super(options)

        this.transactions = {}
    }

    onTransaction() {}

    onRequest(request, context) {
        const transaction = this.ensureTransaction(context.requestId)

        transaction.request = request
        transaction.requestContext = context

        this.completeTransaction(context.requestId)
    }

    onResponse(response, context) {
        const transaction = this.ensureTransaction(context.requestId)

        transaction.response = response
        transaction.responseContext = context

        this.completeTransaction(context.requestId)
    }

    ensureTransaction(requestId) {
        if (!this.transactions[requestId]) {
            this.transactions[requestId] = {}
        }

        return this.transactions[requestId]
    }

    completeTransaction(requestId) {
        if (!this.transactions[requestId]) {
            return
        }

        const transaction = this.transactions[requestId]

        const { request, response } = transaction

        if (!request || !response) {
            return
        }

        delete this.transactions[requestId]

        this.onTransaction(transaction)
    }
}

module.exports = {
    NetworkTool,
    NetworkTransactionTool
}
