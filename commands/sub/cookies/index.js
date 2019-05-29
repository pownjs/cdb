exports.yargs = {
    command: 'cookies',
    describe: 'Dump current page cookies',
    aliases: ['cookie'],

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
        const { host, port, secure } = argv

        const cri = require('chrome-remote-interface')

        const client = await cri({ host, port, secure })

        const { Network } = client

        await Network.enable()

        const { cookies } = await Network.getCookies()

        await client.close()

        console.table(cookies)
    }
}
