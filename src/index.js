import './sass/index.scss';
import addScroll from './js/add-scroll';
import ImageApiService from './js/api-fetch-class';
import { createAListMarkup } from './js/render-img-markup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imageApiService = new ImageApiService();
const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery-block');
const loadMorebtn = document.querySelector('.load-more-btn');
searchForm.addEventListener('submit', onSearch);
loadMorebtn.addEventListener('click', onLoadMore);

const lightBox = new SimpleLightbox('.gallery-block div a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(evt) {
  evt.preventDefault();
  getAStyleLoadMoreBtn();

  const inputValue = evt.currentTarget.searchQuery.value;
  if (!inputValue.trim()) {
    sendAMessageForClient();
    return;
  }
  clearPictureContainer();

  imageApiService.query = inputValue;
  imageApiService.resetPage();
  imageApiService
    .fetchImg()
    .then(resp => {
      sendAMessageForClient(resp.data.totalHits);
      appendAMarkup(resp);
      showALoadMoreBtn();

      if (resp.data.totalHits / resp.page < resp.per_page) {
        hideALoadMoreBtn();
        sendAMessageForClient('end');
      }
    })
    .catch(err => {
      console.log(err);
      sendAMessageForClient('error');
      hideALoadMoreBtn();
    });
}

function onLoadMore() {
  getAStyleLoadMoreBtn();
  imageApiService
    .fetchImg()
    .then(resp => {
      appendAMarkup(resp);
      addScroll();
      showALoadMoreBtn();
      if (resp.data.totalHits / resp.page < resp.per_page) {
        hideALoadMoreBtn();
        sendAMessageForClient('end');
      }
    })
    .catch(err => {
      console.log(err);
      sendAMessageForClient('error');
      hideALoadMoreBtn();
    });
}

function appendAMarkup(arrOfImgData) {
  galleryList.insertAdjacentHTML('beforeend', createAListMarkup(arrOfImgData));
  lightBox.refresh();
}

function clearPictureContainer() {
  galleryList.innerHTML = '';
}

function sendAMessageForClient(value) {
  if (value > 0) {
    Notiflix.Notify.success(`Hooray! We found ${value} images.`);
  }
  if (value === 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }
  if (value === undefined) {
    Notiflix.Notify.failure('Please enter something to search!');
    return;
  }
  if (value === 'end') {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  if (value === 'error') {
    Notiflix.Notify.failure("We're sorry, but we have a problem with server.");
  }
}

function showALoadMoreBtn() {
  loadMorebtn.disabled = false;
  loadMorebtn.classList.remove('is-hidden');
  loadMorebtn.textContent = 'Load more';
}

function hideALoadMoreBtn() {
  loadMorebtn.disabled = true;
  loadMorebtn.classList.add('is-hidden');
}

function getAStyleLoadMoreBtn() {
  loadMorebtn.textContent = 'Loading...';
  loadMorebtn.classList.remove('is-hidden');
}
