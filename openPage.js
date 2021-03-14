const openPage =  document.querySelector('.welcomeImgContainer');

const heart = openPage.querySelector('.heart');
const openImg = openPage.querySelector('.welcomeImg');

const imgList = ['img/BG_BTS01.jpg','img/BG_BTS02.jpg','img/BG_BTS03.jpg','img/BG_BTS04.jpg','img/BG_BTS05.jpg']





function init() {
    let randomNum_Img = Math.floor(Math.random() * 5)
    openImg.src = imgList[randomNum_Img];

    heart.addEventListener('click', () => {
        openPage.classList.add('hidden');
    });
}


init();