// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;

const files = FileManager.local()

// return cache if data exist in cache and then async load data
// await data if data doesn't exist in cache and then write to cache
// @param name cache name
// @param fn function of fetch data
async function callback(name, fn) {
    const cachePath = files.joinPath(files.documentsDirectory(), name + "-cache")
    const cacheExists = files.fileExists(cachePath)

    if (cacheExists) {
        // async write data
        fn().then(data => {
            files.writeString(cachePath, JSON.stringify(data))
        })
        const cache = files.readString(cachePath)
        const resultRaw = JSON.parse(cache)
        return resultRaw
    }

    // sync read data
    const result = await fn()
    files.writeString(cachePath, JSON.stringify(result))
    return result
}

module.exports = {
    callback
}