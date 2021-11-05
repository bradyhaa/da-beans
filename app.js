fitText(document.querySelector('container1'), 0.38);

let API_URL = "https://www.reddit.com/search.json?limit=15&q=";
const INTERVAL_DELAY = 5000;
let currentImages = [];
let currentIndex = 0;
let interval;

// Force JavaScript to wait to run its code until all the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
  // Hook up a submit event listener to submit button
  document.getElementById("search-form")
    searchForm.addEventListener("submit", fetchFromReddit);

  // Hook up a click event listener to the STOP button
  document.getElementById("stop").addEventListener("click", stopSlides);
});

function fetchFromReddit(e) {
  e.preventDefault();

  const query = document.getElementById("query").value;

  // Make sure query is not empty string
  if (query) {
    // Call Reddit API with fetch
    // toggles a custom class with classList API for
    updateContainerDisplay();
    fetch(API_URL + query)
      .then(function (response) {
        if (response.status === 200) {
          console.log('success response');
          return response.json();
        } else {
          console.log('unsucessful response');
        }
      })
      .then(function (data) {
        // Get the posts array
        const results = data.data.children;

        // Take the values we want from the enormous JSON object
        currentImages = results
          .map(function (post) {
            // Downsize the object
            return {
              subreddit: post.data.subreddit,
              title: post.data.title,
              url: post.data.url.replace(".gifv", ".gif"),
            };
          })
          .filter(function (item) {
            // Filter for image posts (remove text posts)
            return item.url.includes("i.imgur") || item.url.includes("i.redd");
          });
        console.log("current Images are", currentImages);

        // Reset the currentIndex to the first one
        currentIndex = 0;

        // Load first image into DOM
        loadImage();

        // Clear old timer before setting a new one
        clearInterval(interval);

        // Kick off an interval to swap the pics
        interval = setInterval(changeSlide, INTERVAL_DELAY);
      })
      .catch(function (err) {
        console.log("Error", err);
      });
  } else {
    console.log("Nothing to search???");
  }
}

function loadImage() {
  // Empty the existing slides from slideshow div (if any)
  let slideshow = document.querySelector("#slideshow");
  slideshow.innerHTML = "";

  // Create a new image slide
  let newImg = document.createElement("img");
  newImg.src = currentImages[currentIndex].url;
  // Append newImg into slideshow div
  slideshow.append(newImg);
}

function changeSlide() {
  // Increment the image index
  currentIndex++;

  // Check and make sure the index is valid - set back to 0 if too big
  if (currentIndex >= currentImages.length) {
    currentIndex = 0;
  }

  // Load the next image
  loadImage();
}

function stopSlides() {
  updateContainerDisplay();
  document.getElementById("search-form").reset();
  document.getElementById("slideshow").innerHTML = "";
  // Clear the interval to stop it
  clearInterval(interval);
}

function updateContainerDisplay() {
  document.getElementById("search-form").classList.toggle("hidden");
  document.querySelector("#results-container").classList.toggle("hidden");
}