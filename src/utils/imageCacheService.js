const CACHE_NAME = 'hero-images';

export const imageCacheService = {
  async init() {
    try {
      const cache = await caches.open(CACHE_NAME);
      return cache;
    } catch (error) {
      console.error('Error initializing image cache:', error);
      throw error;
    }
  },

  async saveImage(filename, blob) {
    try {
      const cache = await this.init();
      const response = new Response(blob);
      await cache.put(filename, response);
      return true;
    } catch (error) {
      console.error('Error saving image to cache:', error);
      throw error;
    }
  },

  async getImage(filename) {
    try {
      const cache = await this.init();
      const response = await cache.match(filename);
      if (response) {
        return await response.blob();
      }
      return null;
    } catch (error) {
      console.error('Error getting image from cache:', error);
      throw error;
    }
  },

  async deleteImage(filename) {
    try {
      const cache = await this.init();
      await cache.delete(filename);
      return true;
    } catch (error) {
      console.error('Error deleting image from cache:', error);
      throw error;
    }
  },

  async clearCache() {
    try {
      const cache = await this.init();
      await cache.keys().then(keys => Promise.all(keys.map(key => cache.delete(key))));
      return true;
    } catch (error) {
      console.error('Error clearing image cache:', error);
      throw error;
    }
  }
}; 