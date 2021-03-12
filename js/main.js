let photos = [...document.querySelectorAll('.photo')]; // Convert Nodelist to Array

// Spread photos vertically with a bit randomness (= spread evenly with +-5vh)
for (let i = 0; i < photos.length; i++) {
    photos[i].style.top = getRandomizedNumber(100 / photos.length * i, 10) + "vh";
}

// Add all photos
while (photos.length > 0) {
    addPhotoToTimeline(photos.shift());
}

// Add a new photo to the animation timeline
function addPhotoToTimeline (photo) {
    anime({
        targets: photo,
        translateX: '100vw',
        easing: 'easeInOutSine',
        duration: 10000 + ( ( Math.random() - 0.5 ) * 2000 ),
        delay: getRandomizedNumber(1000, 1000)
    });
}

// Randomize an number with a maximum deviation
function getRandomizedNumber(number, maxDeviation) {
    return Math.floor ( number + ( ( Math.random() - 0.5 ) * maxDeviation ) );
}