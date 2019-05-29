exports.yargs = {
    command: 'cdb <command>',
    describe: 'Chrome Debug Protocol Tool',
    aliases: ['cdp', 'chrome'],

    builder: (yargs) => {
        yargs.command(require('./sub/launch').yargs)
        yargs.command(require('./sub/navigate').yargs)
        yargs.command(require('./sub/network').yargs)
        yargs.command(require('./sub/screenshot').yargs)
    }
}
