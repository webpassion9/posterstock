import * as flsFunctions from "./modules/functions.js";
import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle';

flsFunctions.isWebp();

// --------------------------------------------------------------------------
// ratio
// --------------------------------------------------------------------------
function forcedOriginalScale(containerClass) {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (!isMobile) {
    var App = document.querySelector(containerClass); // выбираем элемент по классу
    App.style.zoom = 1 / devicePixelRatio; // устанавливаем масштаб в зависимости от pixel-ratio
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function() {
    forcedOriginalScale('.wrapper'); // вызываем функцию, передавая в нее класс нашего контейнера
  }
);

// --------------------------------------------------------------------------
// Intro
// --------------------------------------------------------------------------

(function() {
  var wrapper = document.querySelector('.wrapper_intro');
  var intro = document.querySelector('.intro');
  var minWidth = 992;

  function applyMinHeight() {
    var wrapperHeight = wrapper.offsetHeight;
    intro.style.minHeight = wrapperHeight + 'px';

    var childElements = intro.children;
    for (var i = 0; i < childElements.length; i++) {
      childElements[i].style.minHeight = wrapperHeight + 'px';
    }
  }

  function removeMinHeight() {
    intro.style.minHeight = '';

    var childElements = intro.children;
    for (var i = 0; i < childElements.length; i++) {
      childElements[i].style.minHeight = '';
    }
  }

  function handleResize() {
    if (window.innerWidth >= minWidth) {
      applyMinHeight();
    } else {
      removeMinHeight();
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    handleResize();
  });

  window.addEventListener("resize", function() {
    handleResize();
  });
})();

// --------------------------------------------------------------------------
// swiper
// --------------------------------------------------------------------------
Swiper.use([Navigation, Pagination]);

let swiper = null;
let line = null;

function initSwiper() {
  swiper = new Swiper('.swiper', {
    loop: false,
    direction: "horizontal",
    slidesPerView: 1,
    spaceBetween: 32,
		// autoHeight: true,
    on: {
      slideChange: function (swiper) {
        updateActiveTab(swiper.activeIndex);
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
    },
    breakpoints: {
      992: {
        slidesPerView: 2
      }
    },
  });

  line = document.createElement('div');
  line.classList.add('tabs__line');
  const tabsContainer = document.querySelector('.tabs');
  tabsContainer.appendChild(line);

  const activeTab = document.querySelector('.tabs__item.active');
  if (activeTab) {
    updateLinePosition(activeTab);
  }
}

function destroySwiper() {
  if (swiper !== null) {
    swiper.destroy();
    swiper = null;
  }
}

function handleResize() {
  if (window.innerWidth < 992 && swiper === null) {
    initSwiper();
  } else if (window.innerWidth >= 992 && swiper !== null) {
    destroySwiper();
  }
}

window.addEventListener('load', () => {
  handleResize();

  const activeTab = document.querySelector('.tabs__item.active');
  if (activeTab) {
    updateLinePosition(activeTab);
  }

  setMinSlideHeight();
});

window.addEventListener('resize', () => {
  handleResize();

	const activeTab = document.querySelector('.tabs__item.active');
  if (activeTab) {
    updateLinePosition(activeTab);
  }

  setMinSlideHeight();
});

const sliderTab = document.querySelectorAll('[tab-index]');

sliderTab.forEach(el => {
  el.addEventListener('click', (e) => {
    let sliderTabIndex = e.currentTarget.getAttribute('tab-index');
    swiper.slideTo(`${sliderTabIndex}`);
    e.currentTarget.classList.add('active');
    updateLinePosition(e.currentTarget);
  });
});

function updateActiveTab(activeIndex) {
  sliderTab.forEach(e => {
    if (e.getAttribute('tab-index') === activeIndex.toString()) {
      e.classList.add('active');
      updateLinePosition(e);
    } else {
      e.classList.remove('active');
    }
  });
}

function updateLinePosition(activeTab) {
  const tabRect = activeTab.getBoundingClientRect();
  const containerRect = line.parentNode.getBoundingClientRect();
  const offsetLeft = tabRect.left - containerRect.left;
  line.style.width = tabRect.width + 'px';
  line.style.transform = `translateX(${offsetLeft}px)`;
}

function setMinSlideHeight() {
  var slides = document.querySelectorAll('.profile-content.swiper .swiper-wrapper .swiper-slide');
  var minHeight = 0;

  slides.forEach(function(slide) {
    slide.style.minHeight = '';
    var slideHeight = slide.clientHeight;
    
    if (slideHeight > minHeight) {
      minHeight = slideHeight;
    }
  });

  slides.forEach(function(slide) {
    slide.style.minHeight = minHeight + 'px';
  });
}


// --------------------------------------------------------------------------
// menu
// --------------------------------------------------------------------------
document.addEventListener('click', function(event) {
  var menuBtn = document.querySelector('.user-menu__btn');
  var menuMain = document.querySelector('.user-menu__main');
  
  if (event.target === menuBtn || event.target.closest('.user-menu__btn')) {
    menuMain.classList.add('active');
  } else if (!menuMain.contains(event.target)) {
    menuMain.classList.remove('active');
  }
});



// --------------------------------------------------------------------------
// check if mobile
// --------------------------------------------------------------------------
function isMobile() {
  return /Mobi|Android|iOS|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

function addClassToBody() {
  if (isMobile()) {
    document.body.classList.add('mobile');
  }
}

window.addEventListener('load', addClassToBody);


function resizeImage() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 1617) {
    const scaleFactor = screenWidth / 1617;
    const image = document.querySelector('.lists__item-img img');
    image.style.width = `${scaleFactor * 100}%`;
  } else {
    const image = document.querySelector('.lists__item-img img');
    image.style.width = '100%';
  }
}

// Вызываем функцию при загрузке страницы и изменении размера экрана
window.addEventListener('load', resizeImage);
window.addEventListener('resize', resizeImage);
