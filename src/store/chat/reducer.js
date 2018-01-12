import * as types from './types'

const initialState = {
  mic: {
    visible: false,
    recording: false
  }
}

export default function chat(state = initialState, action) {
  switch (action.type) {
    case types.ON_CHAT_MESSAGE_CHANGE:
      return { ...state, 'inputMessage': action.inputMessage }
    case types.ON_CHAT_MIC_CHANGE:
      return { ...state, 'mic': { ...state.mic, ...action.mic } }
    default:
      return state
  }
}
