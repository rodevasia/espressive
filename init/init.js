const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const { table } = require("table");
const figlet = require("figlet");
const { scan, capitalizeFirstLetter, renderTemplate } = require("../utility");
const { spawnSync, spawn } = require("child_process");
const prettier = require("prettier");
const ora = require("ora");

async function execute(version) {

  try {

    console.log(chalk.bold("Espressive - Create New Project"));

    const project = await scan(

      "Project Name : ",

      chalk.red("Project name is required")

    );

    const desc = await scan("Description : ", "Description is required");

    const author = await scan("Author : ", "Author name is required");

    const espressiveObject = {

      name: project,

      description: desc,

      author,

      framework: {

        version,

        assets: ["/static"],

      },

      module: {

        root: "app",

      },
      environment: "development"

    };

    await createDirectory(project, espressiveObject);

    installDependencies(project);

  } catch (error) {

    console.log(error);

  }
}

function createDirectory(name, espressiveObject) {

  return new Promise((resolve, reject) => {

    if (fs.existsSync(path.join(process.cwd(), name))) {

      throw Error("FolderExistException : Folder already exist");

    } else {

      console.log(chalk.blueBright("Creating espressive folder..."));

      fs.mkdirSync(path.join(process.cwd(), name));

      fs.writeFileSync(

        path.join(process.cwd(), name, ".espressive"),

        prettier.format(JSON.stringify(espressiveObject), { parser: "json" })

      );

      fs.mkdirSync(path.join(process.cwd(), name, "app"));


      fs.writeFileSync(

        path.join(process.cwd(), name, "index.ts"),

        prettier.format(
          `
                import {Server} from '@docsploit/espress';


                const server = new Server('${capitalizeFirstLetter(name)}');

                //register controllers here eg: server.register(ExampleController)
                // add code here
                server.run({});
            `,

          { parser: "typescript" }

        )

      );

      const pkgJson = fs

        .readFileSync(

          path.join(__dirname, "src_template", "package.json.template")

        )

        .toString("utf-8");

      const renderPkgJson = renderTemplate(pkgJson, {

        name,

        desc: espressiveObject.description,

        version: espressiveObject.framework.version,

      });

      fs.writeFileSync(

        path.join(process.cwd(), name, "package.json"),

        renderPkgJson

      );

      const gitignore = fs

        .readFileSync(

          path.join(__dirname, "src_template", ".gitignore.template")

        )

        .toString("utf-8");

      fs.writeFileSync(path.join(process.cwd(), name, ".gitignore"), gitignore);

      const tsConfig = fs

        .readFileSync(path.join(__dirname, "src_template", "tsconfig.template"))

        .toString("utf-8");

      fs.writeFileSync(

        path.join(process.cwd(), name, "tsconfig.json"),

        tsConfig

      );

      fs.mkdirSync(path.join(process.cwd(), name, ".vscode"));

      fs.mkdirSync(path.join(process.cwd(), name, "utils"));

      fs.mkdirSync(path.join(process.cwd(), name, "static"));

      fs.writeFileSync(

        path.join(process.cwd(), name, "static", "404.html"),

        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404</title>
</head>
<style>
    body{
        display: flex;
        width: 100vw;
        height: 100vh;
        justify-content: center;
    }
</style>
<body>
    <h1>404</h1>
</body>
</html>`

      );

      fs.writeFileSync(

        path.join(process.cwd(), name, ".vscode", "settings.json"),

        JSON.stringify({

          "files.exclude": {

            "**/.git": true,

            "**/.svn": true,

            "**/.hg": true,

            "**/CVS": true,

            "**/.DS_Store": true,

            "**/Thumbs.db": true,

            "**/node_modules": true,

          },

        })

      );

      resolve();

    }

  });

}

function installDependencies(name) {

  const or = ora("Installing dependencies").start()

  const install = spawn("npm", ["i", "@docsploit/espress",], {
    cwd: path.join(process.cwd(), name),

  });
  install.on('error', (err) => {
    or.stop();
    console.log(err);
    process.exit();
  });
  install.on('exit', () => {
    or.stop();
    const devOra = ora('Installing development dependencies').start();
    const installDev = spawn("npm", ["i", "-D", "nodemon", "ts-node", "typescript", "@docsploit/espressive"], { cwd: path.join(process.cwd(), name) });
    installDev.on('error', (err) => {
      devOra.stop();
      console.log(err)
      process.exit();
    });
    install.on('exit', () => devOra.stop())
  })


}


module.exports = execute;
