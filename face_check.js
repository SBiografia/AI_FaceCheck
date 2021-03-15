
// https://teachablemachine.withgoogle.com/models/ZxZo-oU1_/
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image



// the link to your model provided by Teachable Machine export panel
//COLOR version
// const URL = "https://teachablemachine.withgoogle.com/models/m2qEzLdSR/";

// BTS
const URL = "https://teachablemachine.withgoogle.com/models/GA80Zcpil/"

//GRAYSCALE version
//const URL = "https://teachablemachine.withgoogle.com/models/omHcioYXc/";

const imageUpload = document.getElementById('file-upload-input')
const labelContainer = document.getElementById('label-container')
const resultTitle = document.querySelector('.result_title'),
    resultMessage = document.querySelector('.result_message'),
    resultImage = document.querySelector('.result_image'),
    spinnerContainer = document.querySelector('.spinnerContainer'),
    shareContainer01 = document.querySelector('.shareContainer01');
const imageUploadWrap = document.querySelector('.image-upload-wrap'),
    fileUploadImage = document.querySelector('.file-upload-image'),
    fileUploadContent = document.querySelector('.file-upload-content');
const removeBtn = document.querySelector('.remove-image');
const loadingPercent = spinnerContainer.querySelector('strong');
const selectYear = document.querySelector('.selectYear');

const     processImgOrigin = document.querySelectorAll('.processImgOrigin'),
        processImgResult = document.querySelectorAll('.processImgResult');


let model, maxPredictions;
const MODEL_URL = 'models/'
/*****************
 * 1. startFaceDetect 로 input에 입력받은 사진에서 얼굴만 추출해서 따로 이미지 파일을 만들어 줌.
 * 2. 이미지 파일이 만들어지면 
 *
 *******************/

let ttImg = document.getElementById('resizeFace');

Promise.all([
    // faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
]).then(startFaceDetect)

async function faceDetect(){
    let image;
        let cropCanvas = document.createElement('canvas');
        console.log("start image upload")
        if (imageUpload.files && imageUpload.files[0]) {

            spinnerContainer.classList.remove("hidden");
            shareContainer01.classList.add("hidden");

            processImgOrigin[0].classList.add("hidden");
            processImgResult[0].classList.add("hidden");
            processImgOrigin[1].classList.add("hidden");
            processImgResult[1].classList.add("hidden");
            resultImage.classList.add("hidden");

            
            imageUploadWrap.classList.add("hidden");


            loadingPercent.innerHTML = 'Loading...(1/5)'
            

            image = await faceapi.bufferToImage(imageUpload.files[0])
            const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();//.withFaceDescriptors()
            loadingPercent.innerHTML = 'Loading...(2/5)'
            fileUploadContent.classList.remove("hidden");

            img = new Image();
            img.setAttribute("src", cropCanvas.toDataURL());
            if (detections.length === 1) {
                console.log("1개의 얼굴이 나왔습니다!!")
                

                const box = detections[0].detection.box

                //정사각형으로 만들꺼임!!

                let boxSize = 0;
                let boxSizeOrigin = 0; //0은 width , 1은 height
                let gap = 0;
                if (box.width > box.height) {
                    boxSize = Math.ceil(box.width);
                    boxSizeOrigin = 0;
                    gap = Math.ceil(box.width - box.height)
                }
                else {
                    boxSize = Math.ceil(box.height);
                    boxSizeOrigin = 1;
                    gap = Math.ceil(box.height - box.width)
                }

                // //1. image : 이미지/캔버스의 요소등을 생성한 (이미지)객체.
                // const sx = Math.ceil(box.x), //2. sx : (그려지는 좌표아님!) 크롭할 영역의 시작 x좌표.
                //     sy = Math.ceil(box.y),  //3. sy : (그려지는 좌표아님!) 크롭할 영역의 시작 y좌표.
                //     sWidth = Math.ceil(box.width),  // 4. sWidth : (그려지는 좌표아님!) 크롭할 영역의 넓이.
                //     sHeight = Math.ceil(box.height),    // 5. sHeight : (그려지는 좌표아님!) 크롭할 영역의 높이.
                //     dx = 0,// 6. dx : 크롭된 이미지가 그려질 영역의 x좌표. 
                //     dy = 0,// 7. dy : 크롭된 이미지가 그려질 영역의 y좌표.
                //     dWidth = Math.ceil(box.width),  // 8. dWidth : 크롭된 이미지의 넓이(확대/축소가 가능합니다). 위의 sWidth와 같으면 1:1 비율.
                //     dHeight = Math.ceil(box.height);    // 9. dHeight : 크롭된 이미지의 높이(확대/축소가 가능합니다). 위의 sHidth와 같으면 1:1 비율.


                const sx = boxSizeOrigin === 0 ? Math.ceil(box.x) : Math.ceil(box.x) - gap / 2,
                    sy = boxSizeOrigin === 0 ? Math.ceil(box.y) - gap / 2 : Math.ceil(box.y),
                    sWidth = boxSize,
                    sHeight = boxSize,
                    dx = 0,
                    dy = 0,
                    dWidth = boxSize,
                    dHeight = boxSize;

                cropCanvas.width = sWidth;
                cropCanvas.height = sHeight;



                var ctx = cropCanvas.getContext("2d");

                img.onload = async function () {

                    await ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                    fileUploadImage.src = cropCanvas.toDataURL("image/jpeg");
                    /***********얘네를 어디다가 놔둬야 할까....********* */
                    TMinit().then(() => {
                        predict();
                    });
                    /***********얘네를 어디다가 놔둬야 할까....********* */
                }
            }
            else if (detections.length === 0) {
                console.log("얼굴이 없습니다ㅜㅜ")
                resultTitle.classList.remove('hidden')
                resultTitle.innerHTML='사진에서 얼굴을 찾을 수 없습니다ㅜㅜ'
            }
            else if (detections.length > 1) {
                console.log("얼굴이 너무 많아엽!! 한명만 찍어주세요!")
                resultTitle.classList.remove('hidden')
                resultTitle.innerHTML='사진에 얼굴이 너무 많습니다.<br>한 명의 얼굴만 등록해주세요!'
            }
        }
        else {
            removeUpload();
        }
}

async function startFaceDetect() {
    
    
    // document.body.append('ready to face')
    document.querySelector('.uploadMessage').innerHTML = "드래그 & 드롭으로 파일을 옮기거나<br>클릭해서 이미지를 선택해주세요!";

    imageUpload.addEventListener('change',faceDetect);

    // imageUpload.addEventListener('change', async () => {
    //     let image;
    //     let cropCanvas = document.createElement('canvas');
    //     console.log("start image upload")
    //     if (imageUpload.files && imageUpload.files[0]) {

    //         spinnerContainer.classList.remove("hidden");
    //         shareContainer01.classList.add("hidden");

    //         processImgOrigin[0].classList.add("hidden");
    //         processImgResult[0].classList.add("hidden");
    //         processImgOrigin[1].classList.add("hidden");
    //         processImgResult[1].classList.add("hidden");
    //         resultImage.classList.add("hidden");

    //         fileUploadContent.classList.remove("hidden");
    //         imageUploadWrap.classList.add("hidden");


    //         loadingPercent.innerHTML = 'Loading...(1/5)'
            

    //         image = await faceapi.bufferToImage(imageUpload.files[0])
    //         const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();//.withFaceDescriptors()
    //         loadingPercent.innerHTML = 'Loading...(2/5)'

    //         img = new Image();
    //         img.setAttribute("src", cropCanvas.toDataURL());
    //         if (detections.length === 1) {
    //             console.log("1개의 얼굴이 나왔습니다!!")
                

    //             const box = detections[0].detection.box

    //             //정사각형으로 만들꺼임!!

    //             let boxSize = 0;
    //             let boxSizeOrigin = 0; //0은 width , 1은 height
    //             let gap = 0;
    //             if (box.width > box.height) {
    //                 boxSize = Math.ceil(box.width);
    //                 boxSizeOrigin = 0;
    //                 gap = Math.ceil(box.width - box.height)
    //             }
    //             else {
    //                 boxSize = Math.ceil(box.height);
    //                 boxSizeOrigin = 1;
    //                 gap = Math.ceil(box.height - box.width)
    //             }

    //             // //1. image : 이미지/캔버스의 요소등을 생성한 (이미지)객체.
    //             // const sx = Math.ceil(box.x), //2. sx : (그려지는 좌표아님!) 크롭할 영역의 시작 x좌표.
    //             //     sy = Math.ceil(box.y),  //3. sy : (그려지는 좌표아님!) 크롭할 영역의 시작 y좌표.
    //             //     sWidth = Math.ceil(box.width),  // 4. sWidth : (그려지는 좌표아님!) 크롭할 영역의 넓이.
    //             //     sHeight = Math.ceil(box.height),    // 5. sHeight : (그려지는 좌표아님!) 크롭할 영역의 높이.
    //             //     dx = 0,// 6. dx : 크롭된 이미지가 그려질 영역의 x좌표. 
    //             //     dy = 0,// 7. dy : 크롭된 이미지가 그려질 영역의 y좌표.
    //             //     dWidth = Math.ceil(box.width),  // 8. dWidth : 크롭된 이미지의 넓이(확대/축소가 가능합니다). 위의 sWidth와 같으면 1:1 비율.
    //             //     dHeight = Math.ceil(box.height);    // 9. dHeight : 크롭된 이미지의 높이(확대/축소가 가능합니다). 위의 sHidth와 같으면 1:1 비율.


    //             const sx = boxSizeOrigin === 0 ? Math.ceil(box.x) : Math.ceil(box.x) - gap / 2,
    //                 sy = boxSizeOrigin === 0 ? Math.ceil(box.y) - gap / 2 : Math.ceil(box.y),
    //                 sWidth = boxSize,
    //                 sHeight = boxSize,
    //                 dx = 0,
    //                 dy = 0,
    //                 dWidth = boxSize,
    //                 dHeight = boxSize;

    //             cropCanvas.width = sWidth;
    //             cropCanvas.height = sHeight;



    //             var ctx = cropCanvas.getContext("2d");

    //             img.onload = async function () {

    //                 await ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    //                 fileUploadImage.src = cropCanvas.toDataURL("image/jpeg");
    //                 /***********얘네를 어디다가 놔둬야 할까....********* */
    //                 TMinit().then(() => {
    //                     predict();
    //                 });
    //                 /***********얘네를 어디다가 놔둬야 할까....********* */
    //             }
    //         }
    //         else if (detections.length === 0) {
    //             console.log("얼굴이 없습니다ㅜㅜ")
    //             resultTitle.classList.remove('hidden')
    //             resultTitle.innerHTML='사진에서 얼굴을 찾을 수 없습니다ㅜㅜ'
    //         }
    //         else if (detections.length > 1) {
    //             console.log("얼굴이 너무 많아엽!! 한명만 찍어주세요!")
    //             resultTitle.classList.remove('hidden')
    //             resultTitle.innerHTML='사진에 얼굴이 너무 많습니다.<br>한 명의 얼굴만 등록해주세요!'
    //         }
    //     }
    //     else {
    //         removeUpload();
    //     }
    // })

}
async function TMinit() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    loadingPercent.innerHTML = 'Loading...(3/5)'
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // append elements to the DOM

    loadingPercent.innerHTML = 'Loading...(4/5)'
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }
}



async function predict() {
    loadingPercent.innerHTML = 'Loading...(5/5)'
    // var imgSource = document.getElementById('face_image');
    grayImg = fileUploadImage.cloneNode(true);
    grayImg.classList.add('grayscale')
    // fileUploadContent.appendChild(grayImg);
    // console.log(grayImg);
    // console.dir(grayImg)
    // const prediction = await model.predict(imgSource, false);
    const prediction = await model.predict(grayImg, false);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    console.log("prediction is", prediction[0].className);



    resultTitle.innerHTML = prediction[0].className

    spinnerContainer.classList.add("hidden");
    resultImage.classList.remove("hidden");
    processImgOrigin[0].classList.remove("hidden");
    processImgResult[0].classList.remove("hidden");
    processImgOrigin[1].classList.remove("hidden");
    processImgResult[1].classList.remove("hidden");
    shareContainer01.classList.remove("hidden");

    switch (prediction[0].className) {
        case "RM":
            // resultImage.src = "https://ibighit.com/bts/images/bts/profile/member-rm.jpg";
                        resultImage.src = "img/Face_RM.jpg"   
            break;
        case "뷔":
            // resultImage.src = "https://ibighit.com/bts/images/bts/profile/member-v.jpg";
                        resultImage.src = "img/Face_뷔.jpg"   
            break;
        case "슈가":
            // resultImage.src = "https://ibighit.com/bts/images/bts/profile/member-suga.jpg";
                        resultImage.src = "img/Face_슈가.jpg"   
            break;
        case "정국":
            // resultImage.src = "https://ibighit.com/bts/images/bts/profile/member-jk.jpg";
            resultImage.src = "img/Face_정국.jpg"   
            break;
        case "제이홉":
            // resultImage.src = "https://ibighit.com/bts/images/bts/profile/member-jhope.jpg";
            resultImage.src = "img/Face_제이홉.jpg"   
            break;
        case "지민":
            // resultImage.src = "https://ibighit.com/bts/images/bts/profile/member-jimin.jpg";
            resultImage.src = "img/Face_지민.jpg"     
            break;
        case "진":
            // resultImage.src = "https://ibighit.com/bts/images/bts/profile/member-jin.jpg";
            resultImage.src = "img/Face_진.jpg"   
            resultMessage.innerHTML = "어디를 가든 비주얼을 담당하시는군요!<br>유후~"
            break;
    }

    processImgOrigin[0].src = fileUploadImage.src;
    processImgResult[0].src = resultImage.src;
    processImgOrigin[1].src = fileUploadImage.src;
    processImgResult[1].src = resultImage.src;
    processImgOrigin[0].style.opacity = 1.5;
    processImgResult[0].style.opacity = 0.4;
    processImgOrigin[1].style.opacity = 0.6;
    processImgResult[1].style.opacity = 0.6

    let etcName = "그 외 : ";
    let etcNum = 0;
    let cntClass = 0;
    for (let i = 0; i < maxPredictions; i++) {

        percentOfResult = Math.floor(Number(prediction[i].probability.toFixed(2)) * 100 * 10) / 10;

        if (percentOfResult > 10) {
            cntClass = cntClass + 1;
            labelContainer.childNodes[i].classList.add('d-flex','align-items-center','justify-content-end','label');
            labelContainer.childNodes[i].appendChild(document.createElement('div')); // 이름 
            labelContainer.childNodes[i].appendChild(document.createElement('div')); // 띄워쓰기
            labelContainer.childNodes[i].appendChild(document.createElement('div')); // 퍼센트

            labelContainer.childNodes[i].childNodes[2].classList.add('progress');
            labelContainer.childNodes[i].childNodes[2].appendChild(document.createElement('div'));
            labelContainer.childNodes[i].childNodes[2].childNodes[0].classList.add('progress-bar');
            labelContainer.childNodes[i].childNodes[2].childNodes[0].role = 'progressbar';
            labelContainer.childNodes[i].childNodes[2].childNodes[0].setAttribute('aria-valuemin', '0');
            labelContainer.childNodes[i].childNodes[2].childNodes[0].setAttribute('aria-valuemax', '100');


            labelContainer.childNodes[i].childNodes[0].innerHTML = prediction[i].className;// 이름 
            labelContainer.childNodes[i].childNodes[0].style.width = "10vw"
            labelContainer.childNodes[i].childNodes[1].innerHTML = '&nbsp:&nbsp';
            labelContainer.childNodes[i].childNodes[2].childNodes[0].style.width = `${percentOfResult}%`;
            labelContainer.childNodes[i].childNodes[2].childNodes[0].setAttribute('aria-valuenow', percentOfResult);
            labelContainer.childNodes[i].childNodes[2].childNodes[0].innerHTML = String(percentOfResult) + '%';
        }
        else if (percentOfResult > 0) {
            etcNum = etcNum +1;
            etcName = etcName + `${prediction[i].className}(${percentOfResult}%), `;
        }
    }
    if(etcNum !== 0){
        etcName = etcName.substr(0, etcName.length - 2);
        labelContainer.childNodes[cntClass].classList.add('etcName', 'd-flex')
        labelContainer.childNodes[cntClass].innerHTML = etcName
    }
    

}

function removeUpload() {
    console.log("start remove")

    fileUploadContent.classList.add("hidden");
    imageUploadWrap.classList.remove("hidden");
    resultTitle.innerHTML = '';
    resultMessage.innerHTML ='';
    fileUploadImage.src = "";
    resultImage.src="";
    processImgOrigin[0].src = "";
    processImgResult[0].src = "";
    processImgOrigin[1].src = "";
    processImgResult[1].src = "";

    if (labelContainer.childNodes.length !== 0) {
        while (labelContainer.childNodes[0]) {
            labelContainer.removeChild(labelContainer.lastChild);
        }
    }
}
function changeYear(e) {

    switch (e.target.selectedIndex) {
        case 0:
            console.log(e.target.options[e.target.selectedIndex].text)
            break;
        case 1:
            console.log(e.target.options[e.target.selectedIndex].text)
            break;
        case 2:
            console.log(e.target.options[e.target.selectedIndex].text)
            break;

    }

}


function init() {
    imageUploadWrap.addEventListener('dragover', function () {
        imageUploadWrap.classList.add('image-dropping');
    });
    imageUploadWrap.addEventListener('dragleave', function () {
        imageUploadWrap.classList.remove('image-dropping');
    });

    removeBtn.addEventListener('click', removeUpload);

    TMinit();
    
    imageUpload.addEventListener('change',()=>{
        console.log("start re upload")
        faceDetect();
    });
    //selectYear.addEventListener('change',changeYear);



}
init()

// 잘라낸 얼굴 다운 받는 코드
// document.querySelector('a').addEventListener('click', event =>
//     event.target.href = canvas_crop.toDataURL()
// );

//웹캠 실시간으로 동작하는거.
// function startVideo(){
//     console.log("start cam");
//     navigator.mediaDevices.getUserMedia
//     (
//         {video:{}},
//         stream => video.srcObject = stream,
//         err => console.error(err)
//     )
// }
