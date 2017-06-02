# Bitbucket push hooks

Simple service for Bitbucket push hooks. Can handle multiple repositories and multiple branch with differents commands.

Execute a command for every push event for a specific branch in a repository.

## Usage
- Accepts environment variables `SERVER_HOST` and `SERVER_PORT`
   
```
$ cp config.example.json config.json
$ # edit config.json
$ SERVER_PORT=9000 npm start
```