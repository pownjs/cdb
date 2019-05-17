exports.yargs = {
    command: 'cdb <command>',
    describe: 'Chrome Debug Protocol Tool',

    builder: (yargs) => {
        yargs.command(require('./sub/launch').yargs)
        yargs.command(require('./sub/network').yargs)
    }
}
