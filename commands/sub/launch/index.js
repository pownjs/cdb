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
    },

    handler: async(argv) => {
        const { port: PORT } = argv

        const { spawn } = require('child_process')

        switch (process.platform) {
            case 'darwin':
                spawn('/bin/bash', ['-c', '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --user-data-dir=$(mktemp -d /tmp/google-chome.XXXXXXX) --no-first-run --remote-debugging-port=$PORT'], { detached: true, stdio: 'ignore', env: { PORT } }).unref()

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
