import OpenAI from 'openai';

const VALID_CATEGORIES = [
  'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones',
  'Food', 'Books', 'Clothing', 'Beauty', 'Sports', 'Outdoor', 'Home', 'Automotive'
];

/**
 * Function to get AI filters from user query
 * @param {string} userQuery - Natural language query from user
 * @returns {Object} - MongoDB-ready filter object
 */
export const getAIFilters = async (userQuery) => {
  try {
    if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
      throw new Error('Invalid user query provided');
    }

    if (!process.env.GROQ_API_KEY) {
      return {
        fallback: true,
        keyword: userQuery.toLowerCase(),
        category: '',
        minPrice: 0,
        maxPrice: 0,
        minRating: 0,
        sortBy: ''
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });

    const prompt = `You are an advanced AI assistant for an e-commerce website specialization in semantic search. 
Your goal is to extract search parameters from a user's natural language query by analyzing semantic relationships, synonyms, use cases, and contextual meaning.

VALID CATEGORIES: ${VALID_CATEGORIES.join(', ')}

Apply these matching principles:
- Category matching: e.g., "landscape image camera" → "Cameras" category
- Pattern/attribute matching: e.g., "floral summer dresses" → products with "floral" pattern or "dresses" category
- Use case matching: e.g., "running shoes for marathons" → "shoes" or "sports" categories
- Functional matching: e.g., "gaming laptop for students" → "laptops" or "electronics" categories
- Contextual matching: e.g., "outdoor cooking tools" → "sports", "outdoor", or "home" categories
- Synonym matching: e.g., "sneakers" → "shoes", "computers" → "laptops", "photography equipment" → "cameras"

Consider these semantic relationships:
- Activities that use the products (e.g., "running" → "shoes")
- Seasons and occasions (e.g., "summer" → seasonal products)
- User needs and problems to solve (e.g., "gaming" → performance electronics)
- Physical characteristics (e.g., "floral" → patterned items)

Extract:
1. Map intent to one of the VALID CATEGORIES.
2. Pricing constraints (minPrice, maxPrice).
3. Minimum rating (0-5).
4. Sort order: 'price'|'price-desc'|'rating'|'newest'.
5. Concise 'keyword' for text search.

User Query: "${userQuery}"

Return EXACTLY this JSON structure:
{
  "keyword": "string",
  "category": "string",
  "minPrice": number,
  "maxPrice": number,
  "minRating": number,
  "sortBy": "string"
}`;

    const response = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a precise search parameter extractor. Output only valid JSON.' }, { role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const aiResponseText = response.choices[0]?.message?.content?.trim() || '{}';
    let aiResponse = JSON.parse(aiResponseText);

    const filters = {
      keyword: aiResponse.keyword || '',
      category: VALID_CATEGORIES.includes(aiResponse.category) ? aiResponse.category : '',
      minPrice: Number(aiResponse.minPrice) || 0,
      maxPrice: Number(aiResponse.maxPrice) || 0,
      minRating: Number(aiResponse.minRating) || 0,
      sortBy: aiResponse.sortBy || ''
    };

    if (filters.minPrice > 0 && filters.maxPrice > 0 && filters.minPrice > filters.maxPrice) {
      [filters.minPrice, filters.maxPrice] = [filters.maxPrice, filters.minPrice];
    }

    return filters;

  } catch (error) {
    return {
      fallback: true,
      keyword: userQuery.toLowerCase(),
      category: '',
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      sortBy: ''
    };
  }
};

/**
 * Function to get AI recommendations based on user prompt and available products
 * @param {string} userPrompt - User's request or query
 * @param {Array} products - List of available products
 * @returns {Object} - Recommended products
 */
export const getAIRecommendation = async (userPrompt, products) => {
  try {
    if (!userPrompt || !products || products.length === 0) {
      return { success: true, products: [] };
    }

    if (!process.env.GROQ_API_KEY) {
      return { success: true, fallback: true, products: products.slice(0, 10) };
    }

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });

    // Simplify product info to save tokens
    const productSummaries = products.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description.substring(0, 100),
      category: p.category,
      price: p.price,
      ratings: p.ratings
    }));

    const groqPrompt = `
        User Request: "${userPrompt}"
        Available Products: ${JSON.stringify(productSummaries)}

        Analyze semantic relationships, synonyms, use cases, and contextual meaning to identify the top 5 most relevant products.

        Apply these matching principles:
        - Category matching: e.g., "landscape image camera" → "Cameras" category
        - Pattern/attribute matching: e.g., "floral summer dresses" → products with "floral" pattern or "dresses" category
        - Use case matching: e.g., "running shoes for marathons" → "shoes" or "sports" categories
        - Functional matching: e.g., "gaming laptop for students" → "laptops" or "electronics" categories
        - Contextual matching: e.g., "outdoor cooking tools" → "sports", "outdoor", or "home" categories
        - Synonym matching: e.g., "sneakers" → "shoes", "computers" → "laptops", "photography equipment" → "cameras"

        Consider these semantic relationships:
        - Activities that use the products (e.g., "running" → "shoes")
        - Seasons and occasions (e.g., "summer" → seasonal products)
        - User needs and problems to solve (e.g., "gaming" → performance electronics)
        - Physical characteristics (e.g., "floral" → patterned items)
        
        Return ONLY a JSON object with a "recommendedIds" key containing an array of product IDs.
        Example: {"recommendedIds": ["id1", "id2"]}
    `;

    const response = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a product recommendation engine. Output only valid JSON.' }, { role: 'user', content: groqPrompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const aiResponseText = response.choices[0]?.message?.content?.trim() || '{"recommendedIds": []}';
    let { recommendedIds } = JSON.parse(aiResponseText);

    if (!Array.isArray(recommendedIds)) {
      return { success: true, products: [] };
    }

    // Deduplicate IDs
    recommendedIds = [...new Set(recommendedIds)];

    // Map back to full product objects
    const recommendedProducts = recommendedIds
      .map(id => products.find(p => p._id.toString() === id.toString()))
      .filter(p => !!p);

    return { success: true, products: recommendedProducts };

  } catch (error) {
    return {
      success: false,
      fallback: true,
      products: products.slice(0, 10)
    };
  }
};

/**
 * Function to generate a business report using Gemini AI based on provided stats
 * @param {Object} stats - The statistics object containing revenue, users, etc.
 * @returns {string} - Markdown formatted report
 */
export const generateAIReport = async (stats) => {
  try {

    if (!process.env.GROQ_API_KEY) {
      return '# AI Report Not Available\n\nAI service is not properly configured. Please contact the administrator.';
    }

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });

    const prompt = `
      You are a business analyst AI for an E-commerce platform 'NeuroCart'.
      Analyze the following dashboard statistics and generate a professional business report in Markdown format.
      
      Statistics:
      - Total Revenue: ₹${stats.totalRevenue}
      - Total Users: ${stats.totalUsers}
      - Today's Revenue: ₹${stats.todayRevenue}
      - Monthly Sales: ₹${stats.monthlySales}
      - Top Products: ${JSON.stringify(stats.topProducts || [])}
      - Low Stock Products: ${JSON.stringify(stats.lowStock || [])}

      The report should include:
      1. Executive Summary
      2. Revenue Analysis
      3. User Growth Insights
      4. Inventory Alerts (Low stock items)
      5. Recommendations for next steps
      
      Make it look professional and use emojis where appropriate.
    `;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 2000
    });

    const reportText = response.choices[0]?.message?.content?.trim() || "";
    return reportText;
  } catch (error) {
    if (error.status === 429 || error.message.includes('quota') || error.message.includes('exceeded') || error.message.includes('network')) {
      return '# AI Report Not Available\n\nAI service quota exceeded. Please try again later.';
    }

    return '# Error Generating Report\n\nCould not generate the report at this time. Please try again later.';
  }
};