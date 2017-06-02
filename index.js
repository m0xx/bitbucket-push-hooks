const express = require('express');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;

const HOST = process.env.SERVER_HOST || '0.0.0.0';
const PORT = process.env.SERVER_PORT || 8000;

const resolveConfig = () => {
    try {
        return require('./config.json');
    }
    catch(err) {
        throw new Error("Please add config file \'config.json\'...")
    }
}

const resolveRawCommand = (config, repository, branch) => {
    const repo = config[repository];
    if(repo) {
        return repo[branch] || null;
    }

    return null;
}

const executeRawCommand = (rawCommand) => {
    const parts = rawCommand.split(' ');
    const cmd = parts.shift();
    const argz = parts;

    const exec = spawn(cmd, argz);

    exec.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    exec.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    exec.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

const config = resolveConfig();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
    const event = req.body;
    const repositoryName = event.repository.name;
    const lastChange = event.push.changes[0];

    const changeEvent = lastChange.new ? lastChange.new : lastChange.old;

    if(changeEvent.type === 'branch') {
        const branchName = changeEvent.name;
        const rawCommand = resolveCommand(resolveRawCommand(config, repositoryName, branchName))

        if(rawCommand !== null) {
            executeRawCommand(rawCommand);

            console.log(`Executing command \'${rawCommand}\' for branch \'${branchName}\' in repository \'${repositoryName}\'`);
        }
    }

    res.end();
})

app.listen(PORT, HOST, () => {
    console.log(`Service running on http://${HOST}:${PORT}/`)
})