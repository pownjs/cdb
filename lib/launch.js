const launch = (options) => {
    const { debuggingPort, xssAuditor, certificateErrors, proxy, pentest, url } = options || {}

    const commonArgs = ['--no-first-run']

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

    switch (process.platform) {
        case 'darwin':
            const args = ['-c', `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --user-data-dir=$(mktemp -d /tmp/google-chome.XXXXXXX) ${commonArgs.join(' ')}`]

            spawn('/bin/bash', args, { detached: true, stdio: 'ignore', env: commonEnv }).unref()

            break

        case 'linux':
            console.warn('linux is currently not supported')

            console.info('launch chrome manually with the following command:')
            console.info(`chrome --user-data-dir=$(mktemp -d /tmp/google-chome.XXXXXXX) ${commonArgs.join(' ')}`)

            break

        case 'win32':
            console.warn('win32 is currently not supported')

            console.info('launch chrome manually with the following command:')
            console.info(`chrome --user-data-dir=$(mktemp -d /tmp/google-chome.XXXXXXX) ${commonArgs.join(' ')}`)

            break
    }
}

module.exports = {
    launch
}
