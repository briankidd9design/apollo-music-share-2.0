function songReducer(state, action) {
  //Once the action is dispatched the reducer runs, state is updated
  //In SongPlayer state.isPlaying will be set to true
  //Then we show a different icon
  //One drawback on Reducers and Redux in general, is that they are pure functions and you cannot perform side effect or interact with the outside world with them. So it's not the best set up if you want to make an api call or work with the browser.
  //Apollo comes with a built-in state management system that you can set up within the client and can use with the familiar hooks api
  switch (action.type) {
    case "PLAY_SONG": {
      return {
        ...state,
        isPlaying: true
      };
    }
    case "PAUSE_SONG": {
      return {
        ...state,
        isPlaying: false
      };
    }
    case "SET_SONG": {
      return {
        ...state,
        song: action.payload.song
      };
    }
    //returns the previous state
    default:
      return state;
  }
}

export default songReducer;
