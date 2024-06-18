

export function getCache(key) {
    let cache = localStorage.getItem(key);
    return cache ? JSON.parse(cache) : {};
}

export function setCache(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
