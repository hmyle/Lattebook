searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
  searchForm.classList.toggle('active');
}


window.onscroll = () =>{

  searchForm.classList.remove('active');

  if(window.scrollY > 93){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

}

window.onload = () =>{

  if(window.scrollY > 80){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

  fadeOut();

}

function loader(){
  document.querySelector('.loader-container').classList.add('active');
}

function fadeOut(){
  setTimeout(loader, 4000);
}

var swiper = new Swiper(".books-slider", {
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".featured-slider", {
  spaceBetween: 10,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

var swiper = new Swiper(".arrivals-slider", {
  spaceBetween: 10,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".reviews-slider", {
  spaceBetween: 10,
  grabCursor:true,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".blogs-slider", {
  spaceBetween: 10,
  grabCursor:true,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

let bookmenuForm = document.querySelector('.bookmenu-form-container');

document.querySelector('#bookmenu-btn').onclick = () =>{
  bookmenuForm.classList.toggle('active');
}

document.querySelector('#close-bookmenu-btn').onclick = () =>{
  bookmenuForm.classList.remove('active');
}

/*===== ELEMENT SELECTOR =====*/
const sidebar = document.getElementById('sidebar');
const buttonMenu = document.getElementById('btn-menu');
const buttonClose = document.getElementById('btn-close');
const navLinks = document.getElementsByClassName('nav-link');
const sections = document.getElementsByClassName('section');

/*===== SHOW/HIDE SIDEBAR ======*/
// OPEN
buttonMenu.addEventListener('click', () => {
  sidebar.classList.add('nav-show');
});
// CLOSE
buttonClose.addEventListener('click', () => {
  sidebar.classList.remove('nav-show');
});

// HIDE SIDEBAR WHEN CLICK ON MENU ITEM
Array.from(navLinks).forEach(navItem => {
  navItem.addEventListener('click', () => {
    sidebar.classList.remove('nav-show');
  });
});

/*===== SCROLL ACTION: ACTIVE MENU ITEM WHEN SCROLL TO SECTION =====*/
const scrollToActive = () => {
  const scrollY = window.pageYOffset;

  Array.from(sections).forEach(section => {
    const SECTION_GAP = 50;
    const sectionHeight = section.offsetHeight;
    const sectionPosition = section.offsetTop - SECTION_GAP;
    const sectionId = section.getAttribute('id');
    const menuItemElement = document.querySelector('.nav-item a[href*=' + sectionId + ']');

    // Handle when scroll to section area
    if (scrollY > sectionPosition && scrollY <= sectionPosition + sectionHeight) {
      menuItemElement.classList.add('active');
    } else {
      menuItemElement.classList.remove('active');
    }
  });
}

// Binding scrollToActive event
window.addEventListener('scroll', scrollToActive);
