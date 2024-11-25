import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_KEY = '46893136-84096bff0dd45fd4b99afcbdb';
const form = document.querySelector('#search-form');
const galleryContainer = document.querySelector('#gallery');
const loader = document.querySelector('#loader');
const loadMoreBtn = document.querySelector('#load-more-btn');
let lightbox = new SimpleLightbox('.gallery a');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;
let allImages = [];

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  query = form.querySelector('input').value.trim();
  page = 1;
  allImages = [];

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search keyword.',
    });
    return;
  }

  galleryContainer.innerHTML = '';
  loader.style.display = 'block';
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(query, API_KEY, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      const newImages = data.hits.filter(
        image =>
          !allImages.some(
            existingImage => existingImage.webformatURL === image.webformatURL
          )
      );

      allImages = [...allImages, ...newImages];
      galleryContainer.innerHTML = renderGallery(allImages);
      lightbox.refresh();

      if (newImages.length === perPage && totalHits > perPage) {
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong, please try again later.',
    });
    console.error('Error fetching images:', error);
  } finally {
    loader.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', async function () {
  page += 1;

  loader.style.display = 'block';
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(query, API_KEY, page, perPage);

    if (data.hits.length > 0) {
      const newImages = data.hits.filter(
        image =>
          !allImages.some(
            existingImage => existingImage.webformatURL === image.webformatURL
          )
      );

      allImages = [...allImages, ...newImages];
      galleryContainer.insertAdjacentHTML(
        'beforeend',
        renderGallery(allImages)
      );
      lightbox.refresh();

      if (newImages.length < perPage || page * perPage >= totalHits) {
        iziToast.info({
          title: 'End of Results',
          message: "We're sorry, but you've reached the end of search results.",
        });
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }

      smoothScroll();
    } else {
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong, please try again later.',
    });
    console.error('Error loading more images:', error);
  } finally {
    loader.style.display = 'none';
  }
});

function smoothScroll() {
  const firstCard = galleryContainer.firstElementChild;
  if (firstCard) {
    const { height: cardHeight } = firstCard.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 3,
      behavior: 'smooth',
    });
  }
}
