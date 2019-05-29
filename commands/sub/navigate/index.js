exports.yargs = {
    command: 'navigate <url>',
    describe: 'Go to the specified url',

    builder: (yargs) => {
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
    },

    handler: async(argv) => {
        const { host, port, secure, url } = argv

        const cri = require('chrome-remote-interface')

        const client = await cri({ host, port, secure })

        const { Page } = client

        await Page.enable()
        await Page.navigate({ url })

        await client.close()
    }
}
