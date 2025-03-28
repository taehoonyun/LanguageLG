const { OpenAI } = require("openai");
const callOpenAIAPI = async (messages) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAPI,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 150,
      messages,
    });
    
    return completion?.choices[0].message.content || [];
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = { callOpenAIAPI };
