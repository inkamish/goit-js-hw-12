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
let lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const query = form.querySelector('input').value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search keyword.',
    });
    return;
  }

  galleryContainer.innerHTML = '';
  loader.style.display = 'block';

  fetchImages(query, API_KEY)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          title: 'No results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        galleryContainer.innerHTML = renderGallery(data.hits);
        lightbox.refresh();
      }
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong, please try again later.',
      });
    })
    .finally(() => {
      loader.style.display = 'none';
    });
});
