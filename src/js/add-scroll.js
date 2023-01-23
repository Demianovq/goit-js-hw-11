export default function addScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery-block')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
