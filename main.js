const elList = document.querySelector(".list");
const elTemplate = document.querySelector(".render-item").content;
const elModalOpenBtn = document.querySelector(".movie-title");
const elModal = document.querySelector(".modal-overlay");
const elModalCloseBtn = document.querySelector(".modal-close");
const elFragment = new DocumentFragment();
console.log(elModalOpenBtn);
const arr = movies.slice(0, 101);
console.log(arr);
const toHour = function (time) {
  const hour = Math.floor(time / 60);
  const min = time % 60;
  return `${hour}hr, ${min}min`;
};

function renderUi(arr) {
  elList.innerHTML = "";

  arr.forEach((item) => {
    const template = elTemplate.cloneNode(true);

    template.querySelector(
      ".movie-img"
    ).src = `http://i3.ytimg.com/vi/${item.ytid}/mqdefault.jpg`;
    template.querySelector(".movie-title").textContent = item.Title;
    template.querySelector(".rank").textContent = item.imdb_rating;
    template.querySelector(".year").textContent = item.movie_year;
    template.querySelector(".time").textContent = toHour(item.runtime);
    template.querySelector(".movie-text").textContent = item.Categories;
    template.querySelector(".movie-btn").dataset.btnId = item.imdb_id;
    elFragment.appendChild(template);
  });

  elList.appendChild(elFragment);
}
renderUi(arr);

function openModal(id) {
  let item = arr.find((item) => item.imdb_id === id);
  elModal.querySelector(".modal-title").textContent = item.Title;
  elModal.querySelector(
    ".modal-iframe"
  ).src = `https://www.youtube-nocookie.com/embed/${item.ytid}`;
  elModal.querySelector(".modal-rank").textContent = item.imdb_rating;
  elModal.querySelector(".modal-year").textContent = item.movie_year;
  elModal.querySelector(".modal-time").textContent = toHour(item.runtime);
  elModal.querySelector(
    ".modal-link"
  ).href = `https://www.imdb.com/title/${item.imdb_id}`;
  elModal.querySelector(".modal-summary").textContent = item.summary;
}

elList.addEventListener("click", function (evt) {
  if (evt.target.matches(".movie-btn")) {
    elModal.classList.add("modal-open");
    openModal(evt.target.dataset.btnId);
  }
});

elModalCloseBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  elModal.classList.remove("modal-open");
});
