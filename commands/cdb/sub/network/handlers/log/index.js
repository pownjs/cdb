module.exports = (argv, sink, tool) => {
    const colors = require('@pown/cli/lib/colors')

    const responseCodeColorFuncs = [colors.gray, colors.blue, colors.green, colors.yellow, colors.magenta, colors.red, colors.gray, colors.gray, colors.gray, colors.gray]

    const getHeader = (headers, header) => {
        header = header.toLowerCase()

        for (const [name, value] of Object.entries(headers)) {
            if (name.toLowerCase() === header) {
                return value
            }
        }
    }

    const buildLogLine = (request, response) => {
        const headers = response.headers
        const method = request.method
        const url = request.url
        const responseCode = responseCodeColorFuncs[~~(response.status / 100) % 10](response.status)
        const contentType = colors.cyan(getHeader(headers, 'Content-Type') || '-')
        const server = colors.blue(getHeader(headers, 'Server') || '-')
        const contentLength = ((getHeader(headers, 'Content-Length') ? `${getHeader(headers, 'Content-Length')}b` : '-'))
        const time = '-'
        const location = getHeader(headers, 'Location') ? `-> ${getHeader(headers, 'Location')}` : ''

        return `${method} ${url} -> ${responseCode} ${contentType} ${server} ${contentLength} ${time} ${location}`
    }

    sink.on('transaction', ({ request, response }) => {
        console.info(buildLogLine(request, response))
    })
}
