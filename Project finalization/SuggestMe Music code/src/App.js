import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, {useState, useEffect} from 'react';

const CLIENT_ID = "45b829848ddc46dfa25ae2dd3be2ea05";
const CLIENT_SECRET = "cbc71ea20189444191470ed7395d8b95";

function App() {
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [artists, setartists] = useState([]);
  const [currentArtist, setCurrentArtist] = useState([]);
  const [artistsName, setArtistName] = useState([]);
  const [dartistsName, dsetArtistName] = useState([]);

  
  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' +CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, [])

  async function search() {
    console.log("Search for " + searchInput)
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application.json',
        'Authorization': 'Bearer ' + accessToken
      }
    }


    //all related artist
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    .then(response => response.json())
    .then(data => {
    return data.artists.items[0].id;
  })

    console.log("Artist ID is " + artistID);

    await fetch('https://api.spotify.com/v1/artists/' + artistID + '/related-artists', searchParameters)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      shuffle(data.artists);
      setartists(data.artists);
      console.log("This is a test " + setartists[0]);
    });


// current Artist
    var artistINFO = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    .then(response => response.json())
    .then(data => {
    return data.artists.items[0];
  })
  console.log("This is Current Artist " + artistINFO.name);

    await fetch('https://api.spotify.com/v1/artists/' + artistID)
    .then(response => response.json())
    .then((data) => {
      setCurrentArtist(data.currentArtist);

  
    });
  }


//Shuffle
  const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };
  

//delete
  const deleteMe = (artists) => {
    setartists(prevState => {
        return prevState.filter((e, i) => i !== artists)
    })
}

//addliked
function addliked(i, artist, artists) {
  artistsName.push(artist);
  setArtistName(artistsName);
  deleteMe(i);
    }


//adddisliked
function adddisliked(i, artist) {
  dartistsName.push(artist);
  dsetArtistName(dartistsName);
  deleteMe(i);
}

  console.log(artists);
  return (
    <div className="App">
      <div>
      <Container>
        <h1 style={{color: 'blue'}}>SuggestMe Music</h1>
        <br></br>
      </Container>

      <Container>
        <InputGroup className="mb-3">
          <FormControl
          placeholder="Search For Artist"
          type ="input"
          onKeyPress={event => {
            if (event.key === "Enter") {
              search();
              }
            }}
          onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
           Search
          </Button>
       </InputGroup>
      </Container>

      <Container>
        <Row className = "row-cols-4">
          
          {artists.slice(0,4).map( (artist, i) => {
            
            console.log(artist);
            return (

              <Card> 
                <Card.Img src={artist.images[0].url} />
                <Card.Body>
                  <Card.Title>{artist.name}</Card.Title>
                  <div class="display">

                    <div class="like">
                  <button class="thumbsUp" onClick={() => addliked(i, artist.name, artists)}>👍</button>
                  </div>

                  <div class="dislike">
                  <button class="thumbsDown" onClick={() => adddisliked(i, artist.name)}>👎</button>
                  </div>

                  </div>
                </Card.Body>
              </Card>
            )
          })}
        </Row>
   </Container>
          </div>

      <br></br>

          
          <div className='displayld'>
      <div className='liked'>
        <h2 style={{color:'blue'}}>Liked</h2>
      {artistsName.map(name => 
      <ul style= {{liststyletype:'none'}}>
        <h5 style={{color:'skyblue'}}>{name}</h5>
        </ul>)}
      </div>

      <div className='liked'>
        <h2 style={{color:'blue'}}>Disliked</h2>
      {dartistsName.map(name => 
      <ul style= {{liststyletype:'none'}}>
        <h5 style={{color:'skyblue'}}>{name}</h5>
        </ul>)}
      </div>
        </div>
    </div>
  );
}
export default App;