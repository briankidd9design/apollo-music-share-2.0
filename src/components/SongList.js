import React from "react";
import {
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  makeStyles
} from "@material-ui/core";
import { PlayArrow, Save, Pause } from "@material-ui/icons";
import { useMutation, useSubscription} from "@apollo/react-hooks";
import { GET_SONGS } from "../graphql/subscriptions";
import { SongContext } from "../App";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

function SongList() {
  //this loads the songs to the UI
  const { data, loading, error } = useSubscription(GET_SONGS);
  //  const { data, loading, error} = useQuery(GET_SONGS)

  // const song = {
  //   title: "LÜNE",
  //   artist: "MÖÖN",
  //   thumbnail: "http://img.youtube.com/vi/--ZtUFsIgMk/0.jpg"
  // };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50
        }}
      >
        <CircularProgress />
      </div>
    );
  }
  if (error) return <div>Error fetching songs</div>;

  return (
    <div>
    {/* this gets the songs from the database and places them in the song list */}
      {data.songs.map(song => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(3)
  },
  songInfoContainer: {
    display: "flex",
    alignItems: "center"
  },
  songInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  thumbnail: {
    objectFit: "cover",
    width: 140,
    height: 140
  }
}));

function Song({ song }) {
  const { id } = song;
  const classes = useStyles();
  //adding to the Queue from the SongList
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    //onCompleted will set the data of the local storage
    onCompleted: data => {
      //set an item where the key queue will be used
      //local storage only accepts string values
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    }
  });
  //
  const { state, dispatch } = React.useContext(SongContext);
  const [currentSongPlaying, setCurrentSongPlaying] = React.useState(false);
  const { title, artist, thumbnail } = song;
// for more information on useEffect
  React.useEffect(() => {
    //this sets the song in the playlist to the current song playing
    const isSongPlaying = state.isPlaying && id === state.song.id;
    setCurrentSongPlaying(isSongPlaying);
  }, [id, state.song.id, state.isPlaying]);

  function handleTogglePlay() {
    dispatch({ type: "SET_SONG", payload: { song } });
    dispatch(state.isPlaying ? { type: "PAUSE_SONG" } : { type: "PLAY_SONG" });
  }

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: { input: { ...song, __typename: "Song" } }
    });
  }

  return (
    <Card className={classes.container}>
      <div className={classes.songInfoContainer}>
        <CardMedia image={thumbnail} className={classes.thumbnail} />
        <div className={classes.songInfo}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body1" component="p" color="textSecondary">
              {artist}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={handleTogglePlay} size="small" color="primary">
              {currentSongPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={handleAddOrRemoveFromQueue}
              size="small"
              color="secondary"
            >
              <Save />
            </IconButton>
          </CardActions>
        </div>
      </div>
    </Card>
  );
}

export default SongList;
