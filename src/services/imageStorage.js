// Сервис для работы с хранилищем изображений в IndexedDB
class ImageStorage {
  constructor() {
    this.dbName = 'siteBuilderDB';
    this.storeName = 'images';
    this.db = null;
    this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      console.log('ImageStorage init - Открытие базы данных:', this.dbName);
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        console.error('ImageStorage init - Ошибка открытия базы данных:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        console.log('ImageStorage init - База данных успешно открыта');
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('ImageStorage init - Обновление схемы базы данных');
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          console.log('ImageStorage init - Создание хранилища:', this.storeName);
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async saveImage(id, imageData) {
    console.log('ImageStorage saveImage - Сохранение изображения:', {
      id,
      dataLength: imageData.length
    });

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ id, data: imageData });

      request.onsuccess = () => {
        console.log('ImageStorage saveImage - Изображение успешно сохранено');
        resolve();
      };

      request.onerror = () => {
        console.error('ImageStorage saveImage - Ошибка сохранения:', request.error);
        reject(request.error);
      };
    });
  }

  async getImage(id) {
    console.log('ImageStorage getImage - Получение изображения:', id);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result?.data) {
          console.log('ImageStorage getImage - Изображение найдено, длина:', request.result.data.length);
        } else {
          console.log('ImageStorage getImage - Изображение не найдено');
        }
        resolve(request.result?.data);
      };

      request.onerror = () => {
        console.error('ImageStorage getImage - Ошибка получения:', request.error);
        reject(request.error);
      };
    });
  }

  async deleteImage(id) {
    console.log('ImageStorage deleteImage - Удаление изображения:', id);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('ImageStorage deleteImage - Изображение успешно удалено');
        resolve();
      };

      request.onerror = () => {
        console.error('ImageStorage deleteImage - Ошибка удаления:', request.error);
        reject(request.error);
      };
    });
  }

  async getAllImages() {
    console.log('ImageStorage getAllImages - Получение всех изображений');

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        console.log('ImageStorage getAllImages - Получено изображений:', request.result.length);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('ImageStorage getAllImages - Ошибка получения:', request.error);
        reject(request.error);
      };
    });
  }
}

export const imageStorage = new ImageStorage();