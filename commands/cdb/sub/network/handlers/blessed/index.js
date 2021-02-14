const colors = require('@pown/cli/lib/colors')
const blessed = require('@pown/blessed/lib/blessed')
const Quit = require('@pown/blessed/lib/auxiliary/quit')
const Help = require('@pown/blessed/lib/auxiliary/help')
const { Semaphore } = require('@pown/async/lib/semaphore')
const Console = require('@pown/blessed/lib/auxiliary/console')
const HTTPView = require('@pown/blessed/lib/auxiliary/httpview')

const Interceptor = require('./interceptor')
const { EMPTY_BUFFER } = require('../../../lib/consts')
const { buildHttpTransaction } = require('../../../lib/http')

module.exports = (argv, sink, tool) => {
    const s = blessed.screen({ name: 'Network' })

    const v = new HTTPView()
    const i = new Interceptor()
    const c = new Console()
    const h = new Help()
    const q = new Quit()

    q.bindKeys()
    c.bindKeys()
    h.bindKeys()
    c.hijackConsole()

    s.append(v)
    s.append(i)
    s.append(c)
    s.append(h)
    s.append(q)

    h.setContent(`\n
\t88888b.   .d88b.  888  888  888 88888b.
\t888 "88b d88""88b 888  888  888 888 "88b 
\t888  888 888  888 888  888  888 888  888 
\t888 d88P Y88..88P Y88b 888 d88P 888  888 
\t88888P"   "Y88P"   "Y8888888P"  888  888 
\t888
\t888        JS (cdb)
\t888

\t{bold}C-l{/bold} - Toggle message log
\t{bold}C-t{/bold} - Toggle interception
\t{bold}Tab{/bold} - Change focus
\t{bold}C-c, C-x, q{/bold} - Exit
\n`)

    s.render()

    let intercepting = true

    const toggleInterception = () => {
        if (intercepting) {
            tool.requestInterceptionOFF()
            v.setMessage(`INTERCEPTION: ${colors.bold('OFF')}`)
        }
        else {
            tool.requestInterceptionON()
            v.setMessage(`INTERCEPTION: ${colors.bold.red('ON')}`)
        }

        s.render()

        intercepting = !intercepting
    }

    toggleInterception()

    s.key(['C-t'], () => {
        toggleInterception()
    })

    sink.on('transaction', (chromeTransaction) => {
        v.addTransaction(buildHttpTransaction(chromeTransaction))
    })

    const sem = new Semaphore(1)

    sink.on('intercept-request', (pipeline) => {
        const { request } = pipeline

        pipeline.request = new Promise(async(resolve) => {
            const promissedRequest = await request

            const release = await sem.acquire()

            const newRequest = await i.display({
                method: promissedRequest.method,
                uri: promissedRequest.url,
                headers: promissedRequest.headers,
                body: promissedRequest.postData ? Buffer.from(promissedRequest.postData) : EMPTY_BUFFER
            })

            resolve({
                method: newRequest.method,
                url: newRequest.uri,
                headers: newRequest.headers,
                postData: newRequest.body.toString()
            })

            await release()
        })
    })
}
