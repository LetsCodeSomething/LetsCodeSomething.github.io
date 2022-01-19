import "core-js/stable";
import "regenerator-runtime/runtime";

let galleryImgArr = [];
let galleryImgCount = 7;

let imagesJsonUrl;
let imageData;

window.onload =
    function mainFunc() {
        for(let i = 0; i < galleryImgCount; i++) {
            galleryImgArr[i] = document.getElementById("gallery_img" + (i + 1));
        }

        imagesJsonUrl = "images/static/gallery_images.json";

        loadImagesAsync();
    }

async function loadImagesAsync() {
    await new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.responseType = "json";
        request.open("GET", imagesJsonUrl, true);

        request.onload = function() {
            if (request.status !== 200) {
                console.log("ERROR: CANNOT DOWNLOAD IMAGES");
                reject();
            }
            else {
                imageData = request.response;
                for(let i = 0; i < galleryImgCount; i++) {
                    galleryImgArr[i].setAttribute("src", imageData.data[i]);
                }
            }
        };
        request.send();
    });
}