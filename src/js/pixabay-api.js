export function fetchImages(query, apiKey) {
  return fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  });
}
