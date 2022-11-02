#! /usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet');
const generate = require('./gen');
const execute = require('./init/init');
const { isMainArg } = require('./utility');


const version = '1.0.7'
if (isMainArg('--init')) {
    execute(version) // espress version
} else if (isMainArg('--gen')) {
    generate(version)
} else {
    figlet('Espressive v3', (err, res) => {
        console.log(chalk.yellowBright.bold(res));
        console.log(chalk.bold`\t\t\tHelp Center`)
        console.log('');
        console.log(chalk.yellow`\tYou passed an invalid argument available commands are :\n`);
        console.log(chalk.cyan`\t--init\t${chalk.white`Initialize Project`}`);
        console.log(chalk.cyan`\t--gen\t${chalk.white`Generate Modules`}`);
        console.log('\n');
    })
}
