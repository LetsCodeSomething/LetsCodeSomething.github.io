import "core-js/stable";
import "regenerator-runtime/runtime";

let controlsWrapper1Name,
    dxName, dxField,
    dyName, dyField,
    sizeXName, sizeXField,
    sizeYName, sizeYField,
    bailoutName, bailoutField,
    nName, nField,
    controlsWrapper2Name,
    widthName, widthField,
    heightName, heightField,
    paletteName, paletteList,
    innerColorName, innerColorPicker,
    outerColorName, outerColorPicker,
    canvas,
    canvasContext,
    returnButton,
    downloadA,
    downloadButton,
    generateButton,
    translateButton;

let width, height,
    dx, dy,
    sizeX, sizeY,
    bailout,
    n,
    selectedPalette,
    innerColor, outerColor;

let ufGradPalette = [];
let ufGradPaletteSize;

let selectedLanguage;

window.onload =
    function mainFunc() {
        controlsWrapper1Name = document.getElementById("controlsWrapper1Name");
        dxName = document.getElementById("dxName");
        dyName = document.getElementById("dyName");
        sizeXName = document.getElementById("sizeXName");
        sizeYName = document.getElementById("sizeYName");
        bailoutName = document.getElementById("bailoutName");
        nName = document.getElementById("nName");
        controlsWrapper2Name = document.getElementById("controlsWrapper2Name");
        widthName = document.getElementById("widthName");
        heightName = document.getElementById("heightName");
        paletteName = document.getElementById("paletteName");
        innerColorName = document.getElementById("innerColorName");
        outerColorName = document.getElementById("outerColorName");

        dxField = document.getElementById("dx");
        dyField = document.getElementById("dy");
        sizeXField = document.getElementById("sizeX");
        sizeYField = document.getElementById("sizeY");
        bailoutField = document.getElementById("bailout");
        nField = document.getElementById("n");
        widthField = document.getElementById("width");
        heightField = document.getElementById("height");
        paletteList = document.getElementById("palette");
        innerColorPicker = document.getElementById("innerColor");
        outerColorPicker = document.getElementById("outerColor");
        canvas = document.getElementById("fracCanvas");

        returnButton = document.getElementById("returnButton");
        returnButton.addEventListener("click", returnToMainPage);

        downloadButton = document.getElementById("downloadButton");
        downloadA = document.getElementById("downloadA");
        downloadA.download = "fractal.png";
        downloadA.href = canvas.toDataURL();

        generateButton = document.getElementById("generateButton");
        generateButton.addEventListener("click", generateFractal);

        translateButton = document.getElementById("translateButton");
        translateButton.addEventListener("click", translatePage);

        ufGradPalette[0]={r:0, g:7, b:100};
        ufGradPalette[1]=({r:8, g:32, b:125});
        ufGradPalette[2]=({r:16, g:57, b:150});
        ufGradPalette[3]=({r:24, g:82, b:175});
        ufGradPalette[4]=({r:32, g:107, b:203});
        ufGradPalette[5]=({r:83, g:144, b:216});
        ufGradPalette[6]=({r:134, g:181, b:229});
        ufGradPalette[7]=({r:185, g:218, b:242});
        ufGradPalette[8]=({r:237, g:255, b:255});
        ufGradPalette[9]=({r:241, g:233, b:189});
        ufGradPalette[10]=({r:245, g:212, b:126});
        ufGradPalette[11]=({r:249, g:191, b:63});
        ufGradPalette[12]=({r:255, g:170, b:0});
        ufGradPalette[13]=({r:189, g:128, b:0});
        ufGradPalette[14]=({r:126, g:86, b:0});
        ufGradPalette[15]=({r:63, g:44, b:0});
        ufGradPalette[16]=({r:0, g:2, b:0});
        ufGradPalette[17]=({r:0, g:3, b:25});
        ufGradPalette[18]=({r:0, g:4, b:50});
        ufGradPalette[19]=({r:0, g:5, b:75});
        ufGradPaletteSize = 20;

        selectedLanguage = "ru";
    }

//Возврат на главную страницу.
function returnToMainPage() {
    location.href = "index.html";
}

//Помечать эту функцию словом async бесполезно, так как вычисления из этой функции
//всё равно будут выполнены синхронно. JavaScript выполняет всё в одном потоке, и ЦП
//не может освободиться во время выполнения вычисления изображения.
function generateFractal() {
    if(dxField.value.length > 0 && dyField.value.length > 0 && sizeXField.value.length > 0 &&
        sizeYField.value.length > 0 && bailoutField.value.length > 0 && nField.value.length > 0 &&
        (nField.value.length === parseInt(nField.value).toString().length) &&
        widthField.value.length > 0 &&
        (widthField.value.length === parseInt(widthField.value).toString().length) &&
        heightField.value.length > 0 &&
        (heightField.value.length === parseInt(heightField.value).toString().length)) {

        dx = parseFloat(dxField.value);
        dy = parseFloat(dyField.value);
        sizeX = parseFloat(sizeXField.value);
        sizeY = parseFloat(sizeYField.value);
        bailout = parseFloat(bailoutField.value);
        n = parseInt(nField.value);
        width = parseInt(widthField.value);
        height = parseInt(heightField.value);
        selectedPalette = paletteList.selectedIndex;
        innerColor = innerColorPicker.value;
        outerColor = outerColorPicker.value;

        if((n >= 1 && n <= 1000) && (width >= 1 && width <= 1000) && (height >= 1 && height <= 1000)) {
            canvas.width = width;
            canvas.height = height;
            canvasContext = canvas.getContext("2d");

            //Двухцветная палитра
            if(selectedPalette === 0) {
                for(let i = 0; i < width; i++) {
                    for(let j = 0; j < height; j++) {
                        let cx = (i - width / 2) * sizeX + dx;
                        let cy = (j - height / 2) * sizeY - dy;
                        let tempx1 = 0;
                        let tempy1 = 0;
                        let tempx2 = 0;
                        let tempy2 = 0;
                        let iter;

                        for(iter = 0; iter < n; iter++)
                        {
                            tempx2 = (tempx1 * tempx1) - (tempy1 * tempy1) + cx;
                            tempy2 = (tempx1 * tempy1 * 2) + cy;

                            if (tempx2 * tempx2 + tempy2 * tempy2 > bailout * bailout)
                            {
                                break;
                            }

                            tempx1 = tempx2;
                            tempy1 = tempy2;
                        }
                        if(iter === n)
                        {
                            canvasContext.fillStyle = innerColor;
                            canvasContext.fillRect(i, j, 1, 1);
                        }
                        else
                        {
                            canvasContext.fillStyle = outerColor;
                            canvasContext.fillRect(i, j, 1, 1);
                        }
                    }
                }
                downloadA.href = canvas.toDataURL();
            }
            //Градиентная палитра
            else {
                for(let i = 0; i < width; i++) {
                    for(let j = 0; j < height; j++) {
                        let cx = (i - width / 2) * sizeX + dx;
                        let cy = (j - height / 2) * sizeY - dy;
                        let tempx1 = 0;
                        let tempy1 = 0;
                        let tempx2 = 0;
                        let tempy2 = 0;
                        let iter;

                        for(iter = 0; iter < n; iter++) {
                            tempx2 = (tempx1 * tempx1) - (tempy1 * tempy1) + cx;
                            tempy2 = (tempx1 * tempy1 * 2) + cy;

                            if (tempx2 * tempx2 + tempy2 * tempy2 > bailout * bailout) {
                                break;
                            }

                            tempx1 = tempx2;
                            tempy1 = tempy2;
                        }

                        if(iter === n) {
                            canvasContext.fillStyle = innerColor;
                            canvasContext.fillRect(i, j, 1, 1);
                        }
                        else {
                            let tempN = iter;

                            if(tempN > (ufGradPaletteSize - 1)) {
                                tempN -= Math.trunc(tempN / ufGradPaletteSize) * ufGradPaletteSize;
                            }

                            let smooth = Math.log2((Math.log(tempx2 * tempx2 + tempy2 * tempy2) / 2) / Math.log(bailout)) * 100;
                            smooth = smooth > 100 ? 100 : smooth;

                            if (tempN === (ufGradPaletteSize - 1)) {
                                canvasContext.fillStyle = "rgba(" +
                                    (ufGradPalette[0].r + smooth * (ufGradPalette[tempN].r - ufGradPalette[0].r) / 100) + "," +
                                    (ufGradPalette[0].g + smooth * (ufGradPalette[tempN].g - ufGradPalette[0].g) / 100) + "," +
                                    (ufGradPalette[0].b + smooth * (ufGradPalette[tempN].b - ufGradPalette[0].b) / 100) + ",255)";

                                canvasContext.fillRect(i, j, 1, 1);
                            }
                            else {
                                canvasContext.fillStyle = "rgba(" +
                                    (ufGradPalette[tempN + 1].r + smooth * (ufGradPalette[tempN].r - ufGradPalette[tempN + 1].r) / 100) + "," +
                                    (ufGradPalette[tempN + 1].g + smooth * (ufGradPalette[tempN].g - ufGradPalette[tempN + 1].g) / 100) + "," +
                                    (ufGradPalette[tempN + 1].b + smooth * (ufGradPalette[tempN].b - ufGradPalette[tempN + 1].b) / 100) + ",255)";

                                canvasContext.fillRect(i, j, 1, 1);
                            }
                        }
                    }
                }
                downloadA.href = canvas.toDataURL();
            }
        }
        else {
            if(selectedLanguage === "ru") {
                alert("Неправильные параметры. Справка:\n" +
                    "Параметры \"Макс. число итераций\", \"Ширина\", \"Высота\" должны быть в диапазоне [1;1000]\n");
            }
            else {
                alert("Incorrect parameters. Reference:\n" +
                    "The parameters \"Max. number of iterations\", \"Width\", \"Height\" must be in the range [1;1000]\n");
            }
        }
    }
    else {
        if(selectedLanguage === "ru") {
            alert("Неправильные параметры. Справка:\nПоля \"Центр\", \"Масштаб\", \"Предел удаления\" должны содержать " +
                "дробные числа.\nПоля \"Макс. число итераций\", \"Ширина\", \"Высота\" должны содержать целые числа.");
        }
        else {
            alert("Incorrect parameters. Reference:\nFields \"Center\", \"Scale\", \"Bailout\" must contain " +
                "fractional numbers.\nFields \"Max. number of iterations\", \"Width\", \"Height\" " +
                "must contain integer numbers.");
        }
    }
}

//Эта функция переключает язык редактора.
//Для остальных страниц язык не переводится.
function translatePage() {
    if(selectedLanguage === "ru") {
        selectedLanguage = "en";

        controlsWrapper1Name.innerText = "Formula parameters";
        dxName.innerText = "Center (Re):";
        dyName.innerText = "Center (Im):";
        sizeXName.innerText = "Scale (Re):";
        sizeYName.innerText = "Scale (Im):";
        bailoutName.innerText = "Bailout:";
        nName.innerText = "Max. number of iterations:";
        controlsWrapper2Name.innerText = "Image parameters";
        widthName.innerText = "Width:";
        heightName.innerText = "Height:";
        paletteName.innerText = "Palette:"
        paletteList.options[0].innerText = "Two-tone";
        paletteList.options[1].innerText = "Gradient (speed of escape)";
        innerColorName.innerText = "Inner color:";
        outerColorName.innerText = "Outer color:";
        returnButton.innerText = "Return to main page";
        downloadButton.innerText = "Save image";
        generateButton.innerText = "Generate image";
        translateButton.innerText = "Перевести на русский";
    }
    else {
        selectedLanguage = "ru";

        controlsWrapper1Name.innerText = "Параметры формулы";
        dxName.innerText = "Центр (Re):";
        dyName.innerText = "Центр (Im):";
        sizeXName.innerText = "Масштаб (Re):";
        sizeYName.innerText = "Масштаб (Im):";
        bailoutName.innerText = "Предел удаления:";
        nName.innerText = "Макс. число итераций:";
        controlsWrapper2Name.innerText = "Параметры изображения";
        widthName.innerText = "Ширина:";
        heightName.innerText = "Высота:";
        paletteName.innerText = "Палитра:"
        paletteList.options[0].innerText = "Двухцветная";
        paletteList.options[1].innerText = "Градиентная (скорость удаления)";
        innerColorName.innerText = "Внутренний цвет:";
        outerColorName.innerText = "Внешний цвет:";
        returnButton.innerText = "Вернуться на главную";
        downloadButton.innerText = "Сохранить изображение";
        generateButton.innerText = "Сгенерировать изображение";
        translateButton.innerText = "Translate to English";
    }
}