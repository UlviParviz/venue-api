const cache = new Map();

const getCache = (key) => {
  return cache.get(key);
};

const setCache = (key, value, ttl = 3600) => {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttl * 1000);
};

const deleteCache = (key) => {
  cache.delete(key);
};

export { getCache, setCache, deleteCache };
