// Intersection observer on a div
const scroller = document.querySelector('#scroller');
const sentinel = document.querySelector('#sentinel');
const cc = document.querySelector('#counter')
let counter = 1;

function loadItems(n) {
  for (let i = 0; i < n; i++) {
    let newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.textContent = 'Item ' + counter++;
    scroller.appendChild(newItem);
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  // If intersectionRatio is 0, the sentinel is out of view
  // and we do not need to do anything.
  if (entries[0].intersectionRatio <= 0) {
    return;
  }
  loadItems(10);
  // appendChild will move the existing element
  scroller.appendChild(sentinel);
  loadItems(5);
  cc.innerHTML = `Already Load ${counter}`
});
// Observe element
intersectionObserver.observe(sentinel);

// Intersection observer to load images if it almost show up
// code are same as above
// http://placehold.jp/300x150.png
const imgContainer = document.querySelector('#image_container')
const space = document.querySelector('#no-image')

function loadImage(n) {
  for (let i = 0; i < n; i++) {
    let img = document.createElement('img')
    img.src = 'http://placehold.jp/300x150.png'
    imgContainer.appendChild(img)
  }
}

const imageObserver = new IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) {
    return;
  }
  loadItems(10);
  // appendChild will move the existing element
  scroller.appendChild(sentinel);
  loadItems(5);
  cc.innerHTML = `Already Load ${counter}`
})