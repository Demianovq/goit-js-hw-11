import axios from 'axios';
export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImg() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '33034039-f29345260b0e0482a01649a08';
    const params = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      page: this.page,
      per_page: this.per_page,
      orientation: 'horizontal',
      safesearch: true,
    };

    const response = await axios.get(BASE_URL, { params });

    this.updatePage();

    const {
      data,
      config: {
        params: { per_page, page },
      },
    } = response;

    return { data, page, per_page };
  }

  updatePage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuerry) {
    this.searchQuery = newQuerry;
  }
}

export { fetchImg };
