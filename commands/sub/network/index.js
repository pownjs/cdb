exports.yargs = {
    command: 'network',
    describe: 'Chrome Debug Protocol Network Monitor',

    builder: (yargs) => {
        const { hasNodeModule } = require('@pown/modules')

        yargs.option('host', {
            describe: 'Remote debugging host',
            type: 'string',
            alias: 'H',
            default: 'localhost',
        })

        yargs.option('port', {
            describe: 'Remote debugging port',
            type: 'number',
            alias: 'p',
            default: 9222,
        })

        yargs.option('secure', {
            describe: 'HTTPS/WSS frontend',
            type: 'boolean',
            alias: 's',
            default: false,
        })

        yargs.option('output', {
            describe: 'Output directory/file',
            type: 'array',
            alias: 'o',
            default: []
        })

        if (hasNodeModule('@pown/blessed')) {
            yargs.options('blessed', {
                type: 'boolean',
                describe: 'Start with blessed ui',
                alias: 'b',
                default: false
            })
        }
    },

    handler: async(argv) => {
        const { host, port, secure, output, blessed } = argv

        const { EventEmitter } = require('events')

        const { NetworkTransactionTool } = require('../../../lib/network')

        const sink = new EventEmitter()

        const tool = new class extends NetworkTransactionTool {
            async interceptRequest(request) {
                const pipeline = {
                    request: Promise.resolve(request)
                }

                sink.emit('intercept-request', pipeline)

                request = await pipeline.request

                return request
            }

            async interceptResponse(response) {
                const pipeline = {
                    response: Promise.resolve(response)
                }

                sink.emit('intercept-response', pipeline)

                response = await pipeline.request

                return response
            }

            onTransaction(transaction) {
                sink.emit('transaction', transaction)
            }
        }

        await tool.connect({ host, port, secure })

        if (blessed) {
            require('./handlers/blessed')(argv, sink, tool)
        }
        else {
            require('./handlers/log')(argv, sink, tool)
        }

        if (output.length) {
            output.map((output) => {
                require('./handlers/output')(argv, sink, output)
            })
        }
    }
}
