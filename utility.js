const readline = require('readline')
function scan(question, invalidText,) {
    const cmd = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) => {
        cmd.question(question, (answer) => {
            if (answer.length > 0) {
                resolve(answer);
            } else {
                if (invalidText) {
                    reject(invalidText)
                }
            }
            cmd.close();
        })

    })
}

function renderTemplate(file, data) {
    return file.replace(/<%(.*?)%>/g, (match) => {
        return data[match.split(/<%|%>/).filter(Boolean)[0]]
    })
}

function getValue(string, regEx) {
    let serialized = string.split(/\n/g)
    const identityPool = serialized.filter(t => t.match(regEx))[0];
    return identityPool.split('=')[1]
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isMainArg(string) {
    return process.argv.slice(2)[0] === string;
}

function isChildArg(string) {
    return process.argv.slice(2)[1] === string
}

module.exports = {
    scan, renderTemplate, getValue, capitalizeFirstLetter, isChildArg, isMainArg
}