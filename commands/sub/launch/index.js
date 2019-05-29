exports.yargs = {
    command: 'launch',
    describe: 'Launch server application such as chrome, firefox, opera and edge',
    aliases: ['start'],

    builder: (yargs) => {
        yargs.option('port', {
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

        yargs.option('pentest', {
            describe: 'Start with prefered settings for pentesting',
            type: 'boolean',
            alias: 't',
            default: false
        })
    },

    handler: async(argv) => {
        const { port: PORT, xssAuditor, certificateErrors, pentest } = argv

        const commonArgs = ['--no-first-run', '--remote-debugging-port=$PORT']

        if (!xssAuditor || pentest) {
            commonArgs.push('--disable-xss-auditor')
        }

        if (!certificateErrors || pentest) {
            commonArgs.push('--ignore-certificate-errors')
        }

        const { spawn } = require('child_process')

        switch (process.platform) {
            case 'darwin':
                const args = ['-c', '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --user-data-dir=$(mktemp -d /tmp/google-chome.XXXXXXX)' + commonArgs.join(' ')]

                spawn('/bin/bash', args, { detached: true, stdio: 'ignore', env: { PORT } }).unref()

                break

            case 'linux':
                console.warn('linux is currently not supported')

                console.info('launch chrome manually with the following command:')
                console.info('chrome --user-data-dir=$(mktemp -d /tmp/google-chome.XXXXXXX) --no-first-run --remote-debugging-port=$PORT')

                break

            case 'win32':
                console.warn('win32 is currently not supported')

                console.info('launch chrome manually with the following command:')
                console.info('chrome --user-data-dir=$(mktemp -d /tmp/google-chome.XXXXXXX) --no-first-run --remote-debugging-port=$PORT')

                break
        }
    }
}
