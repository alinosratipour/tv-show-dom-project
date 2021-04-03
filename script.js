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

function getElement(param) {
  return document.querySelector(param);
}
function episodeListMenu() {
  return (dropDown = document.querySelector("#movie"));
}
function menuDefaultSelection() {
  return dropDown.options[dropDown.selectedIndex].text;
}
function dropDownShows() {
  return (showsDropDown = document.querySelector("#shows"));
}
function dropDownShowOptionValue() {
  return showsDropDown.options[showsDropDown.selectedIndex].value;
}
function episodeDropDown() {
  return dropDown.options[dropDown.selectedIndex].value;
}

// loads all the Episodes to the page
async function makePageForEpisodes(listMovie, b = true) {
  if (b == true) listMovie = await getData();
  let id = dropDownShowOptionValue();
  wholeMovies = await getData(id);
  let html = "";
  listMovie.map((item) => {
    if (item.image === null) {
      return "";
    } else {
      html += ` 
             
                <div class="episodeCard">
                    <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
                    <img class="img" src= ${item.image.medium} />
                    <div class="summary">${item.summary}</div>
                </div>
           
             `;
    }
  });

  getElement("#episodeGrid").innerHTML = html;

  if (b == true) {
    getElement(
      ".countEpisodeResult"
    ).innerText = `\u00A0\ \u00A0\ Displaying ${wholeMovies.length} episodes  `;
  } else {
    getElement(
      ".countEpisodeResult"
    ).innerText = `\u00A0\ \u00A0\ Displaying ${listMovie.length} off ${wholeMovies.length} episodes  `;
  }
}

function renderElements() {
  loadEpisodeList();
  // makePageForEpisodes(); // show All Episodes
  populateShowsMenu();
  listShowDetailsOnPage();
}

//populate select menu dropDown
async function loadEpisodeList() {
  let menu = "";
  let selectDefault = "";
  let movie = await getData();
  selectDefault += `<option selected="selected">SelectAll</option>`;
  movie.map((item) => {
    menu += `
        
          <option value=${item.id}>S0${
      item.season
    }E-${item.number.toString().padStart(2, "0")} -${item.name} </option>`;
  });
  episodeListMenu().innerHTML = selectDefault + menu;
}

async function filteredEpisode() {
  let result = dropDown.options[dropDown.selectedIndex].value;
  let idArr = result.split("+");
  let episodeId = idArr[0];
  let movieId = idArr[1];
  let movie = await getData(movieId);

  const filtered = movie.filter((item) => {
    return item.id == episodeId;
  });

  makePageForEpisodes(filtered, false);

  if (menuDefaultSelection() == episodeId) {
    selectShows();
  }
}

//Select Individual Episode
episodeListMenu().addEventListener("change", filteredEpisode);

// This function creates and return search field on the page
function searchBarInput() {
  const searchBar = document.createElement("input");
  searchBar.className = "searchBar";
  getElement(".searchContainer").appendChild(searchBar);
  return searchBar;
}

async function filteredSearchResult(e) {
  let id = dropDownShowOptionValue();
  let movie = await getData(id);
  let result = e.target.value.toLowerCase();
    const filtered = movie.filter((item) => {
      return (
        item.name.toLowerCase().includes(result) ||
        item.summary.toLowerCase().includes(result)
      );
    });
  makePageForEpisodes(filtered, false);
}
// SearchBar Event listener for keywords entered in the field
searchBarInput().addEventListener("keyup", filteredSearchResult);




//populate select menu dropDownShow
async function populateShowsMenu(id = 82) {
  let listMovie = await getAllShows();
  let menu = "";
  let selectDefault = "";

  // sort the shows names on alphabetical order
  listMovie = listMovie.sort(function (show1, show2) {
    return show1.name.localeCompare(show2.name);
  });

  listMovie.forEach((item) => {
    if (item.id == id) {
      menu += `<option  selected="selected" value=${item.id}>${item.name} </option> `;
    } else {
      menu += `<option value=${item.id}>${item.name} </option> `;
    }
  });

  dropDownShows().innerHTML = selectDefault + menu;
}

dropDownShows().addEventListener("change", selectShows);

//render on the page and populate episode drop down based on show selection.
async function getShowsEpisodes(id) {
  populateShowsMenu(id);
  episodeListMenu().className = "showEpisodeMenu";
  let html = "";
  let showMenu = "";
  let movie = await getData(id);
  showMenu += `<option  selected="selected">SelectAll</option>`;
  movie.map((item) => {
    const {name, season,number,summary} = item;
    if (item.image === null) {
      return "";
    } else {
      html += ` 
               
                  <div class="episodeCard">
                      <h3 class="movieTitle">${name} - S0${season}E0${number}</h3>
                      <img class="img" src= ${item.image.medium} />
                      <div class="summary">${summary}</div>
                  
         </div>
             `;
      getElement("#episodeGrid").innerHTML = html;
      getElement("#root").innerHTML = "";

      showMenu += ` <option value=${item.id + "+" + id}>
          S0${season}E0${number} -${name} </option>`;

      episodeListMenu().innerHTML = showMenu;
    }
  });
  getElement(
    ".countEpisodeResult"
  ).innerText = `\u00A0\ \u00A0\ Displaying ${movie.length}  episodes  `;
}

// function to populate Episode menu based on show selection
function selectShows(id) {
  const getShowId = getAllShows(id);
  getShowId.map((selected_Show_Id) => {
    const SHOW_ID = selected_Show_Id.id;
    // if user select show then it find's episodes based on show selection
    if (selected_Show_Id.id == dropDownShowOptionValue()) {
      getShowsEpisodes(SHOW_ID);
    }
  });
}

function listShowDetailsOnPage() {
  const listShows = getAllShows();
  episodeListMenu().className = "hideEpisodeMenu";

  let html = "";

  listShows.map((show) => {
    const {name,genres,status,runtime,summary} = show;
    const SHOW_ID = show.id;
    if (show.image === null) {
      return "";
    } else {
      html += `
     
       <a  onclick= getShowsEpisodes(${SHOW_ID})  class ="showTitle">${name} </a>
       
               <div class="showsList" >
                            
                    <img alt="tv shows" src= ${show.image.medium} />
                    <div class="showSummary">${summary}</div>
                        <ul  class="showDetails"> 
                          <li class="showDetailsItems">Rated: ${show.rating.average}</li>
                          <li class="showDetailsItems"> Generes: ${genres}</li>
                          <li class="showDetailsItems"  >Status: ${status}</li>
                          <li class="showDetailsItems" >Runtime: ${runtime}</li>
                       </ul>                  
              </div>  
              
              `;
      getElement("#root").innerHTML = html;

      getElement(
        ".countEpisodeResult"
      ).innerText = `\u00A0\ \u00A0\ found ${listShows.length} shows  `;
    }
  });
}

const listShows = getAllShows();



renderElements();
