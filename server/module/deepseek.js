const { OpenAI } = require("openai");
const callDeepseekAPI  = async (messages) => {
  try {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.REACT_APP_DEEPSEEKAPI, // Replace with your actual API key
    });

      const completion = await openai.chat.completions.create({
        model: "deepseek-chat", 
        temperature: 0.7,
        max_tokens: 150,
        messages,
      });
      return completion?.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = { callDeepseekAPI };
