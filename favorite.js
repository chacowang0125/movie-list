const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'


const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
let viewStyle = 'gallery'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const selectViewStyle = document.querySelector('#view-style')

if (viewStyle === 'list') {
  renderListMovieList(movies)
} else {
  renderGalleryMovieList(movies)
}

//選擇顯示的方法
selectViewStyle.addEventListener('click', function (e) {
  if (e.target.matches('.list-view')) {
    renderListMovieList(movies)
    viewStyle = 'list'
  } else {
    renderGalleryMovieList(movies)
    viewStyle = 'gallery'
  }
})

//監聽器監聽按鈕
dataPanel.addEventListener('click', function onPanelClick(e) {
  if (e.target.matches('.btn-show-movie')) {
    showMovieModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(e.target.dataset.id))
  } else return
})

//卡片模式
function renderGalleryMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img src="${POSTER_URL + item.image}" 
              class="card-img-top" alt="Movie Poster">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                  data-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `
  });
  dataPanel.innerHTML = rawHTML
}

//清單模式
function renderListMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
      <div class="col-sm-10">
          <div class="card-content d-flex justify-content-around align-items-center border-bottom p-2 m-2">
            <div class="col-sm-8">
              <h4 class="card-title ml-3">${item.title}</h4>
            </div>
            <div class="card-btn col-sm-4 text-center">
              <button class="btn btn-primary btn-show-movie mr-3" data-toggle="modal" data-target="#movie-modal"
                data-id="${item.id}">More</button>
              <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">Delete</button>
            </div>
          </div>
        </div>
      `
  });
  dataPanel.innerHTML = rawHTML
}

//從蒐藏中刪除
function removeFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  if (viewStyle === 'list') {
    renderListMovieList(movies)
  } else {
    renderGalleryMovieList(movies)
  }
}

//顯示電影詳細資料
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImg = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = data.release_date
    modalDescription.innerText = data.description
    modalImg.innerHTML = `<img
      src="${POSTER_URL + data.image}"
      alt="movie-poster" class="img-fluid">`
  })
    .catch((err) => console.log(err))
}
