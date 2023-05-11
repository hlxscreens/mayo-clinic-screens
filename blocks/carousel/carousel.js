const MULTI_SPACE_STRING = '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;';
const executeLogicScript = () => {
  const imageWrapper = document.querySelector('.carousel-wrap');
  const imageItems = document.querySelectorAll('.carousel-item');
  const imageLength = imageItems.length;
  const perView = 1;
  let totalScroll = 0;
  const delay = 5000;
  imageWrapper.style.setProperty('--per-view', perView);
  for(let i = 0; i < perView; i++) {
    imageWrapper.insertAdjacentHTML('beforeend', imageItems[i].outerHTML);
  }
  let autoScroll = setInterval(scrolling, delay);
  function scrolling() {
    totalScroll++
    if(totalScroll === imageLength + 1) {
      clearInterval(autoScroll);
      totalScroll = 1;
      imageWrapper.style.transition = '0s';
      imageWrapper.style.left = '0';
      autoScroll = setInterval(scrolling, delay);
    }
    const widthEl = document.querySelector('.carousel-wrap > :first-child').offsetWidth;
    imageWrapper.style.left = `-${totalScroll * widthEl}px`;
    imageWrapper.style.transition = '.8s';
  }
}

const fetchCarouselContent = () => {
  const carouselContent = [];
  const rowContainers = document.querySelectorAll('.carousel > div');
  if (!rowContainers) {
    return carouselContent;
  }
  Array.from(rowContainers).forEach((row, index) => {
    try {
      const rowDetails = {};
      rowDetails.link = row.querySelector('picture > img').src;
      rowDetails.offer = row.children[1].innerText;
      rowDetails.description = row.children[2].innerHTML;
      if (rowDetails.link && rowDetails.offer && rowDetails.description) {
        carouselContent.push(rowDetails);
      }
    } catch (err) {
      console.error(`Exception while processing row ${index}`, err);
    }
  });
  return carouselContent;
}

const generateCarousel = (contentContainer) => {
  const content = fetchCarouselContent();
  if (content.length === 0) {
    return;
  }
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('carousel-wrap');
  content.forEach((asset) => {
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('carousel-image');
    const image = document.createElement('img');
    image.src = asset.link;
    imageDiv.appendChild(image);

    const textdiv = document.createElement('div');
    textdiv.classList.add('carousel-text');
    const heading = document.createElement('h1');
    heading.innerText = asset.offer;
    const description = document.createElement('p');
    description.innerHTML = asset.description;
    textdiv.appendChild(heading);
    textdiv.appendChild(description);
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    carouselItem.appendChild(imageDiv);
    carouselItem.appendChild(textdiv);
    carouselWrapper.appendChild(carouselItem);
  });
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel-contain');
  carouselContainer.appendChild(carouselWrapper);
  contentContainer.appendChild(carouselContainer);
}

const timeHeader = () => {
  function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById("time-header").textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const date = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    document.getElementById("date-header").textContent = `${date} ${month}, ${year}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

const generateHeader = (contentContainer) => {
  const header = document.createElement('div');
  header.classList.add('head-container');
  const logo = document.createElement('div');
  logo.classList.add('logo');
  const logoImage = document.createElement('img');
  logoImage.src = 'https://main--mayo-clinic-screens--div8063.hlx.live/content/screens/assets/media_19d99525ce831b5776256fe50d0846b0f5f74b773.png?width=2000&format=webply&optimize=medium';
  logo.appendChild(logoImage);
  header.appendChild(logo);
  const datetime = document.createElement('div');
  datetime.classList.add('datetime');
  const time = document.createElement('div');
  time.id = 'time-header';
  const date = document.createElement('div');
  date.id = 'date-header';
  datetime.appendChild(time);
  datetime.appendChild(date);
  header.appendChild(datetime);
  contentContainer.appendChild(header);
  timeHeader();
}

const fetchFooterContent = () => {
  const footerContent = [];
  const rowContainers = document.querySelectorAll('.marquee > div > div');
  if (!rowContainers) {
    return footerContent;
  }
  Array.from(rowContainers).forEach((row, index) => {
    try {
      const rowText = row.innerText;
      if (rowText) {
        footerContent.push(rowText);
      }
    } catch (err) {
      console.error(`Exception while processing row ${index}`, err);
    }
  });
  return footerContent;
}

const generateFooter = (contentContainer) => {
  const footerContent = fetchFooterContent();
  if (footerContent.length === 0) {
    return;
  }
  let marqueeText;
  footerContent.forEach((text) => {
    if (marqueeText) {
      marqueeText += MULTI_SPACE_STRING + text;
    } else {
      marqueeText = text;
    }
  });
  const marquee = document.createElement('marquee');
  marquee.innerHTML = marqueeText;
  const footerDiv = document.createElement('div');
  footerDiv.classList.add('footer-container');
  footerDiv.appendChild(marquee);
  contentContainer.appendChild(footerDiv);
}

export default function decorate(block) {
  const main = document.getElementsByTagName('main')[0];
  main.style.opacity = 0;
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container');
  main.parentElement.appendChild(contentContainer);
  generateHeader(contentContainer);
  generateCarousel(contentContainer);
  generateFooter(contentContainer);
  main.innerHTML = '';
  executeLogicScript();
}
