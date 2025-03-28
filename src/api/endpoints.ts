export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token'
  },
  CHAT: {
    SEND_MESSAGE: '/chat/sendMessage',
    RESET_HISTORY: '/chat/resetHistory',
    TALK_TO_FRIEND: '/chat/talkToFriend',
    QUIT: '/chat/quit'
  },
  UTIL: {
    GET_CHARACTERS: '/util/getCharacterNames',
    GET_CHARACTER: (name: string) => `/util/getCharacter/${name}`
  }
} as const; 