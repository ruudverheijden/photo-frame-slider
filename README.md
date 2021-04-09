# Photo Frame Slider

**Endless slideshow of your personal photos** meant for display on a digital photo frame, like an old tablet.

![Screenshot](./docs/screenshot.png)

## How to use

```javascript
// Create a clean build:
npm run build

// Run in development mode:
npm start
```

## How to run with Docker

```javascript
// Build Docker image
npm run build-docker

// Run Docker image
docker run --name photoFrameSlider -d -p 8001:80 -v /myPhotoDir:/usr/share/nginx/html/photos:ro photo-frame-slider
```

## TODO

- Create backend to:
  - Resize photos
  - Serve static files
  - Serve config file from fixed location

