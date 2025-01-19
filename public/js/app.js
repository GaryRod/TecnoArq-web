


$(document).ready(function() {
  $('.sidenav').sidenav();
  $('.parallax').parallax();

  const modal = document.querySelectorAll('.modal');
  M.Modal.init(modal);
    
  const step1 = document.querySelector('#step1')
  const step2 = document.querySelector('#step2')
  const next = document.querySelector('#next')
  const prev = document.querySelector('#prev')
  next.addEventListener('click', e => {
    step1.classList.add('hide');
    step2.classList.remove('hide');
  })
  prev.addEventListener('click', e => {
    step1.classList.remove('hide');
    step2.classList.add('hide');
  })
})

function toggleCollapsible(collapsibleClass) {
  var allContents = document.querySelectorAll('.collapsible-content, .collapsible-contentXia, .collapsible-contentApp, .collapsible-contentMot, .collapsible-content_rrr, .collapsible-contentAuricular');
  var contentToToggle = document.querySelector(`.${collapsibleClass}`);
  
  allContents.forEach(function(content) {
    if (content !== contentToToggle) {
      content.style.display = "none";
    }
  });

  if (contentToToggle.style.display === "none" || contentToToggle.style.display === "") {
    contentToToggle.style.display = "block";
  } else {
    contentToToggle.style.display = "none";
  }
}

document.querySelector("#containerProducts").addEventListener('click', e => {
  if (e.target.classList.contains('button-desple')) {
    const product = e.target.dataset;
    
  }
})

 
// function toggleCollapsibleApp() {
//   var content = document.querySelector('.collapsible-contentApp');
//   if (content.style.display === "none" || content.style.display === "") {
//       content.style.display = "block";
//   } else {
//       content.style.display = "none";
//   }
// }