const CACHE_NAME = 'site-images-cache-v1';
const METADATA_CACHE_NAME = 'site-images-metadata-v1';

class ImageCacheService {
  constructor() {
    this.db = null;
    this.dbName = 'site-images-db';
    this.storeName = 'images';
    // Only initialize in browser
    if (typeof window !== 'undefined') {
    this.init();
    }
  }

  async init() {
    if (this.db) return this.db;
    
    // Check if we're in browser
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

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
      const db = await this.init();
      if (!db) return Promise.resolve();
      
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
      const db = await this.init();
      if (!db) return Promise.resolve(null);
      
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
      const db = await this.init();
      if (!db) return Promise.resolve();
      
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

  // Получить все изображения из кеша
  async getAllImages() {
    try {
      const db = await this.init();
      if (!db) return [];
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          const images = [];
          request.result.forEach((blob, index) => {
            const key = store.getAllKeys().result[index];
            images.push({ key, blob });
          });
          resolve(images);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all images:', error);
      return [];
    }
  }

  // Получить все ключи изображений
  async getAllImageKeys() {
    try {
      const db = await this.init();
      if (!db) return [];
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting image keys:', error);
      return [];
    }
  }

  // Получить все метаданные
  getAllMetadata() {
    try {
      const metadata = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('site-images-metadata-')) {
          try {
            metadata[key] = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            console.warn('Invalid metadata for key:', key);
          }
        }
      }
      return metadata;
    } catch (error) {
      console.error('Error getting all metadata:', error);
      return {};
    }
  }

  // Очистить весь кеш
  async clearAll() {
    try {
      const db = await this.init();
      if (db) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        await store.clear();
      }
      
      // Очистить метаданные
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('site-images-metadata-')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('Image cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Получить статистику кеша
  async getCacheStats() {
    try {
      const keys = await this.getAllImageKeys();
      const metadata = this.getAllMetadata();
      
      let totalSize = 0;
      const images = [];
      
      for (const key of keys) {
        const blob = await this.getImage(key);
        if (blob) {
          totalSize += blob.size;
          const meta = metadata[`site-images-metadata-${key}`];
          images.push({
            key,
            size: blob.size,
            metadata: meta
          });
        }
      }
      
      return {
        totalImages: keys.length,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        images
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { totalImages: 0, totalSize: 0, totalSizeMB: '0', images: [] };
    }
  }

  // Проверить доступность кеша
  isCacheAvailable() {
    return typeof window !== 'undefined' && window.indexedDB && window.localStorage;
  }
}

export const imageCacheService = new ImageCacheService(); 