//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);
}

// function test(movieList) {
//   const header = document.createElement("div");
//   let searchBar = document.createElement("input");
//   const searchInfo = document.createElement("p");

//   header.className = "header";
//   searchBar.className = "searchBar";

//   rootElem.appendChild(header);
//   header.appendChild(searchBar);
//   header.appendChild(searchInfo);

//   movieList.filter((i) => {

// return console.log(i.name === "Winter is Coming");
//   });
// }
const filteredMovies = getAllEpisodes();
const rootElem = document.getElementById("root");
const header = document.createElement("div");
let searchBar = document.createElement("input");
const grid = document.createElement("div");
grid.className = "box";
header.appendChild(searchBar);
rootElem.appendChild(header);

header.className = "header";
searchBar.className = "searchBar";

function ali() {
  searchBar.addEventListener("keyup", (e) => {
    const result = e.target.value;
    const filtered = filteredMovies.filter((movie) => {
      return movie.name.includes(result) || movie.summary.includes(result);
    });
    //console.log(filtered);
    //makePageForEpisodes(filtered)
    return filtered;
  });
}

function makePageForEpisodes(episodeList) {
  //const grid = document.createElement("div");
  //const header = document.createElement("div");
  // let searchBar = document.createElement("input");
  // const searchInfo = document.createElement("p");

  //grid.className = "box";
  // header.className = "header";
  // searchBar.className = "searchBar";

  // rootElem.appendChild(header);
  // header.appendChild(searchBar);
  // header.appendChild(searchInfo);

  episodeList.map((item) => {
    // create element
    const card = document.createElement("div");
    const h3 = document.createElement("h3");
    const img = document.createElement("img");
    const movieInfo = document.createElement("p");

    //Append child elements to their parents
    rootElem.appendChild(grid);
    grid.appendChild(card);
    card.appendChild(h3);
    card.appendChild(img);
    card.appendChild(movieInfo);

    //add class to elements
    card.className = "movieCard";
    h3.className = "movieTitle";
    movieInfo.className = "summery";
    img.className = "img";

    // display data on the page
    h3.innerHTML = `  ${item.name} - S0${item.season}E0${item.number} `;
    img.src = `${item.image.medium}`;
    movieInfo.innerHTML = `${item.summary}`;
    return item;
  });
}

window.onload = setup;
