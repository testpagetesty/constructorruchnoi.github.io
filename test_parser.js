const parseLegalDocuments = (content) => {
  try {
    const documents = {
      privacyPolicy: { title: '', content: '' },
      termsOfService: { title: '', content: '' },
      cookiePolicy: { title: '', content: '' }
    };

    // Нормализуем переносы строк
    const normalizedContent = content.replace(/\r\n/g, '\n');

    // Регулярное выражение для поиска заголовков в скобках в начале строки и последующего текста
    const documentPattern = /(?:^|\n)\s*\(([^)]+)\)([\s\S]*?)(?=(?:^|\n)\s*\([^)]+\)|$)/g;
    
    // Массив типов документов в порядке их следования
    const documentTypes = ['privacyPolicy', 'termsOfService', 'cookiePolicy'];
    let documentIndex = 0;
    
    let match;
    while ((match = documentPattern.exec(normalizedContent)) !== null) {
      const title = match[1].trim();
      let documentContent = match[2].trim();
      
      console.log(`Найден документ: ${title}`);

      // Определяем тип документа по порядку следования
      const documentType = documentTypes[documentIndex];
      
      if (documentType && documents[documentType]) {
        // Добавляем заголовок как первую строку контента
        documents[documentType].content = title + '\n\n' + documentContent;
      }
      
      documentIndex++;
    }

    return documents;
  } catch (error) {
    console.error('Error parsing legal documents:', error);
    return null;
  }
};

const testContent = `
(Política de Privacidad)

1. Disposiciones Generales
   La presente Política de Privacidad establece cómo recopilamos, utilizamos y protegemos la información personal proporcionada a través de nuestro sitio web. Nos comprometemos a proteger su privacidad y garantizar que sus datos sean tratados de acuerdo con la legislación aplicable, incluidos los principios del Reglamento General de Protección de Datos (GDPR).

2. Qué Información Recopilamos
   Recopilamos los siguientes tipos de información:

* Información personal, como nombre, dirección de correo electrónico y número de teléfono proporcionados por los usuarios al completar formularios en el sitio web.
* Información relacionada con el dispositivo y el uso del sitio, como dirección IP, tipo de navegador, páginas visitadas y tiempo de permanencia en el sitio.
* Datos recopilados mediante cookies y tecnologías similares.

(Personal User Agreement)

1. General Provisions and Terms
   This User Agreement governs the use of our website. By using the website, you agree to these terms. If you do not agree with the terms, please refrain from using the website.

2. User Rights and Obligations
   Users have the right to use the website in accordance with the rules and regulations established by this agreement. Users are obliged to refrain from engaging in illegal activities, infringing on the intellectual property rights of the website, or damaging its functionality.

(Cookie Policy)

1. What Are Cookies
   Cookies are small text files stored on your device when you visit a website. They help the website recognize your device and provide a better user experience.

2. Types of Cookies
   There are two main types of cookies:

* Session cookies: temporary cookies that are erased when you close your browser.
* Persistent cookies: cookies that remain on your device for a set period of time (or until you delete them).
`;

console.log(JSON.stringify(parseLegalDocuments(testContent), null, 2));

const fs = require('fs');
const path = require('path');

// Импортируем функции парсинга из модуля
const parsingFunctions = require('./src/components/AiParser/parsingFunctions');

// Текст для теста
const testText = `ID секции: преимущества
Neden Biz?
Koçluk sürecinde güvenilir, deneyimli ve sonuç odaklı bir partner arıyorsanız doğru yerdesiniz.
Avantajlarımız

Deneyimli Uzmanlar
Ekibimiz, iş dünyasında uzun yıllara dayanan koçluk ve yönetim tecrübesine sahiptir.

Sonuç Odaklı Yaklaşım
Koçluk süreçlerimiz ölçülebilir sonuçlar ve kalıcı gelişim sağlamaya yöneliktir.

Esnek ve Kişiye Özel
İşletmenizin ihtiyaçlarına uygun, esnek ve özel olarak uyarlanmış çözümler sunuyoruz.`;

// Парсим текст
const parsedData = parsingFunctions.parseAdvantagesSection(testText);

// Сохраняем результат в файл для анализа
fs.writeFileSync(path.join(__dirname, 'parsed_advantages.json'), JSON.stringify(parsedData, null, 2)); 