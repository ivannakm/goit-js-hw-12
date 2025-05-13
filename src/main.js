import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import {getImagesByQuery} from './js/pixabay-api';
import {createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton} from './js/render-functions';

const form = document.querySelector('.form');
const input = document.querySelector('.form-input');
const loadMoreBtn = document.querySelector('.gallery-load-btn');

let currentPage = 1;
let currentQuery = '';
let totalImg = 0;
const perPage = 15;

// Scroll function

function scrollGallery() {
  const card = document.querySelector('.gallery-item-wrapper');
  if (!card) return;

  const { height: cardHeight } = card.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

form.addEventListener('submit', async event => {
    event.preventDefault();
  
    const query = input.value.trim();
  
    if (query === '') {
      iziToast.warning({
        title: 'Warning',
        message: 'Please enter a search field!',
        position: 'topLeft',
      });
      return;
    }
  currentQuery = query;
  currentPage = 1;
  totalImg = 0;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

      try{
    const data = await getImagesByQuery(currentQuery, currentPage);

        if (!data || !data.hits.length) {
          iziToast.error({
            title: 'Error',
            message: 'Sorry, there are no images matching your search query. Please try again!',
            position: 'topRight',
          });

          return;
        }
    createGallery(data.hits);
    totalImg = data.totalHits;

    if (totalImg > perPage) {
      showLoadMoreButton();
    }
  }
      catch(error) {
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong.',
          position: 'topRight',
        });
      }
      finally {
      hideLoader();
      form.reset();
      }
  });

  // Load more btn
  loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    showLoader();

    try {
      const data = await getImagesByQuery(currentQuery, currentPage);

      if (!data || !data.hits.length) {
        hideLoadMoreButton();
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
        return;
      }
      createGallery(data.hits);

      // Scroll

      scrollGallery();

      const totalLoaded = document.querySelectorAll('.gallery-item-wrapper').length;
    if (totalLoaded >= totalImg) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
      
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong during loading more images.',
        position: 'topRight',
      });
    } finally {
      hideLoader();
    }
  });
  