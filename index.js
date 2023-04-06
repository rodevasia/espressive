#! /usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet');
const generate = require('./gen');
const execute = require('./init/init');
const { isMainArg } = require('./utility');

const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs');
const fe = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const { format } = require('prettier');
const ora = require('ora');

const version = '1.0.26'

if (argv.init) {
    execute(version);
    return;
}

if (argv.gen && typeof argv.gen === "string") {
    generate(version, argv.gen);
    return;
} else if (argv.gen) {
    console.log(chalk.yellow`Module Name is required`)
    console.log(chalk.blueBright`\n--gen=Example\n`);
    return
}

if (argv._.includes('build')) {
    const ra = ora('Building Project').start();
    if(fs.existsSync(path.join(process.cwd(), 'build'))){
        fs.rmSync(path.join(process.cwd(), 'build'), { recursive: true })
    }
    const esp = fs.readFileSync(path.join(process.cwd(), '.espressive')).toString('utf-8')
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')).toString('utf-8'));
    pkg.devDependencies=undefined;
    pkg.scripts={start:"node index.js",install:"npm i"}
    const espObj = JSON.parse(esp);
    espObj.environment = "production";
    espObj.key = crypto.randomBytes(345).toString('hex');

    const proc = spawn('tsc', { stdio: 'inherit', });
    proc.on('exit', () => {
        fs.writeFileSync(path.join(process.cwd(), 'build', '.espressive'), format(JSON.stringify(espObj), { parser: 'json' }));
        fs.writeFileSync(path.join(process.cwd(), 'build', 'package.json'), format(JSON.stringify(pkg), { parser: 'json' }));
        fs.mkdirSync(path.join(process.cwd(), "build", "static"));
        fe.copySync(path.join(process.cwd(), 'static',), path.join(process.cwd(), "build", "static"),);
        
        ra.stop();
        console.log(chalk.green`Project built successfully`);
    })
    return
}

else {
    figlet('Espressive v3', (err, res) => {
        console.log(chalk.yellowBright.bold(res));
        console.log(chalk.bold`\t\t\tHelp Center`)
        console.log('');
        console.log(chalk.yellow`\tYou passed an invalid argument available commands are :\n`);
        console.log(chalk.cyan`\t--init\t${chalk.white`Initialize Project`}`);
        console.log(chalk.cyan`\t--gen\t${chalk.white`Generate Modules`}`);
        console.log(chalk.cyan`\tbuild\t${chalk.white`Build Production version`}`);
        console.log('\n');
    })
}

// if()

// if (isMainArg('--init')) {
//     execute(version) // espress version
// } else if (isMainArg('--gen')) {
//     generate(version)
// } else {
//    
// }
