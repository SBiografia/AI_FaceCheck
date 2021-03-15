const openPage =  document.querySelector('.welcomeImgContainer');
const mainPage =  document.querySelector('.main');

const heart = openPage.querySelectorAll('.heart');
const openImg = openPage.querySelector('.welcomeImg');

const imgList = ['img/BG_BTS01.jpg','img/BG_BTS02.jpg','img/BG_BTS03.jpg','img/BG_BTS04.jpg','img/BG_BTS05.jpg']





function init() {
    let randomNum_Img = Math.floor(Math.random() * 5)
    openImg.src = imgList[randomNum_Img];

    heart[0].addEventListener('click', () => {
        openPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });
}


init();