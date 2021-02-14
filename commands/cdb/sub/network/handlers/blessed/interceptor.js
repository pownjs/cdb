const { Box } = require('@pown/blessed')
const { parseRequest, buildRequest } = require('@pown/http')

class RequestInterceptor extends Box {
    constructor(options) {
        options = {
            label: 'Request Interceptor',

            keys: true,
            mouse: true,

            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                inverse: true
            },

            top: 'center',
            left: 'center',

            width: '100%-2',
            height: '50%',

            border: {
                type: 'line'
            },

            style: {
                border: {
                    fg: 'grey'
                },
                focus: {
                    border: {
                        fg: 'white'
                    }
                },
            },

            hidden: true,

            ...options,

            tags: true
        }

        super(options)
    }

    serializeRequest(request) {
        return buildRequest(request)
    }

    deserializeRequest(request) {
        return parseRequest(request)
    }

    exchangeRequest(request) {
        return new Promise(async(resolve, reject) => {
            this.screen.readEditor({ value: await this.serializeRequest(request) }, async(err, value) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(await this.deserializeRequest(value))
                }
            })
        })
    }

    async display(request) {
        this.show()
        this.focus()
        this.setFront()
        this.screen.render()

        try {
            request = await this.exchangeRequest(request)
        }
        catch (e) {}

        this.hide()
        this.screen.render()

        return request
    }
}

module.exports = RequestInterceptor
