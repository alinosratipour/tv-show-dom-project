async function getData(getId = 82) {
  let url = `https://api.tvmaze.com/shows/${getId}/episodes`;
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (error) {}
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
    html += ` <div class="movieCard">
                <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
                <img class="img" src= ${item.image.medium} />
                <div class="summary">${item.summary}</div>
             </div>`;
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
    menu += `
          <option value=${item.id}>S0${item.season}E0${item.number} -${item.name} </option>`;
  });
  episodeListMenu().innerHTML = selectDefault + menu;
}

//Select Individual Episode
episodeListMenu().addEventListener("change", () => {
  let result = dropDown.options[dropDown.selectedIndex].value;
  let idArr = result.split("+");
  let episodeId = idArr[0];
  let movieId = idArr[1];
  //console.log("episodeid", episodeId, "movieId =", movieId);

  async function filteredEpisode() {
    let movie = await getData(movieId);

    // let idArr = result.split("+");
    // let episodeId = idArr[0];
    // let movieId = idArr[1];

    const filtered = movie.filter((item) => {
      return item.id == episodeId;
    });

    makePageForEpisodes(filtered, false);

    if (menuDefaultSelection() == "SelectAll") {
      makePageForEpisodes();
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
    e.preventDefault();
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
  //selectDefault += `<option selected="selected">SelectAll</option>`;
  listMovie.map((item) => {
    if (item.id == 82) {
      menu += `<option  selected="selected" value=${item.id}>${item.name} </option> `;
    } else {
      menu += `<option value=${item.id}>${item.name} </option> `;
    }
  });
  dropDownShows().innerHTML = selectDefault + menu;
}

dropDownShows().addEventListener("change", () => {
  selectShows();

  // function to populate Episode menu based on show selection
  function selectShows() {
    let html = "";
    //let i = 0;
    let showMenu = "";
    const getShowId = getAllShows();

    getShowId.map((selected_Show_Id) => {
      const SHOW_ID = selected_Show_Id.id;

      if (selected_Show_Id.id == dropDownShowOptionValue()) {
        fetch(`https://api.tvmaze.com/shows/${SHOW_ID}/episodes`)
          .then((res) => res.json())
          .then(
            (data) =>
              data.map((item ) => {
                html += `<div class="movieCard">
                            <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
                            <img class="img" src= ${item.image.medium} />
                            <div class="summary">${item.summary}</div>
                    </div>`;
               // i = i + 1;
                //console.log("i", i);
                getElement("#root").innerHTML = html;

                showMenu += ` <option value=${item.id + "+" + SHOW_ID}> 
               
              S0${item.season}E0${item.number} -${item.name} </option>`;

                episodeListMenu().innerHTML = showMenu;
              })

            //***************** */

            //********************* */
          );
      }

      // getElement(
      //   ".countEpisodeResult"
      // ).innerText = `\u00A0\ \u00A0\ Displaying ${i} episodes  `;
    });
  }
});

renderElements();
