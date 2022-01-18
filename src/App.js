import React from "react";
import Header from "./components/Header";
import AddSong from "./components/AddSong";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import { Grid, useMediaQuery, Hidden } from "@material-ui/core";
import songReducer from "./reducer";
//The state that is being kept track of is the song itself and if the song is playing
//1 song will get passed to the songReducer
//createContext will be related to useContect
export const SongContext = React.createContext({
  song: {
    id: "a685e7de-e420-4bc1-aa5a-d9a51100dd29",
    title: "A Way Home",
    artist: "Memorex Memories",
    thumbnail: "http://img.youtube.com/vi/KbC46oJmLh4/0.jpg",
    url: "https://www.youtube.com/watch?v=KbC46oJmLh4",
    duration: 239
  },
  isPlaying: false
});

function App() {
  const initialSongState = React.useContext(SongContext);
  //1
  const [state, dispatch] = React.useReducer(songReducer, initialSongState);
  //up means greater than //down means lesser than 
  const greaterThanSm = useMediaQuery(theme => theme.breakpoints.up("sm"));
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up("md"));

  return (
    //1
    <SongContext.Provider value={{ state, dispatch }}>
      <Hidden only="xs">
      {/* {greaterThanSm && <Header />} */}
        <Header />
      </Hidden>
      <Grid style={{
        marginRight: greaterThanSm ? 20 : 0, marginLeft: greaterThanSm ? 20 : 0
        }} >
        <Grid
          style={{
            paddingTop: greaterThanSm ? 80 : 10
          }}
          item
          // xs={12}
          md={7}
        >
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            greaterThanMd
              ? {
                  position: "fixed",
                  width: "100%",
                  right: 0,
                  top: 70
                }
              : {
                  position: "fixed",
                  width: "100%",
                  left: 0,
                  bottom: 0
                }
          }
          item
          xs={12}
          md={5}
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;
