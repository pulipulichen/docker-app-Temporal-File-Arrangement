function getFileContext(files) {
    return files.map(({path}) => '- ' + path).join('\n')
}

module.exports = getFileContext