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


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
   
  let html = "";
  // let menu = "";
  episodeList.map((item) => {
    html += ` 
          <div class="movieCard">
              <h3 class="movieTitle">${item.name} - S0${item.season}E0${item.number}</h3>
              <img class="img" src= ${item.image.medium} />
              <div class="summary">${item.summary}</div>
          </div>           
    `;

  //  menu += `
   
  //  <option value=${item.id}>S0${item.season}E0${item.number} -${item.name} </option>
   
  //  `;

  });

  rootElem.innerHTML = html;
  info.innerText = `\u00A0\ \u00A0\ Displaying ${episodeList.length}  `;
 // dropDown.innerHTML = menu;
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


function loadMenu(){
  let menu = "";
  allEpisodes.map(item => {
   menu += `
   <option value=${item.id}>S0${item.season}E0${item.number} -${item.name} </option>
   `;

  });
 dropDown.innerHTML = menu;
}

loadMenu();

dropDown.addEventListener("change", (e) =>{
let result = e.target.value;
const ali = allEpisodes.find(movie =>{
  //return console.log(movie.id);

  // if(movie.id === result){
  //    return  console.log(movie.name);
  // }
return movie.id === result;
});
loadMenu(ali);


})




window.onload = setup;
