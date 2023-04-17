# How to commit an empty secrets file to Github and then ignore further changes
## Git Command to Ignore further changes
git update-index --assume-unchanged path/to/file.ext

## Git Command to Stop Ignoring further changes (NOT RECOMMENDED!!!)
git update-index --no-assume-unchanged path/to/file.ext
<br>
<br>

# Guidelines:
### 1. You should never stop ignoring changes after boilerplate is published
### 2. Better have errors caused by lack of secrets than publishing them to Github