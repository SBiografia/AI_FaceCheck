

//		https://teachablemachine.withgoogle.com/models/ZxZo-oU1_/
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/m2qEzLdSR/";

const resultMessage = document.querySelector('.result_message'),
    resultImage =  document.querySelector('.result_image'),
    spinnerContainer =  document.querySelector('.spinnerContainer'),
    shareContainer01 =  document.querySelector('.shareContainer01');
const imageUploadWrap =  document.querySelector('.image-upload-wrap'),
    fileUploadImage =  document.querySelector('.file-upload-image'),
    fileUploadContent =  document.querySelector('.file-upload-content');
    fileUploadInput =  document.getElementById('.file-upload-input');
const removeBtn = document.querySelector('.remove-image');
let model, webcam, labelContainer, maxPredictions;



// Load the image model and setup the webcam
async function TMinit() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // append elements to the DOM
    labelContainer = document.getElementById('label-container');

    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }
}


async function predict() {
    var imgSource = document.getElementById('face_image');
    const prediction = await model.predict(imgSource, false);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    console.log(prediction[0].className);
    let tempMessage, tempImg;

    switch (prediction[0].className) {
        case 'DOG':
            tempImg = 'img/DOG.jpg';
            break;
        case 'BEAR':
            tempImg = 'img/BEAR.jpg';
            break;
        case 'CAT':
            tempImg = 'img/CAT.jpg';
            break;
        case 'DINOSAUR':
            tempImg = 'img/DINOSAUR.jpg';
            break;
        case 'RABBIT':
            tempImg = 'img/RABBIT.jpg';
            break;
        default:
            tempMessage = '알수없음';
            tempImg = '';
            break;
    }
    resultMessage.innerHTML = prediction[0].className
    resultImage.src = tempImg;
    // resultImage.show();
    // spinnerContainer.hide();
    // shareContainer01.show();
    spinnerContainer.classList.add("hidden");
    resultImage.classList.remove("hidden");
    shareContainer01.classList.remove("hidden");


    //$('.result_image').show();
    // console.log('spinner hide');
    // $('.spinnerContainer').hide();
    // // <!-- $('.shareContainer').show(); -->
    // $('.shareContainer01').show();

    let etcName = "그 외 : ";
    let cntClass = 0;
    for (let i = 0; i < maxPredictions; i++) {
        // const classPrediction =
        // 	prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
        // labelContainer.childNodes[i].innerHTML = classPrediction;
        percentOfResult = Math.floor(Number(prediction[i].probability.toFixed(2)) * 100 * 10) / 10;

        if (percentOfResult > 10) {
            cntClass = cntClass + 1;
            labelContainer.childNodes[i].classList.add('d-flex');
            labelContainer.childNodes[i].classList.add('align-items-center');
            labelContainer.childNodes[i].classList.add('justify-content-end');
            labelContainer.childNodes[i].appendChild(document.createElement('div')); // 이름 
            labelContainer.childNodes[i].appendChild(document.createElement('div')); // 띄워쓰기
            labelContainer.childNodes[i].appendChild(document.createElement('div')); // 퍼센트

            labelContainer.childNodes[i].childNodes[2].classList.add('progress');
            labelContainer.childNodes[i].childNodes[2].appendChild(document.createElement('div'));
            labelContainer.childNodes[i].childNodes[2].childNodes[0].classList.add('progress-bar');
            labelContainer.childNodes[i].childNodes[2].childNodes[0].role = 'progressbar';
            labelContainer.childNodes[i].childNodes[2].childNodes[0].setAttribute('aria-valuemin', '0');
            labelContainer.childNodes[i].childNodes[2].childNodes[0].setAttribute('aria-valuemax', '100');


            labelContainer.childNodes[i].childNodes[0].innerHTML = prediction[i].className;
            labelContainer.childNodes[i].childNodes[1].innerHTML = '&nbsp:&nbsp';
            labelContainer.childNodes[i].childNodes[2].childNodes[0].style.width = `${percentOfResult}%`;
            labelContainer.childNodes[i].childNodes[2].childNodes[0].setAttribute('aria-valuenow', percentOfResult);
            labelContainer.childNodes[i].childNodes[2].childNodes[0].innerHTML = String(percentOfResult) + '%';
        }
        else if (percentOfResult > 0) {
            etcName = etcName + `${prediction[i].className}(${percentOfResult}%), `;
        }
    }

    console.log(etcName)
    etcName = etcName.substr(0, etcName.length - 2);
    console.log(`after slice ${etcName}`)
    labelContainer.childNodes[cntClass].innerHTML = etcName
}
function readURL(input) {
    if (input.files && input.files[0]) {
        // spinnerContainer.show();
        // shareContainer01.hide();
        // resultImage.hide();

        spinnerContainer.classList.remove("hidden");
        shareContainer01.classList.add("hidden");
        resultImage.classList.add("hidden");


        // console.log('spinner show');
        // $('.spinnerContainer').show();
        // // <!-- $('.shareContainer').hide(); -->
        // $('.shareContainer01').hide();
        // $('.result_image').hide();
        var reader = new FileReader();

        reader.onload = function (e) {

            // imageUploadWrap.hide();
            fileUploadImage.src = e.target.result;
            // fileUploadContent.show();

            fileUploadContent.classList.remove("hidden");
            imageUploadWrap.classList.add("hidden");
        

            // $('.image-upload-wrap').hide();
            // $('.file-upload-image').attr('src', e.target.result);
            // $('.file-upload-content').show();
        };

        reader.readAsDataURL(input.files[0]);
        TMinit().then(() => {
            console.log('Start predict');
            predict();
        });
        //predict();
    } else {
        removeUpload();
    }
}

// $("#imagefiles").replaceWith("<input type='file' name='imagefiles' id='imagefiles' />");
// var image = document.getElementById('imagefiles'), parent = image.parentNode,
// tempDiv = document.createElement('div');

// tempDiv.innerHTML = "<input type='file' name='imagefiles' id='imagefiles' />"

// var input = tempDiv.childNodes[0];

// parent.replaceChild(input, image);


function removeUpload() {
    // $('#file-upload-input').replaceWith($('#file-upload-input').clone());
    // tempDiv = document.createElement('div');
    // tempDiv.innerHTML = "<input id='file-upload-input' type='file' onchange='readURL(this);' accept='image/*' />"
    // let input = tempDiv.childNodes[0]
    // console.dir(fileUploadInput)
    // console.log(input)
    // fileUploadInput.parentNode.replaceChild(input, fileUploadInput)
    
    // fileUploadContent.hide();
    // imageUploadWrap.show();
    fileUploadContent.classList.add("hidden");
    imageUploadWrap.classList.remove("hidden");
    resultMessage.innerHTML = '';



    
    // $('.file-upload-content').hide();
    // $('.image-upload-wrap').show();
    // $('.result_message').html('');
    if (labelContainer.childNodes.length !== 0) {
        while (labelContainer.childNodes[0]) {
            labelContainer.removeChild(labelContainer.lastChild);
        }
    }
}

function init(){
    imageUploadWrap.addEventListener('dragover', function () {
        imageUploadWrap.classList.add('image-dropping');
    });
    imageUploadWrap.addEventListener('dragleave', function () {
        imageUploadWrap.classList.remove('image-dropping');
    });
    removeBtn.addEventListener('click',removeUpload);

}
init()