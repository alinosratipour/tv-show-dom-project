async function getData(getId = 82) {
  let url = `https://api.tvmaze.com/shows/${getId}/episodes`;
  try {
    let res = await fetch(url);
    let data = await res.json();
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

// loads all the movie to the page
async function makePageForEpisodes(listMovie, b = true) {
  if (b == true) listMovie = await getData();
  let id = dropDownShowOptionValue();
  wholeMovies = await getData(id);
  let html = "";
  listMovie.map((item) => {
    if (item.image === null) {
      return "";
    } else {
      html += ` <div class="movieCard">
                <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
                <img class="img" src= ${item.image.medium} />
                <div class="summary">${item.summary}</div>
             </div>`;
    }
  });

  getElement("#root").innerHTML = html;

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
  makePageForEpisodes(); // show All Episodes
  populateShowsMenu();
}

//populate select menu dropDown
async function loadEpisodeList() {
  let menu = "";
  let selectDefault = "";
  let movie = await getData();
  selectDefault += `<option selected="selected">SelectAll</option>`;
  movie.map((item) => {
    //if()
    menu += `
        
          <option value=${item.id}>S0${
      item.season
    }E-${item.number.toString().padStart(2, "0")} -${item.name} </option>`;
  });
  episodeListMenu().innerHTML = selectDefault + menu;
}

//Select Individual Episode
episodeListMenu().addEventListener("change", () => {
  let result = dropDown.options[dropDown.selectedIndex].value;
  let idArr = result.split("+");
  let episodeId = idArr[0];
  let movieId = idArr[1];

  async function filteredEpisode() {
    let movie = await getData(movieId);

    const filtered = movie.filter((item) => {
      return item.id == episodeId;
    });

    makePageForEpisodes(filtered, false);

    if (menuDefaultSelection() == episodeId) {
      selectShows();
    }
  }
  filteredEpisode();
});

// This function creates and return search field on the page
function searchBarInput() {
  const searchBar = document.createElement("input");
  searchBar.className = "searchBar";
  getElement(".searchContainer").appendChild(searchBar);
  return searchBar;
}

// SearchBar Event listener for keywords entered in the field
searchBarInput().addEventListener("keyup", (e) => {
  let id = dropDownShowOptionValue();
  async function filteredSearchResult() {
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
  filteredSearchResult();
});

//populate select menu dropDownShow
async function populateShowsMenu(listMovie, b = true) {
  if (b == true) listMovie = await getAllShows();
  let menu = "";
  let selectDefault = "";
 

  // sort the shows names on alphabetical order
  listMovie = listMovie.sort(function (show1, show2) {
    return show1.name.localeCompare(show2.name);
  });

  listMovie.map((item) => {
    let gameOfThrone = 82;
    if (item.id == gameOfThrone) {
      menu += `<option  selected="selected" value=${item.id}>${item.name} </option> `;
    } else {
      menu += `<option value=${item.id}>${item.name} </option> `;
    }
  });
  dropDownShows().innerHTML = selectDefault + menu;
}

dropDownShows().addEventListener("change", selectShows);

// function to populate Episode menu based on show selection
function selectShows() {
  let html = "";
  let showMenu = "";
  const getShowId = getAllShows();

  getShowId.map((selected_Show_Id) => {
    const SHOW_ID = selected_Show_Id.id;

    //render on the page and populate episode drop down based on show selection.
    async function getShowsEpisodes(id) {
      let movie = await getData(id);
      showMenu += `<option selected="selected">SelectAll</option>`;
      movie.map((item) => {
        if (item.image === null) {
          return "";
        } else {
          html += `<div class="movieCard">
                        <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
                        <img class="img" src= ${item.image.medium} />
                        <div class="summary">${item.summary}</div>
                </div>`;
          getElement("#root").innerHTML = html;

          showMenu += ` <option value=${item.id + "+" + SHOW_ID}>
          S0${item.season}E0${item.number} -${item.name} </option>`;

          episodeListMenu().innerHTML = showMenu;
        }
      });
      getElement(
        ".countEpisodeResult"
      ).innerText = `\u00A0\ \u00A0\ Displaying ${movie.length}  episodes  `;
    }

    // if user select show then it find's episodes based on show selection
    if (selected_Show_Id.id == dropDownShowOptionValue()) {
      getShowsEpisodes(SHOW_ID);
    }
  });
}
renderElements();
