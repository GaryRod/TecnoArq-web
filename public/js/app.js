


$(document).ready(function() {
  $('.sidenav').sidenav();
  $('.parallax').parallax();
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

// function toggleCollapsibleApp() {
//   var content = document.querySelector('.collapsible-contentApp');
//   if (content.style.display === "none" || content.style.display === "") {
//       content.style.display = "block";
//   } else {
//       content.style.display = "none";
//   }
// }