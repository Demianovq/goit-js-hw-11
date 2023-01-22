import './css/styles.css';
import axios from 'axios';
import ImageApiService from './js/api-fetch-class';
import { createAListMarkup } from './js/render-img-markup';

const imageApiService = new ImageApiService();

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery-block');
const loadMorebtn = document.querySelector('.load-more');
searchForm.addEventListener('submit', onSearch);
loadMorebtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();
  imageApiService.query = evt.currentTarget.searchQuery.value.trim();
  imageApiService.resetPage();
  imageApiService
    .fetchImg()
    .then(resp => {
      console.log(resp);
      clearPictureContainer();
      galleryList.insertAdjacentHTML('beforeend', createAListMarkup(resp));
    })
    .catch(err => console.log(err));
}

function onLoadMore() {
  imageApiService
    .fetchImg()
    .then(resp => {
      galleryList.insertAdjacentHTML('beforeend', createAListMarkup(resp));
    })
    .catch(err => console.log(err));
}

function clearPictureContainer() {
  galleryList.innerHTML = '';
}
