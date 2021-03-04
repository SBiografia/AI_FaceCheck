const shareButton = document.querySelector('.share-button');
const shareDialog = document.querySelector('.share-dialog');
const closeButton = document.querySelector('.close-button');
const copyButton = document.querySelector('.link-copy');
// const shareURL = document.querySelector('.pen-url');



function init(){
    shareButton.addEventListener('click', event => {
        if (navigator.share) { 
            console.log("has navigator.share");
         navigator.share({
            title: document.title,
            url: document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href
          }).then(() => {
            console.log('Thanks for sharing!');
          })
          .catch(console.error);
          } else {
              console.log("no navigator.share");
            //   shareURL.innerHTML = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href;
              shareDialog.classList.add('is-open');
          }
      });
      copyButton.addEventListener('click',event =>{
        let tempElem = document.createElement('textarea');
        tempElem.value = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href;  
        document.body.appendChild(tempElem);
        tempElem.setSelectionRange(0, 9999);  // 추가 ios를 위해서 
        tempElem.select();
        document.execCommand("copy");
        document.body.removeChild(tempElem);
      });



      
      closeButton.addEventListener('click', event => {
        shareDialog.classList.remove('is-open');
      });
}

init();
