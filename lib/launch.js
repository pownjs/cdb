const os = require('os')
const path = require('path')

const launch = (options) => {
    const { debuggingPort, xssAuditor, certificateErrors, proxy, pentest, url } = options || {}

    const commonArgs = [`--user-data-dir=${path.join(os.tmpdir(), `chrome-${Math.random().toString(32).slice(2)}`)}`, '--no-first-run']

    const commonEnv = {}

    if (debuggingPort) {
        commonArgs.push(`--remote-debugging-port=${debuggingPort}`)
    }

    if (!xssAuditor || pentest) {
        commonArgs.push('--disable-xss-auditor')
    }

    if (!certificateErrors || pentest) {
        commonArgs.push('--ignore-certificate-errors')
    }

    if (proxy) {
        if (proxy === 'auto') {
            if (pentest) {
                commonArgs.push('--proxy-server=localhost:8080')
            }
        }
        else {
            commonArgs.push(`--proxy-server=${proxy}`)
        }
    }

    if (url) {
        commonArgs.push(url)
    }

    const { spawn } = require('child_process')

    let args

    switch (process.platform) {
        case 'darwin':
            args = [...commonArgs]

            spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args, { detached: true, stdio: 'ignore', env: commonEnv }).unref()

            break

        case 'linux':
            args = [...commonArgs]

            console.warn('linux is currently not supported')

            console.info('launch chrome manually with the following command:')
            console.info(`chrome ${args.join(' ')}`)

            break

        case 'win32':
            args = [...commonArgs]

            console.warn('win32 is currently not supported')

            console.info('launch chrome manually with the following command:')
            console.info(`chrome ${args.join(' ')}`)

            break
    }
}

module.exports = {
    launch
}
