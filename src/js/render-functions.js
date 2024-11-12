export function renderGallery(images) {
  return images
    .map(
      image => `
    <a href="${image.largeImageURL}" class="gallery-item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      <div class="info">
        <p> ${image.likes} </br> Likes</p>
        <p> ${image.views} </br> Views</p>
        <p> ${image.comments} </br> Comments</p>
        <p> ${image.downloads} </br> Downloads</p>
      </div>
    </a>
  `
    )
    .join('');
}
