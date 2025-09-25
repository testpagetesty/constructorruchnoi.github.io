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
      const request = indexedDB.open(this.dbName, 2); // Увеличиваем версию для добавления нового store

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Создаем store для изображений
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
        
        // 🔥 НОВОЕ: Создаем store для метаданных
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata');
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
      const db = await this.init();
      if (!db) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['metadata'], 'readwrite');
        const store = transaction.objectStore('metadata');
        const request = store.put(metadata, key);

        request.onsuccess = () => {
          console.log(`🗄️ Metadata saved to IndexedDB: ${key}`, metadata);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving metadata:', error);
      return Promise.resolve();
    }
  }

  async getMetadata(key) {
    try {
      const db = await this.init();
      if (!db) return null;
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['metadata'], 'readonly');
        const store = transaction.objectStore('metadata');
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting metadata:', error);
      return null;
    }
  }

  async deleteMetadata(key) {
    try {
      const db = await this.init();
      if (!db) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['metadata'], 'readwrite');
        const store = transaction.objectStore('metadata');
        const request = store.delete(key);

        request.onsuccess = () => {
          console.log(`🗑️ Metadata deleted from IndexedDB: ${key}`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting metadata:', error);
      return Promise.resolve();
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
  async getAllMetadata() {
    try {
      const db = await this.init();
      if (!db) return {};
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['metadata'], 'readonly');
        const store = transaction.objectStore('metadata');
        const request = store.getAll();
        const keysRequest = store.getAllKeys();

        let results = {};
        let keys = [];

        request.onsuccess = () => {
          const values = request.result;
          
          keysRequest.onsuccess = () => {
            keys = keysRequest.result;
            
            // Объединяем ключи и значения
            keys.forEach((key, index) => {
              if (key.includes('site-images-metadata-') || 
                  key.includes('card-image-metadata-') ||
                  (key.includes('card_') && key.includes('_ImageMetadata'))) {
                results[key] = values[index];
              }
            });
            
            console.log(`🗄️ Retrieved ${Object.keys(results).length} metadata entries from IndexedDB`);
            resolve(results);
          };
          
          keysRequest.onerror = () => reject(keysRequest.error);
        };
        
        request.onerror = () => reject(request.error);
      });
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
        // Очистить изображения
        const imagesTransaction = this.db.transaction([this.storeName], 'readwrite');
        const imagesStore = imagesTransaction.objectStore(this.storeName);
        await new Promise((resolve, reject) => {
          const request = imagesStore.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });

        // Очистить метаданные
        const metadataTransaction = this.db.transaction(['metadata'], 'readwrite');
        const metadataStore = metadataTransaction.objectStore('metadata');
        await new Promise((resolve, reject) => {
          const request = metadataStore.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
      
      console.log('🗄️ Image cache and metadata cleared successfully from IndexedDB');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Получить все ключи метаданных
  async getAllMetadataKeys() {
    try {
      const db = await this.init();
      if (!db) return [];
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['metadata'], 'readonly');
        const store = transaction.objectStore('metadata');
        const request = store.getAllKeys();

        request.onsuccess = () => {
          const allKeys = request.result || [];
          const filteredKeys = allKeys.filter(key => 
            key.includes('site-images-metadata-') || 
            key.includes('card-image-metadata-') ||
            (key.includes('card_') && key.includes('_ImageMetadata'))
          );
          resolve(filteredKeys);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting all metadata keys:', error);
      return [];
    }
  }

  // Получить статистику кеша
  async getCacheStats() {
    try {
      const keys = await this.getAllImageKeys();
      const metadata = await this.getAllMetadata();
      
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

  // Псевдоним для deleteImage для совместимости
  async removeImage(key) {
    return this.deleteImage(key);
  }

  // Полная очистка кеша карточек для отладки
  async clearAllCardImages() {
    try {
      console.log('🗑️ CLEARING ALL CARD IMAGES...');
      
      // Получаем все ключи localStorage
      const allKeys = Object.keys(localStorage);
      
      // Находим все ключи, связанные с карточками
      const cardKeys = allKeys.filter(key => 
        key.startsWith('card-image-metadata-') || 
        (key.startsWith('site-images-') && key.includes('card_'))
      );
      
      console.log(`🗑️ Found ${cardKeys.length} card-related keys to remove:`, cardKeys);
      
      // Удаляем все найденные ключи
      for (const key of cardKeys) {
        try {
          if (key.startsWith('card-image-metadata-')) {
            // Это метаданные - пробуем удалить связанный blob
            const metadata = JSON.parse(localStorage.getItem(key));
            if (metadata && metadata.fileName) {
              await this.deleteImage(metadata.fileName);
              console.log(`🗑️ Deleted blob: ${metadata.fileName}`);
            }
          }
          
          // Удаляем ключ из localStorage
          localStorage.removeItem(key);
          console.log(`🗑️ Removed key: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Error removing ${key}:`, error);
          // Принудительно удаляем даже при ошибке
          localStorage.removeItem(key);
        }
      }
      
      console.log(`🗑️ Card cache cleanup completed. Removed ${cardKeys.length} keys.`);
      return cardKeys.length;
      
    } catch (error) {
      console.error('Error clearing card images cache:', error);
      return 0;
    }
  }
}

export const imageCacheService = new ImageCacheService();

// Глобальная функция для отладки (доступна в консоли браузера)
if (typeof window !== 'undefined') {
  window.clearCardImagesCache = async () => {
    const count = await imageCacheService.clearAllCardImages();
    console.log(`🎉 Cleared ${count} card images from cache!`);
    return count;
  };
} 