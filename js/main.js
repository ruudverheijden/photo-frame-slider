const photos = [
    "https://picsum.photos/id/1/800/450",
    "https://picsum.photos/id/234/800/450",
    "https://picsum.photos/id/456/800/450",
    "https://picsum.photos/id/789/800/450",
    "https://picsum.photos/id/235/800/450",
    "https://picsum.photos/id/236/800/450",
    "https://picsum.photos/id/237/800/450"
];

// Spread photos vertically with a bit randomness (= spread evenly with +-5vh)
// for (let i = 0; i < photos.length; i++) {
//     photos[i].style.top = randomizeNumber(100 / photos.length * i, 10) + "vh";
// }


const interval = setInterval(() => {
    if (photos.length > 0) {
        const newPhotoElement = createPhotoElement(photos.shift());
        setPhotoVerticalPosition(newPhotoElement);
        animatePhoto(newPhotoElement);
    }
}, 2000);

// Create a new photo element
function createPhotoElement (src) {
    const newElement = document.createElement('img');
    newElement.src = src;
    newElement.className = "photo";
    document.getElementById('container').appendChild(newElement);
    return newElement;
}

// Create animation for photo
function animatePhoto (photo) {
    anime({
        targets: photo,
        translateX: '100vw',
        easing: 'easeInOutSine',
        duration: randomizeNumber(10000, 2000),
        delay: randomizeNumber(1000, 1000)
    });
}

// Randomise photo vertically
function setPhotoVerticalPosition (photo) {
    photo.style.top = randomizeNumber(40, 50) + "vh";
}

// Randomize an number with a maximum deviation that is either subtracted or added
function randomizeNumber(number, maxDeviation) {
    return Math.floor ( number + ( ( Math.random() - 0.5 ) * 2 * maxDeviation ) );
}