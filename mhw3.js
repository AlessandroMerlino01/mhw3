const numResults = 5;

//key e endpoint per apikey
const key_img = '26886999-3eeb596fa2114d652ceaeb501';
const img_api_endpoint = 'https://pixabay.com/api/';

//id e endpoint per oauth 2.0
const client_id = 'd8ae63b9fb3d4821a40bcfff6e7c0c6b';
const client_secret = '94900dd4cfc0440dbd97c59065b2422e';
const spotify_token = 'https://accounts.spotify.com/api/token';

//uso sempre questa funzione
function onResponse(response) {
    return response.json();
}

function onJson_img(json) {
    // Stampiamo il JSON per capire come è fatto
    console.log(json);
    // Svuotiamo l' album
    const library = document.querySelector('#album-view');
    library.innerHTML = '';
    const results = json.hits
    for(result of results){
      const album = document.createElement('div');
      album.classList.add('album');
      const img = document.createElement('img');
      img.src = result.webformatURL;
      album.appendChild(img);
      library.appendChild(album);
    }
}

function search_img(event){
	// impedisco comportamento di default
	event.preventDefault();
  
	const content = 'rolex'; //scelgo rolex come stringa da cercare perché è 
  //l' unico marchio che ho trovato nel database di questa API
	
	const encodedtext = encodeURIComponent(content);

	// eseguo fetch
	img_request = img_api_endpoint + '?key='  + key_img + '&q=' + encodedtext + '&per_page=' + numResults;
	fetch(img_request).then(onResponse).then(onJson_img); 
}


function onJson_spotify(json){
  //rimuovo l'event listener perchè se non lo facessi e cliccassi sul link rifaccio la fetch
  spotify.removeEventListener('click', search_spotify);
  console.log(json);
  const library = document.querySelector('#playlist-view');
  library.innerHTML = '';
  //salvo le informazioni che mi interessano
  const result = json.playlists.items;
  const playlist_data = result[0];
  const title = playlist_data.name;
  const playlist_image = playlist_data.images[0].url;
  const link = playlist_data.external_urls.spotify;
  console.log(link);

  const link_spotify = document.createElement('a');
  link_spotify.classList.add('link')
  link_spotify.href=link;

  const playlist = document.createElement('div');
  playlist.classList.add('playlist');

  const caption = document.createElement('span');
  caption.textContent = title;

  const img_spotify = document.createElement('img');
  img_spotify.src = playlist_image;

  playlist.appendChild(img_spotify);
  playlist.appendChild(caption);
  link_spotify.appendChild(playlist);
  library.appendChild(link_spotify);
}

function onTokenJson(json){
  fetch("https://api.spotify.com/v1/search?type=playlist&q="+ "orologio",
  //ho usato come tipo episode perchè voglio che visualizzi podcast
    {
      headers:
      {
        'Authorization':'Bearer ' + json.access_token
      }
    }
  ).then(onResponse).then(onJson_spotify);
}

function search_spotify(event){
  event.preventDefault();
  //fetch per ottenere token
  fetch(spotify_token,
    {
      method: 'post',
      body: 'grant_type=client_credentials',
      headers:
      {
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization':'Basic '+ btoa(client_id + ':' + client_secret)
      }
    }
  ).then(onResponse).then(onTokenJson);
}

const form = document.querySelector('#search_img');
form.addEventListener('click', search_img);

const spotify = document.querySelector('#spotify');
spotify.addEventListener('click', search_spotify)