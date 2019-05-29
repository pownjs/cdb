exports.yargs = {
    command: 'screenshot <file>',
    describe: 'Screenshot the current page',
    aliases: ['capture', 'shoot', 'shot'],

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
        const { host, port, secure, file } = argv

        const fs = require('fs')
        const util = require('util')
        const cri = require('chrome-remote-interface')

        const writeFile = util.promisify(fs.writeFile.bind(fs))

        const client = await cri({ host, port, secure })

        const { Page } = client

        await Page.enable()

        const { data } = await Page.captureScreenshot()

        await writeFile(file, Buffer.from(data, 'base64'))

        await client.close()
    }
}
