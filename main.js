const elList = document.querySelector(".list");
const elTemplate = document.querySelector(".render-item").content;
const elModalOpenBtn = document.querySelector(".movie-title");
const elModal = document.querySelector(".modal-overlay");
const elModalCloseBtn = document.querySelector(".modal-close");
const elForm = document.querySelector(".site-form");
const elSelect = document.querySelector(".select-input");
const elSearch = document.querySelector(".search-input");
const toInput = document.querySelector(".to-input");
const fromInput = document.querySelector(".from-input");
const elSortSelect = document.querySelector(".sort-select");
const elBookMarkBtn = document.querySelector(".open-bookmark");
const elBookMarkModalInner = document.querySelector(".bookmark-modal-inner");
const elBookMarkModal = document.querySelector(".bookmark-modal");
const elBookMarkCloseBtn = document.querySelector(".bookmark-modal-close");

console.log(elBookMarkBtn);
const elFragment = new DocumentFragment();
const category = [];
const arr = movies.slice(0, 101);
const toHour = function (time) {
  const hour = Math.floor(time / 60);
  const min = time % 60;
  return `${hour}hr, ${min}min`;
};

function renderUi(arr) {
  elList.innerHTML = "";

  arr.forEach((item) => {
    const template = elTemplate.cloneNode(true);

    template.querySelector(".movie-img").src = item.youtubePoster;
    template.querySelector(".movie-title").textContent = item.title;
    template.querySelector(".rank").textContent = item.imdbRating;
    template.querySelector(".year").textContent = item.year;
    template.querySelector(".time").textContent = toHour(item.runtime);
    template.querySelector(".movie-text").textContent =
      item.categories.join(" | ");
    template.querySelector(".movie-btn").dataset.btnId = item.imdbId;
    template.querySelector(".bookmark-btn").dataset.bookMarkId = item.imdbId;
    elFragment.appendChild(template);
  });

  elList.appendChild(elFragment);
}
renderUi(arr);

function openModal(id) {
  let item = arr.find((item) => item.imdbId === id);
  elModal.querySelector(".modal-title").textContent = item.title;
  elModal.querySelector(
    ".modal-iframe"
  ).src = `https://www.youtube-nocookie.com/embed/${item.ytid}`;
  elModal.querySelector(".modal-rank").textContent = item.imdbRating;
  elModal.querySelector(".modal-year").textContent = item.year;
  elModal.querySelector(".modal-time").textContent = toHour(item.runtime);
  elModal.querySelector(
    ".modal-link"
  ).href = `https://www.imdb.com/title/${item.imdbId}`;
  elModal.querySelector(".modal-summary").textContent = item.summary;
}

elList.addEventListener("click", function (evt) {
  if (evt.target.matches(".movie-btn")) {
    elModal.classList.add("modal-open");
    openModal(evt.target.dataset.btnId);
  }
  if (evt.target.matches(".bookmark-btn")) {
    const currentItem = evt.target;
    currentItem.classList.toggle("bookmark-clicked");

    bookmark(evt.target.dataset.bookMarkId);
  }
});

elModalCloseBtn.addEventListener("click", function (evt) {
  evt.preventDefault();
  elModal.classList.remove("modal-open");
  elModal.querySelector(".modal-iframe").src = "";
});

function addCategoryToSelect() {
  const selectFragment = new DocumentFragment();
  movies.forEach((item) => {
    item.categories.forEach(function (cat) {
      if (!category.includes(cat)) {
        category.push(cat);
      }
    });
  });
  category.sort();
  category.forEach((item) => {
    const newOp = document.createElement("option");
    newOp.textContent = item;
    newOp.value = item;
    selectFragment.appendChild(newOp);
  });

  elSelect.appendChild(selectFragment);
}

addCategoryToSelect();

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const selectVal = elSelect.value;
  const searchVal = elSearch.value;
  const toYear = toInput.value;
  const fromYear = fromInput.value;
  const sortBy = elSortSelect.value;

  const regex = new RegExp(searchVal.trim(), "gi");
  const searchedArr = movies.filter((item) => {
    return (
      item.title.match(regex) &&
      (selectVal === "all" || item.categories.includes(selectVal)) &&
      (item.year >= Number(toYear.trim()) || toYear.trim() === "") &&
      (item.year <= Number(fromYear.trim()) || fromYear.trim() === "")
    );
  });

  if (searchedArr.length > 0) {
    renderUi(searchedArr.slice(0, 101));
  } else {
    alert("There is no film by this title");
  }

  if (sortBy === "A>Z") {
    sortAZ(searchedArr.slice(0, 101));
  } else if (sortBy === "Z<A") {
    sortZA(searchedArr.slice(0, 101));
  } else if (sortBy === "highRate") {
    highRate(searchedArr.slice(0, 101));
  } else if (sortBy === "lowRate") {
    lowRate(searchedArr.slice(0, 101));
  } else if (sortBy === "No Rate") {
    renderUi(arr);
  }
});

function sortAZ(arr) {
  const sorted = arr.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else {
      0;
    }
  });
  renderUi(sorted);
}

function sortZA(arr) {
  const sorted = arr.sort((a, b) => {
    if (a.title > b.title) {
      return -1;
    } else if (a.title < b.title) {
      return 1;
    } else {
      0;
    }
  });
  renderUi(sorted);
}

function lowRate(arr) {
  const sorted = arr.sort((a, b) => {
    if (a.imdbRating > b.imdbRating) {
      return 1;
    } else if (a.imdbRating < b.imdbRating) {
      return -1;
    } else {
      0;
    }
  });
  renderUi(sorted);
}

function highRate(arr) {
  const sorted = arr.sort((a, b) => {
    if (a.imdbRating > b.imdbRating) {
      return -1;
    } else if (a.imdbRating < b.imdbRating) {
      return 1;
    } else {
      0;
    }
  });
  renderUi(sorted);
}

const titleArr = [];

function bookmark(id) {
  const bookMarkedItem = movies.find((item) => item.imdbId === id);
  titleArr.push(bookMarkedItem.title);
  elBookMarkBtn.textContent = `Bookmarked ${titleArr.length}`;
}

elBookMarkBtn.addEventListener("click", function () {
  elBookMarkModal.classList.add("bookmark-open");
  elBookMarkModalInner.innerHTML = "";
  console.log(titleArr);
  titleArr.forEach((item, index) => {
    const newP = document.createElement("p");
    newP.textContent = `${index + 1}. ${item}`;
    elBookMarkModalInner.appendChild(newP);
  });
});

elBookMarkCloseBtn.addEventListener("click", function () {
  elBookMarkModal.classList.remove("bookmark-open");
});
