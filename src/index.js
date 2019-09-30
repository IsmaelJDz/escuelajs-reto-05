const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";
//const API = "https://us-central1-escuelajs-api.cloudfunctions.net/characters";

window.localStorage.clear();

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      localStorage.setItem("next_fetch", response.info.next);
      if (localStorage.getItem("next_fetch") != "") {
        let output = characters
          .slice(0, 15)
          .map(character => {
            return `
              <article class="Card">
                <img src="${character.image}" />
                <h2>${character.name}<span>${character.species}</span></h2>
              </article>
            `;
          })
          .join("");
        render(output);
      } else {
        let output = `
          <div>
            <h1>Ya no hay personajes…</h1>
          </div>
        `;
        intersectionObserver.unobserve($observe);
        render(output);
      }
    })
    .catch(error => console.log(error));
};

const render = output => {
  let newItem = document.createElement("section");
  newItem.classList.add("Items");
  newItem.innerHTML = output;
  $app.appendChild(newItem);
};

const loadData = async () => {
  const next_fetch = localStorage.getItem("next_fetch");
  next_fetch != null ? await getData(next_fetch) : await getData(API);
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

intersectionObserver.observe($observe);
