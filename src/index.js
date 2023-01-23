import './sass/index.scss';
import axios from 'axios';
import ImageApiService from './js/api-fetch-class';
import { createAListMarkup } from './js/render-img-markup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imageApiService = new ImageApiService();
const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery-block');
const loadMorebtn = document.querySelector('.load-more');
searchForm.addEventListener('submit', onSearch);
loadMorebtn.addEventListener('click', onLoadMore);

const lightBox = new SimpleLightbox('.gallery-block div a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(evt) {
  evt.preventDefault();
  const inputValue = evt.currentTarget.searchQuery.value;
  if (!inputValue.trim()) {
    sendAMessageForClient();
    return;
  }
  imageApiService.query = inputValue;
  imageApiService.resetPage();
  imageApiService
    .fetchImg()
    .then(resp => {
      sendAMessageForClient(resp.data.totalHits);
      clearPictureContainer();
      appendAMarkup(resp);
      if (resp.page > 1) {
        smothScroll();
      }
    })
    .catch(err => console.log(err));
}

function onLoadMore() {
  imageApiService
    .fetchImg()
    .then(resp => {
      appendAMarkup(resp);
    })
    .catch(err => console.log(err));
}

function appendAMarkup(arrOfImgData) {
  galleryList.insertAdjacentHTML('beforeend', createAListMarkup(arrOfImgData));
  lightBox.refresh();
}

function clearPictureContainer() {
  galleryList.innerHTML = '';
}

function sendAMessageForClient(value) {
  console.log(value);
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
}