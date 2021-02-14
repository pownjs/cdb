const path = require('path')
const { lstatSync, mkdir, writeFile } = require('fs')
const { buildRequest, buildResponse } = require('@pown/http')

const { buildHttpTransaction } = require('../../lib/http')

const writeHandler = (err) => {
    if (err) {
        console.error(err)
    }
}

const outputToFlatDir = (argv, sink, output) => {
    sink.on('transaction', (chromeTransaction) => {
        const id = chromeTransaction.requestContext.requestId
        const transaction = buildHttpTransaction(chromeTransaction)

        const pathname = output

        writeFile(path.join(pathname, `${id}.request`), buildRequest(transaction), writeHandler)
        writeFile(path.join(pathname, `${id}.response`), buildResponse(transaction), writeHandler)
    })
}

const outputToTreeDir = (argv, sink, output) => {
    const url = require('url')

    sink.on('transaction', (chromeTransaction) => {
        const id = chromeTransaction.requestContext.requestId
        const transaction = buildHttpTransaction(chromeTransaction)

        const uri = url.parse(transaction.uri)
        const pathname = path.join(output, uri.protocol.slice(0, -1), uri.host, uri.pathname)

        mkdir(pathname, { recursive: true }, (err) => {
            if (err) {
                console.error(err)
            }
            else {
                writeFile(path.join(pathname, `${id}.request`), buildRequest(transaction), writeHandler)
                writeFile(path.join(pathname, `${id}.response`), buildResponse(transaction), writeHandler)
            }
        })
    })
}

module.exports = (argv, sink, output) => {
    if (lstatSync(output).isDirectory()) {
        if (path.basename(output).endsWith('.tree')) {
            outputToTreeDir(argv, sink, output)
        }
        else {
            outputToFlatDir(argv, sink, output)
        }
    }
}
