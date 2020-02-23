exports.yargs = {
    command: 'launch [url]',
    describe: 'Launch server application such as chrome, firefox, opera and edge',
    aliases: ['start'],

    builder: (yargs) => {
        yargs.option('debugging-port', {
            describe: 'Remote debugging port',
            type: 'number',
            alias: 'p',
            default: 9222,
        })

        yargs.option('xss-auditor', {
            describe: 'Turn on/off XSS auditor',
            type: 'boolean',
            alias: 'x',
            default: true
        })

        yargs.option('certificate-errors', {
            describe: 'Turn on/off certificate errors',
            type: 'boolean',
            alias: 'c',
            default: true
        })

        yargs.option('proxy', {
            describe: 'Set proxy settings',
            type: 'string',
            alias: 'P',
            default: ''
        })

        yargs.option('pentest', {
            describe: 'Start with prefered settings for pentesting',
            type: 'boolean',
            alias: 't',
            default: false
        })
    },

    handler: async(argv) => {
        const { launch } = require('../../../lib/launch')

        const { debuggingPort, xssAuditor, certificateErrors, proxy, pentest, url } = argv || {}

        await launch({ debuggingPort, xssAuditor, certificateErrors, proxy, pentest, url })
    }
}
