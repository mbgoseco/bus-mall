'use strict';

function Product(name, src) {
  this.name = name;
  this.src = src;
  this.votes = 0;
  this.used = false;
  tracker.products.push(this);
};

var tracker = {
  products: [],
  imgID: [],
  totalClicks: 0,

  mainEl: document.getElementById('main-content'),
  imgDiv: document.getElementById('images'),
  asideEl: document.getElementById('tally'),

  getRandomIndex: function() {
    return Math.floor(Math.random() * tracker.products.length);
  },
  getUniqueImages: function() {
    tracker.imgID = [];
    tracker.imgID.push(tracker.getRandomIndex());
    tracker.imgID.push(tracker.getRandomIndex());
    tracker.imgID.push(tracker.getRandomIndex());
    if (tracker.imgID[0] === tracker.imgID[1] || tracker.imgID[0] === tracker.imgID[2] || tracker.imgID[1] === tracker.imgID[2]) {
      return false;
    }
    if (tracker.products[tracker.imgID[0]].used === false && tracker.products[tracker.imgID[1]].used === false && tracker.products[tracker.imgID[2]].used === false) {
      // clears tags for images used last round
      for(var i = 0; i < tracker.products.length; i++) {
        tracker.products[i].used = false;
      }
      // ...and flags the newly chosen images as used for the next round
      for(var j = 0; j < tracker.imgID.length; j++) {
        tracker.products[tracker.imgID[j]].used = true;
        console.log(tracker.products[tracker.imgID[j]]);
      }
      return true;
    } else {
      console.log('condition failed!');
      return false;
    }
  },
  render: function() {
    // while loop to prevent recursion inside the getUniqueImages() function
    var notUsed = false;
    while(notUsed === false) {
      notUsed = tracker.getUniqueImages();
    }

    var removeImgs = document.querySelectorAll('#images img');
    for(var x = 0; x < removeImgs.length; x++) {
      removeImgs[x].parentNode.removeChild(removeImgs[x]);
    }

    for(var i = 0; i < tracker.imgID.length; i++) {
      var imgEl = document.createElement('img');
      imgEl.setAttribute('src', tracker.products[tracker.imgID[i]].src);
      imgEl.setAttribute('name', tracker.products[tracker.imgID[i]].name);
      tracker.imgDiv.appendChild(imgEl);
    }
  },
  addClicks: function(imgName) {
    for(var i = 0; i < tracker.products.length; i++) {
      if (imgName === tracker.products[i].name) {
        tracker.products[i].votes += 1;
        tracker.totalClicks += 1;
      }
    }
    if (tracker.totalClicks >= 25) {
      tracker.imgDiv.removeEventListener('click', tracker.clickHandler);
      tracker.resetButton();
    } else {
      tracker.render();
    }
  },
  clickHandler: function(event) {
    var images = document.querySelectorAll('#images img');
    var imgInput = event.target.name;
    if (imgInput === images[0].name || imgInput === images[1].name || imgInput === images[2].name) {
      tracker.addClicks(imgInput);
    }

  },
  resetButton: function() {
    var button = document.createElement('button');
    button.id = 'reset';
    button.textContent = 'Reset';
    tracker.mainEl.appendChild(button);

    var tallyTitleEl = document.createElement('p');
    tallyTitleEl.id = 'tally-title';
    tallyTitleEl.textContent = 'TOTAL VOTES BY ITEM';
    tracker.asideEl.appendChild(tallyTitleEl);
    var finalList = document.createElement('ul');
    for(var i = 0; i < tracker.products.length; i++) {
      var liEl = document.createElement('li');
      liEl.textContent = `${tracker.products[i].name} - Votes: ${tracker.products[i].votes}`;
      finalList.appendChild(liEl);
    }
    tracker.asideEl.appendChild(finalList);

    var brEl = document.createElement('br');
    tracker.asideEl.appendChild(brEl);

    var percentTitleEl = document.createElement('p');
    percentTitleEl.id = 'percent-title';
    percentTitleEl.textContent = 'PERCENT OF VOTES BY ITEM';
    tracker.asideEl.appendChild(percentTitleEl);
    var percentList = document.createElement('ul');
    for(var j = 0; j < tracker.products.length; j++) {
      liEl = document.createElement('li');
      liEl.textContent = `${tracker.products[j].name}: ${(tracker.products[j].votes / 25) * 100}%`;
      percentList.appendChild(liEl);
    }
    tracker.asideEl.appendChild(percentList);

    button.addEventListener('click', function() {
      location.reload();
    });
  },
};

(function createProducts() {
  new Product('R2D2 Luggage', './img/bag.jpg');
  new Product('Banana Cutter', './img/banana.jpg');
  new Product('Bathroom Tablet Stand', './img/bathroom.jpg');
  new Product('Rain Boots', './img/boots.jpg');
  new Product('Breakfast Maker', './img/breakfast.jpg');
  new Product('Meatball Bubblegum', './img/bubblegum.jpg');
  new Product('Round Chair', './img/chair.jpg');
  new Product('Cthulhu Doll', './img/cthulhu.jpg');
  new Product('Dog Duck', './img/dog-duck.jpg');
  new Product('Dragon Meat', './img/dragon.jpg');
  new Product('Pen Utensils', './img/pen.jpg');
  new Product('Pet Sweeper', './img/pet-sweep.jpg');
  new Product('Pizza Scissors', './img/scissors.jpg');
  new Product('Shark Sleeping Bag', './img/shark.jpg');
  new Product('Baby Sweeper', './img/sweep.jpg');
  new Product('Tauntaun Sleeping Bag', './img/tauntaun.jpg');
  new Product('Unicorn Meat', './img/unicorn.jpg');
  new Product('USB Tentacle', './img/usb.gif');
  new Product('Water Can', './img/water-can.jpg');
  new Product('Wine Glass', './img/wine-glass.jpg');
})();

tracker.render();

tracker.imgDiv.addEventListener('click', tracker.clickHandler);