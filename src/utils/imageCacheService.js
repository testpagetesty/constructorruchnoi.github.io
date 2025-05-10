const CACHE_NAME = 'site-images-cache-v1';
const METADATA_CACHE_NAME = 'site-images-metadata-v1';

class ImageCacheService {
  constructor() {
    this.db = null;
    this.dbName = 'site-images-db';
    this.storeName = 'images';
    this.init();
  }

  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async saveImage(key, blob) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(blob, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving image to cache:', error);
      throw error;
    }
  }

  async getImage(key) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting image from cache:', error);
      throw error;
    }
  }

  async deleteImage(key) {
    try {
      await this.init();
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting image from cache:', error);
      throw error;
    }
  }

  async saveMetadata(key, metadata) {
    try {
      localStorage.setItem(key, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw error;
    }
  }

  getMetadata(key) {
    try {
      const metadata = localStorage.getItem(key);
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      console.error('Error getting metadata:', error);
      return null;
    }
  }

  deleteMetadata(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting metadata:', error);
    }
  }
}

export const imageCacheService = new ImageCacheService(); 