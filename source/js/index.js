import "core-js/stable";
import "regenerator-runtime/runtime";

let mainImg1;
let mainImg2;
let mainImg3;

let imagesJsonUrl;
let imageData;

window.onload =
function mainFunc() {
    mainImg1 = document.getElementById("main_img1");
    mainImg2 = document.getElementById("main_img2");
    mainImg3 = document.getElementById("main_img3");
    imagesJsonUrl = "images/static/main_images.json";

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
                mainImg1.setAttribute("src", imageData.data[0]);
                mainImg2.setAttribute("src", imageData.data[1]);
                mainImg3.setAttribute("src", imageData.data[2]);
                //console.log(imageData.data[0]);
            }
        };
        request.send();
    });
}