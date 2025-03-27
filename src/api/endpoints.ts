export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  CHAT: {
    SEND_MESSAGE: '/chat/sendMessage',
    RESET_HISTORY: '/chat/resetHistory',
  },
  UTIL: {
    GET_CHARACTERS: '/util/getCharacterNames',
  },
} as const; 