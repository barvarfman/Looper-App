import { openDB } from 'idb'; // Suitable for IndexedDB to work with async function. 

export default {
  get,
  set,
  getKeys
}

// Create a new data base and return, or return exist data base.
const dbPromise = openDB('soundDB', 1, {
  upgrade(db) {
    db.createObjectStore('soundStore');
  },
});

// Retrieve value by matching key, and make sure there are keys.  
async function get() {
  if ((await getKeys()).length > 0) {
    return (await dbPromise).get('soundStore', 'sound');
  } else {
    return false;
  }
}

// Set Value to store data base.
async function set(val) {
  return (await dbPromise).put('soundStore', val, 'sound');
}

// Retrieve all keys in the store data base.
async function getKeys() {
  return (await dbPromise).getAllKeys('soundStore');
}



