import * as types from './types'

export function setChatInputMessage (inputMessage) {
  return {
    type: types.ON_CHAT_MESSAGE_CHANGE,
    inputMessage
  }
}

export function setChatMic (mic) {
  return {
    type: types.ON_CHAT_MIC_CHANGE,
    mic
  }
}
