const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { format } = require('prettier')
const {  capitalizeFirstLetter } = require('./utility');

async function generate(version,name) {
    if (fs.existsSync(path.join(process.cwd(), '.espressive'))) {
        const esp = fs.readFileSync(path.join(process.cwd(), '.espressive')).toString('utf-8')
        const espObj = JSON.parse(esp);
        if (version === espObj.framework.version) {
            let moduleName = name
            moduleName = moduleName.toLowerCase();
            fs.mkdirSync(path.join(process.cwd(), 'app', moduleName))
            const controllerPath = path.join(process.cwd(), 'app', moduleName, moduleName + '.controller.ts')
            const modelPath = path.join(process.cwd(), 'app', moduleName, moduleName + '.model.ts')

            console.log(`CREATE ${chalk.cyan(controllerPath)}`);
            fs.writeFileSync(controllerPath, format(`
            import {Controller} from "@docsploit/espress";
            @Controller('/${moduleName.toLowerCase()}')
            export default class ${capitalizeFirstLetter(moduleName)}{}
            `, { parser: 'typescript' }))
            console.log(`CREATE ${chalk.cyan(modelPath)}`);
            fs.writeFileSync(modelPath, format(`
                export type ${capitalizeFirstLetter(moduleName)}Type = {}
                // Any model related works should be done here.
            `, { parser: 'typescript' }))
        } else {
            console.log(chalk.yellow.bold`Framework version and cli version not match cli-version - ${version} frameworkVersion - ${espObj.framework.version}`)
        }
    } else {
        console.log(chalk.redBright.bold`Not an Espressive Project`)
    }
}
module.exports = generate