const promiseTimeout = async function(ms, promise){
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in '+ ms + 'ms.')
        }, ms)
    })

    return Promise.race([
        promise,
        timeout
    ])
}

const TABULATION = 2;

const TIMEOUT = 5000;

module.exports = {
    promiseTimeout,
    TABULATION,
    TIMEOUT
}