//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  let html = "";

  episodeList.map((item) => {
    html += ` 
          <div class="movieCard">
              <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
              <img class="img" src= ${item.image.medium} />
              <div class="summary">${item.summary}</div>
          </div>
    `;
  });

  rootElem.innerHTML = html;
}

const searchBar = document.querySelector(".searchBar");
const header = document.querySelector(".header");
const allEpisodes = getAllEpisodes();

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

window.onload = setup;
