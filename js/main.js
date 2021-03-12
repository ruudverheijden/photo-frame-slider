let photos = document.querySelectorAll('.photo');

// Spread photos vertically with a bit randomness (= spread evenly with +-5vh)
for (let i = 0; i < photos.length; i++) {
    photos[i].style.top = Math.floor( ( 100 / photos.length * i ) + ( ( Math.random() - 0.5 ) * 10 ) ) + "vh";
}

// Create timeline
var tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 30000
  });
  
  tl
  .add({
    targets: photos[0],
    translateX: '100vw',
  })
  .add({
    targets: photos[1],
    translateX: '100vw',
  }, 1000) // relative offset
  .add({
    targets: photos[2],
    translateX: '100vw',
  }, 4000); // absolute offset