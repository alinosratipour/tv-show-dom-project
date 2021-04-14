const listAllShows = getAllShows();
async function getData(showId = 82) {
  let url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  try {
    let resolve = await fetch(url);
    let data = await resolve.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getShowsCast(getId) {
  const castUrl = `https://api.tvmaze.com/shows/${getId}?embed=cast`;
  try {
    let resolve = await fetch(castUrl);
    let data = await resolve.json();

    //return console.log(data);
    return data._embedded.cast;
  } catch (error) {
    console.log(error);
  }
}

//make selection of either class or id
function getElement(param) {
  return document.querySelector(param);
}

// Displaying All Shows on the page
function listShowDetailsOnPage(listShow, isAllShows = true) {
  getElement("#episode").className = "hideEpisodeMenu";
  getElement("#episodeSearch").className = "hideSearchBar";
  getElement("#btnShows").className = "btnHidden";
  let html = "";
  if (isAllShows == true) listShow = listAllShows;
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
        <div  class="showsList" >                             
          <img alt="tvShows" class="showImage" src= ${medium} />
          <div  class="showSummary">${summary}</div>
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
  ).innerText = `Displaying ${listShow.length} of ${listAllShows.length} shows`;
}

// loads all the Episodes to the page
async function makePageForEpisodes(listEpisodes, isAllEpisodes = true) {
  let html = "";
  let ShowId = getElement("#shows").options[getElement("#shows").selectedIndex]
    .value;
  let wholeMovies = await getData(ShowId);
  if (isAllEpisodes == true) listEpisodes = await getData();
  listEpisodes.forEach((episode) => {
    const { name, season, number, image, summary } = episode;
    let img = "img.png";
    if (image !== null) {
      const {
        image: { medium },
      } = episode;
      img = medium;
    }

    html += makeEpisodeCards(name, season, number, img, summary);
  });

  getElement("#episodeGrid").innerHTML = html;
  if (isAllEpisodes == true) {
    getElement(
      ".countEpisodeResult"
    ).innerText = `Displaying ${wholeMovies.length} episodes  `;
  } else {
    getElement(
      ".countEpisodeResult"
    ).innerText = `Displaying ${listEpisodes.length} off ${wholeMovies.length} episodes  `;
  }
}

function makeEpisodeCards(name, season, number, img, summary) {
  let html = `              
          <div class="episodeCard">
              <h3 class="movieTitle">${name} - S0${season}E0${number}</h3>
              <img class="img" src= ${img} />
              <div class="summary">${summary}</div>
          </div>`;
  return html;
}

//Select Individual Episode
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
getElement("#episode").addEventListener("change", filteredEpisode);

// search for the episodes
async function searchInEpisodes(e) {
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

getElement("#episodeSearch").addEventListener("keyup", searchInEpisodes);

function searchInShows(e) {
  let result = e.target.value.toLowerCase();
  const filtered = listAllShows.filter((show) => {
    const { name, summary, genres } = show;
    if (name !== null && summary !== null && genres !== null) {
      return (
        name.toLowerCase().includes(result) ||
        summary.toLowerCase().includes(result) ||
        genres.join(",").toLowerCase().includes(result)
      );
    }
  });
  listShowDetailsOnPage(filtered, false);
}
getElement("#showsSearch").addEventListener("keyup", searchInShows);

//populate select menu dropDownShow 82 is the default show selection
function populateShowsMenu(id = 82) {
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

// filter show rating based on user selection
function sortRating() {
  let option = getElement("#rating").options[
    getElement("#rating").selectedIndex
  ].value;
  const filterRating = listAllShows.sort(function (a, b) {
    if (option == "TopRated") {
      return b.rating.average - a.rating.average;
    } else {
      return a.rating.average - b.rating.average;
    }
  });
  listShowDetailsOnPage(filterRating, true);
}
getElement("#rating").addEventListener("change", sortRating);

//Show All casts on the page
async function getCasts(id) {
  let casts = await getShowsCast(id);
  let html = "";
  casts.forEach((cast) => {
    const {
      person: { name },
    } = cast;
    let img = "img.png";
    if (cast.character.image !== null) {
      img = cast.character.image.medium;
    }
    html += `<div class="castList">
            <div class="castCard">
                <img alt="cast" class="castImg" src= ${img} />
                <a href="#" class="personLink">${name}</a> 
                <p class="character">As:  ${cast.character.name}</p>
            </div>
           </div>`;
  });
  getElement(".castContainer").innerHTML = html;
}

//render on the page and populate episode drop down based on show selection.
async function getShowsEpisodes(showId) {
  getElement("#showsSearch").className = "hideSearchBar";
  getElement("#rating").className = "hideSearchBar";
  getElement("#episodeSearch").className = "showSearchBar";
  getElement("#btnShows").className = "btnShow";
  populateShowsMenu(showId);
  getElement("#episode").className = "showEpisodeMenu";
  getCasts(showId);

  let html = "";
  let showMenu = "";
  let movie = await getData(showId);
  showMenu += `<option  selected="selected">SelectAll</option>`;
  movie.forEach((episode) => {
    let img = "img.png";
    const { name, season, number, summary, image } = episode;
    if (image !== null) {
      const {
        image: { medium },
      } = episode;
      img = medium;
    }
    const episodeNumber = `${number > 9 ? number : "0" + number}`;
    const episodeSeason = `${season > 9 ? season : "0" + season}`;
    html += makeEpisodeCards(name, season, number, img, summary);

    showMenu += ` <option value=${episode.id + "+" + showId}>
          S${episodeSeason}E${episodeNumber} -${name} </option>`;
    getElement("#episode").innerHTML = showMenu;
  });

  getElement("#episodeGrid").innerHTML = html;
  getElement("#root").innerHTML = "";
  getElement(
    ".countEpisodeResult"
  ).innerText = ` Displaying ${movie.length}  episodes`;
}

// function to populate Episode menu based on show selection
function selectShows() {
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

function loadContent() {
  populateShowsMenu();
  listShowDetailsOnPage();
}

window.onload = loadContent;
