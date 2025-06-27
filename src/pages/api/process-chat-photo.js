import { getRandomOperatorPhoto } from '../../utils/chatPhotoProcessor';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎭 API: Processing chat operator photo...');
    
    const operatorPhoto = await getRandomOperatorPhoto();
    
    if (!operatorPhoto) {
      return res.status(404).json({ 
        error: 'No photos available or processing failed' 
      });
    }

    // Возвращаем фото как бинарные данные
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', operatorPhoto.buffer.length);
    res.setHeader('X-Original-File', operatorPhoto.originalFile);
    res.setHeader('X-Photo-Size', operatorPhoto.size.toString());
    
    console.log(`✅ API: Returning optimized photo: ${operatorPhoto.originalFile} (${operatorPhoto.size} bytes)`);
    
    res.status(200).send(operatorPhoto.buffer);

  } catch (error) {
    console.error('❌ API Error processing chat operator photo:', error);
    res.status(500).json({ 
      error: 'Failed to process chat operator photo',
      details: error.message 
    });
  }
} 