import { openDB } from 'idb';

const dbName = 'PokedexDB';
const storeName = 'pokemons';
const version = 1;

const dbPromise = openDB(dbName, version, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: 'id' });
    }
  },
});

export const getPokemons = async () => {
  const db = await dbPromise;
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return store.getAll();
};

export const getPokemon = async (id) => {
  const db = await dbPromise;
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return store.get(id);
};

export const savePokemon = async (pokemon) => {
  console.log('Saving Pokémon to IndexedDB:', pokemon); // Log the data being saved
  const db = await dbPromise;
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  store.put(pokemon);
  return tx.done;
};
