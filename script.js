const listAllShows = getAllShows();
async function getData(getId = 82) {
  let url = `https://api.tvmaze.com/shows/${getId}/episodes`;
  try {
    let resolve = await fetch(url);
    let data = await resolve.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function listShowDetailsOnPage(listShow, isAllShows = true) {
  getElement("#episode").className = "hideEpisodeMenu";
  getElement("#episodeSearch").className = "hideSearchBar";
  getElement("#btnShows").className = "btnHidden";
  if (isAllShows == true) listShow = listAllShows;
  let html = "";
  listShow.forEach((show) => {
    const { id, name, genres, status, runtime, summary, image } = show;
    const SHOW_ID = id;
    if (image !== null) {
      const {
        image: { medium },
        rating: { average },
      } = show;

      html += `
<a onclick= getShowsEpisodes(${SHOW_ID})  class ="showTitle">${name} </a>      
        <div class="showsList" >                             
          <img alt="tvShows" class="showImage" src= ${medium} />
          <div class="showSummary">${summary}</div>
          <ul  class="showDetails"> 
              <li class="showDetailsItems">Rated: ${average}</li>
              <li class="showDetailsItems"> Generes: ${genres}</li>
              <li class="showDetailsItems"  >Status: ${status}</li>
              <li class="showDetailsItems" >Runtime: ${runtime}</li>
          </ul>                  
        </div>`;
    }
  });
  getElement("#root").innerHTML = html;
  getElement(
    ".countEpisodeResult"
  ).innerText = `found ${listAllShows.length} shows`;
}

function getElement(param) {
  return document.querySelector(param);
}

// loads all the Episodes to the page
async function makePageForEpisodes(listEpisodes, isAllEpisodes = true) {
  if (isAllEpisodes == true) listEpisodes = await getData();
  let id = getElement("#shows").options[getElement("#shows").selectedIndex]
    .value;

  wholeMovies = await getData(id);
  let html = "";
  listEpisodes.forEach((episode) => {
    const { name, season, number, image, summary } = episode;
    if (image !== null) {
      const {
        image: { medium },
      } = episode;
      html += ` 
             
          <div class="episodeCard">
              <h3 class="movieTitle">${name} - S0${season}E0${number}</h3>
              <img class="img" src= ${medium} />
              <div class="summary">${summary}</div>
        </div>`;
    } else {
      html += `
      <div class="episodeCard">
              <h3 class="movieTitle">${name} - S0${season}E0${number}</h3>
              <img class="img" src= "./img.png" />
              <div class="summary">${summary}</div>
        </div>`;
    }
  });

  getElement("#episodeGrid").innerHTML = html;

  if (isAllEpisodes == true) {
      getElement(
        ".countEpisodeResult"
      ).innerText = ` Displaying ${wholeMovies.length} episodes  `;
    } else {
      getElement(
        ".countEpisodeResult"
      ).innerText = `Displaying ${listEpisodes.length} off ${wholeMovies.length} episodes  `;
  }
}

// //populate select menu dropDown
// async function loadEpisodeList() {
//   let menu = "";
//   // let selectDefault = "";
//   let movie = await getData();
//   // selectDefault += `<option selected="selected">SelectAll</option>`;
//   movie.forEach((episode) => {
//     menu += `
        
//           <option value=${episode.id}>S0${episode.season}E-${episode.number} -${episode.name} </option>`;
//   });
//   // getElement("#episode").innerHTML = selectDefault + menu;
//   getElement("#episode").innerHTML = menu;
// }

async function filteredEpisode() {
  const option = getElement("#episode").options[
    getElement("#episode").selectedIndex
  ].text;
  let result = getElement("#episode").options[
    getElement("#episode").selectedIndex
  ].value;
  let idArr = result.split("+");
  let episodeId = idArr[0];
  let movieId = idArr[1];
  let movie = await getData(movieId);
  const filtered = movie.filter((episode) => episode.id == episodeId);
  makePageForEpisodes(filtered, false);

  if (option === episodeId) {
    selectShows();
  }
}
//Select Individual Episode
getElement("#episode").addEventListener("change", filteredEpisode);

async function episodeSearchResult(e) {
  let id = getElement("#shows").options[getElement("#shows").selectedIndex]
    .value;

  let movie = await getData(id);
  let result = e.target.value.toLowerCase();
  const filtered = movie.filter((item) => {
    if (item.name !== null && item.summary !== null) {
      return (
        item.name.toLowerCase().includes(result) ||
        item.summary.toLowerCase().includes(result)
      );
    }
  });
  makePageForEpisodes(filtered, false);
}

getElement("#episodeSearch").addEventListener("keyup", episodeSearchResult);

function filteredShows(e) {
  let result = e.target.value.toLowerCase();
  const filtered = listAllShows.filter((show) => {
    const {name,summary,genres} = show;
  if (name !== null &&summary !== null) {
      return (
        name.toLowerCase().includes(result) ||
        summary.toLowerCase().includes(result) 
      //genres.toLowerCase().includes(result)

      );
   }
  });
  listShowDetailsOnPage(filtered, false);
  console.log(filtered);
}

getElement("#showsSearch").addEventListener("keyup", filteredShows);

//populate select menu dropDownShow
async function populateShowsMenu(id = 82) {
  let menu = "";
  let selectDefault = "";
  // sort the shows names on alphabetical order
  listAllShows.sort(function (show1, show2) {
    return show1.name.localeCompare(show2.name);
  });

  listAllShows.forEach((item) => {
    if (item.id == id) {
      menu += `<option  selected="selected" value=${item.id}>${item.name} </option> `;
    } else {
      menu += `<option value=${item.id}>${item.name} </option> `;
    }
  });

  getElement("#shows").innerHTML = selectDefault + menu;
}

getElement("#shows").addEventListener("change", selectShows);

//render on the page and populate episode drop down based on show selection.
async function getShowsEpisodes(id) {
  getElement("#showsSearch").className = "hideSearchBar";
  getElement("#episodeSearch").className = "showSearchBar";
  getElement("#btnShows").className = "btnShow";
  populateShowsMenu(id);
  getElement("#episode").className = "showEpisodeMenu";

  let html = "";
  let showMenu = "";
  let movie = await getData(id);
  showMenu += `<option  selected="selected">SelectAll</option>`;
  movie.forEach((episode) => {
    const { name, season, number, summary, image } = episode;
    if (image !== null) {
      const {
        image: { medium },
      } = episode;
      const episodeNumber = `${number > 9 ? number : "0" + number}`;
      const episodeSeason = `${season > 9 ? season : "0" + season}`;
      html += `        
      <div class="episodeCard">
          <h3 class="movieTitle">${name} - S0${episodeSeason}E${episodeNumber}</h3>
          <img class="img" src= ${medium} />
          <div class="summary">${summary}</div>             
      </div>`;

      showMenu += ` <option value=${episode.id + "+" + id}>
          S${episodeSeason}E${episodeNumber} -${name} </option>`;
      getElement("#episode").innerHTML = showMenu;
    } else {
      html += ` 
             
          <div class="episodeCard">
              <h3 class="movieTitle">${name} - S0${season}E0${number}</h3>
              <img class="img" src= "./img.png" />
              <div class="summary">${summary}</div>
        </div>`;
      showMenu += ` <option value=${episode.id + "+" + id}>
                S0${season}E0${number} -${name} </option>`;
      getElement("#episode").innerHTML = showMenu;
    }
  });

  getElement("#episodeGrid").innerHTML = html;
  getElement("#root").innerHTML = "";
  getElement(
    ".countEpisodeResult"
  ).innerText = `\u00A0\ \u00A0\ Displaying ${movie.length}  episodes  `;
}

// function to populate Episode menu based on show selection
function selectShows(id) {
  const option = getElement("#shows").options[
    getElement("#shows").selectedIndex
  ].value;
  listAllShows.forEach((show) => {
    const SHOW_ID = show.id;
    if (show.id == option) {
      getShowsEpisodes(SHOW_ID);
    }
  });
}

function seeAllShows() {
  listShowDetailsOnPage();
}

getElement("#btnShows").addEventListener("click", seeAllShows);

function loadContent() {
  // loadEpisodeList();
  populateShowsMenu();
  listShowDetailsOnPage();
}



window.onload = loadContent;
