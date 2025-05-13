import axios from 'axios';
import iziToast from 'izitoast';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50172771-05af20c50899f4393bfb7f5e3';

export async function getImagesByQuery(query, page) {
  try {
  const res = await axios.get(BASE_URL, { params:   
    {key: API_KEY ,
    q: query,
    page: page,
    per_page: 15,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,} 
  });
  return res.data;
}
  catch(error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again!',
      position: 'bottomRight',
    });
    return null;
  }
}