import { RequestHandler } from "express";

export const listGeminiModels: RequestHandler = async (req, res) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy GEMINI_API_KEY trong environment variables'
      });
    }

    console.log('Listing available Gemini models...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('List Models Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('List Models Error:', errorText);
      
      return res.status(response.status).json({
        success: false,
        message: `Error listing models: ${response.status} - ${response.statusText}`,
        error: errorText
      });
    }

    const data = await response.json();
    console.log('Available models count:', data.models?.length || 0);
    
    // Filter models that support generateContent
    const generateContentModels = data.models?.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || [];

    res.json({
      success: true,
      message: 'Đã lấy danh sách models thành công',
      totalModels: data.models?.length || 0,
      generateContentModels: generateContentModels.length,
      models: data.models?.map((model: any) => ({
        name: model.name,
        displayName: model.displayName || model.name,
        supportedMethods: model.supportedGenerationMethods || [],
        version: model.version || 'unknown',
        inputTokenLimit: model.inputTokenLimit || 'unknown',
        outputTokenLimit: model.outputTokenLimit || 'unknown'
      })) || []
    });

  } catch (error) {
    console.error('Lỗi list models:', error);
    
    res.status(500).json({
      success: false,
      message: 'Lỗi kết nối khi lấy danh sách models',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};