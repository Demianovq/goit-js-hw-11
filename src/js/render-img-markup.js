function createAListMarkup(arr) {
  return arr.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <div class="photo-card">
        <a href="${largeImageURL}">
        <img class="photo-card__img" src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" width="285" heigth="190" loading="lazy" />
        </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>
      `
    )
    .join('');
}

export { createAListMarkup };
