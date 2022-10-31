const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { format } = require('prettier')
const { scan, capitalizeFirstLetter } = require('./utility')
async function generate(version) {
    if (fs.existsSync(path.join(process.cwd(), '.espressive'))) {
        const esp = fs.readFileSync(path.join(process.cwd(), '.espressive')).toString('utf-8')
        const espObj = JSON.parse(esp)
        if (version === espObj.framework.version) {
            let moduleName = await scan('Module Name :', 'Module name is required!');
            moduleName = moduleName.toLowerCase();
            fs.mkdirSync(path.join(process.cwd(), 'app', moduleName))
            const controllerPath = path.join(process.cwd(), 'app', moduleName, moduleName + '.controller.ts')
            const modelPath = path.join(process.cwd(), 'app', moduleName, moduleName + '.model.ts')

            console.log(`CREATE ${chalk.cyan(controllerPath)}`);
            fs.writeFileSync(controllerPath, format(`
            import {Controller} from "@docsploit/espress";
            import {GET,POST,PUT,DELETE} from "@docsploit/espress/lib/methods";
            import {sendErrorResponse,sendSuccessResponse} from "@docsploit/espress/lib/utils";
            @Controller
            export default class ${capitalizeFirstLetter(moduleName)}{}
            `, { parser: 'typescript' }))
            console.log(`CREATE ${chalk.cyan(modelPath)}`);
            fs.writeFileSync(modelPath, format(`
                export type ${capitalizeFirstLetter(moduleName)}Type = {}
                // Any model related works should be done here.
            `, { parser: 'typescript' }))
            console.log(`UPDATE ${chalk.cyan(path.join(process.cwd(), 'app', 'modules.ts'))}`);
            updateModulesTs(moduleName)
        } else {
            console.log(chalk.yellow.bold`Framework version and cli version not match cli-version - ${version} frameworkVersion - ${espObj.framework.version}`)
        }
    } else {
        console.log(chalk.redBright.bold`Not an Espressive Project`)
    }
}

function updateModulesTs(moduleName) {
    const file = fs.readFileSync(path.join(process.cwd(), 'app', 'modules.ts'), 'utf-8');
    const lines = file.split('\n');
    lines.splice(0, 0, `import ${capitalizeFirstLetter(moduleName)} from './${moduleName}/${moduleName}.controller'`)
    lines.pop();
    lines.pop();
    const signModule = `register('/${moduleName}',${capitalizeFirstLetter(moduleName)});\n\nexport default this;`
    const newFile = lines.join('\n')
    console.log(newFile);
    fs.writeFileSync(path.join(process.cwd(), 'app', 'modules.ts'), format(newFile, { parser: 'typescript', }));
    fs.appendFileSync(path.join(process.cwd(), 'app', 'modules.ts'), format(signModule, { parser: 'typescript' }))
}
module.exports = generate