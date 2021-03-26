async function getData(getId) {
  let url = `https://api.tvmaze.com/shows/82/episodes`;
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (error) {}
}

//******************************88tem */
async function makePageForEpisodes(listMovie, b = true) {
  if (b == true) listMovie = await getData();
  wholeMovies = await getData();
  let html = "";
  listMovie.map((item) => {
    html += ` <div class="movieCard">
                <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
                <img class="img" src= ${item.image.medium} />
                <div class="summary">${item.summary}</div>
             </div>`;
  });

  episodeRoot("#root").innerHTML = html;
  if (b == true) {
    episodeRoot(
      ".countEpisodeResult"
    ).innerText = `\u00A0\ \u00A0\ Displaying ${wholeMovies.length} episodes  `;
  } else {
    episodeRoot(
      ".countEpisodeResult"
    ).innerText = `\u00A0\ \u00A0\ Displaying ${listMovie.length} off ${wholeMovies.length} episodes  `;
  }
}

function renderElements() {
  searchBarInput(); // show search bar
  loadMenu(); //populate list menu
  makePageForEpisodes(); // show All Episodes
  populateShowsMenu();
}

function episodeListMenu() {
  return (dropDown = document.querySelector("#movie"));
}
//populate select menu dropDown
async function loadMenu() {
  let movie = await getData();
  let menu = "";
  let selectDefault = "";

  selectDefault += `<option selected="selected">SelectAll</option>`;
  movie.map((item) => {
    menu += `   
        <option value=${item.id}>S0${item.season}E0${item.number} -${item.name} </option>`;
  });

  episodeListMenu().innerHTML = selectDefault + menu;

  // filter's episode based on user selection
  dropDown.addEventListener("change", () => {
    let result = dropDown.options[dropDown.selectedIndex].value;
    let defaultSelection = dropDown.options[dropDown.selectedIndex].text;

    const filtered = movie.filter((selectedEpisode) => {
      return selectedEpisode.id == result;
    });

    makePageForEpisodes(filtered, false);
    if (defaultSelection == "SelectAll") {
      makePageForEpisodes();
    }
  });
}

function episodeRoot(param) {
  return document.querySelector(param);
}

async function searchBarInput() {
  let movie = await getData();
  const searchBar = document.createElement("input");
  searchBar.className = "searchBar";
  episodeRoot(".searchContainer").appendChild(searchBar);

  searchBar.addEventListener("keyup", (e) => {
    e.preventDefault();
    let result = e.target.value.toLowerCase();
    const filtered = movie.filter((item) => {
      return (
        item.name.toLowerCase().includes(result) ||
        item.summary.toLowerCase().includes(result)
      );
    });

    makePageForEpisodes(filtered, false);
  });
}

function dropDownShows() {
  return (showsDropDown = document.querySelector("#shows"));
}

//populate select menu dropDownShow
function populateShowsMenu() {
  const displayShows = getAllShows();

  const ali = loadMenu();
  let menu = "";
  let selectDefault = "";

  selectDefault += `<option selected="selected">SelectAll</option>`;
  displayShows.map((item) => {
    menu += `   
   <option value=${item.id}>${item.name} </option>
   `;
  });

  dropDownShows().innerHTML = selectDefault + menu;

  // filter's episode based on user selection
  showsDropDown.addEventListener("change", () => {
    let result = showsDropDown.options[showsDropDown.selectedIndex].value;
    //let defaultSelection = showsDropDown.options[showsDropDown.selectedIndex].text;
    let html = "";
    let showMenu ="";
    displayShows.map((selectedShows) => {
      const SHOW_ID = selectedShows.id;
      if (selectedShows.id == result) {
        //return alert(selectedShows.id);

        fetch(`https://api.tvmaze.com/shows/${SHOW_ID}/episodes`)
          .then((res) => res.json())
          .then((data) =>
            data.map((item) => {
              html += `<div class="movieCard">
                      <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
                      <img class="img" src= ${item.image.medium} />
                      <div class="summary">${item.summary}</div>
              </div>`;
              episodeRoot("#root").innerHTML = html;
             
      
            })
          );
      }
   showMenu += ` <option value=${selectedShows.id}>S0${selectedShows.season}E0${selectedShows.number} -${selectedShows.name} </option>`; 
         episodeListMenu().innerHTML =  showMenu;
      });
 
      
      
  });
}

renderElements();
