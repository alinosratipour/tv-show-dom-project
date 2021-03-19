//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

const searchBar = document.querySelector(".searchBar");
const header = document.querySelector(".header");
const allEpisodes = getAllEpisodes();
const info = document.querySelector(".info");
const info2 = document.querySelector(".info2");
const dropDown = document.querySelector("#movie");
const rootElem = document.getElementById("root");

function makePageForEpisodes(episodeList) {
  let html = "";
  let menu = "";
  episodeList.map((item) => {
    html += ` 
          <div class="movieCard">
              <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
              <img class="img" src= ${item.image.medium} />
              <div class="summary">${item.summary}</div>
          </div>           
    `;

    menu += `
   
       <div class="movieCard">
              <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
              <img class="img" src= ${item.image.medium} />
              <div class="summary">${item.summary}</div>
          </div> 
   
     `;
  });

  rootElem.innerHTML = html;
  info.innerText = `\u00A0\ \u00A0\ Displaying ${episodeList.length}  `;
}
info2.innerText = `\u00A0\of \u00A0\ ${allEpisodes.length} episodes`;

// Search event handler
searchBar.addEventListener("keyup", (e) => {
  let result = e.target.value.toLowerCase();

  const filtered = allEpisodes.filter((movie) => {
    return (
      movie.name.toLowerCase().includes(result) ||
      movie.summary.toLowerCase().includes(result)
    );
  });
  //load the filtered records
  makePageForEpisodes(filtered);
});

// load all episodes when default dropDown option selected
function loadMovies() {
  let html = "";
  allEpisodes.map((item) => {
    html += ` 
          <div class="movieCard">
              <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
              <img class="img" src= ${item.image.medium} />
              <div class="summary">${item.summary}</div>
          </div>           
    `;
  });
  rootElem.innerHTML = html;
  info.innerText = `\u00A0\ \u00A0\ Displaying ${allEpisodes.length}  `;
}

//populate select menu dropDown
function loadMenu() {
  let menu = "";
  let selectDefault = "";

  selectDefault += `<option selected="selected">SelectAll</option>`;
  allEpisodes.map((item) => {
    menu += `   
   <option value=${item.id}>S0${item.season}E0${item.number} -${item.name} </option>
   `;
  });

  dropDown.innerHTML = selectDefault + menu;
}

loadMenu();

dropDown.addEventListener("change", () => {
  let result = dropDown.options[dropDown.selectedIndex].value;
  let ali = dropDown.options[dropDown.selectedIndex].text;

  const filtered = allEpisodes.filter((movie) => {
    return movie.id == result;
  });

  makePageForEpisodes(filtered);
  if (ali == "SelectAll") {
    loadMovies();
  }
});

window.onload = setup;
