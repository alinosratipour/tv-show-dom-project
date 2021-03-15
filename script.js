//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const grid = document.createElement("div");

  grid.className = "box";

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
