import './sass/index.scss';
import ImageApiService from './js/api-fetch-class';
import { createAListMarkup } from './js/render-img-markup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import addScroll from './js/add-scroll';

const imageApiService = new ImageApiService();
const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery-block');
const loadMorebtn = document.querySelector('.load-more-btn');
loadMorebtn.disabled = true;
loadMorebtn.classList.add('is-hidden');
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
      showALoadMoreBtn();
      if (resp.data.totalHits / resp.page < resp.per_page) {
        hideALoadMoreBtn();
      }
      appendAMarkup(resp);
    })
    .catch(err => console.log(err));
}

function onLoadMore() {
  imageApiService
    .fetchImg()
    .then(resp => {
      appendAMarkup(resp);
      addScroll();

      if (resp.data.totalHits / resp.page < resp.per_page) {
        hideALoadMoreBtn();
      }
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

  // if (value > 20) {
  //   showALoadMoreBtn();
  // }
}

function showALoadMoreBtn() {
  loadMorebtn.disabled = false;
  loadMorebtn.classList.remove('is-hidden');
}

function hideALoadMoreBtn() {
  loadMorebtn.disabled = true;
  loadMorebtn.classList.add('is-hidden');
}
