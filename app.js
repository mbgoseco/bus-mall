'use strict';

function Product(name, src) {
  this.name = name;
  this.src = src;
  this.votes = 0;
  this.used = false;
  this.views = 0;
  this.color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
  tracker.products.push(this);
};

var tracker = {
  products: [],
  imgID: [],
  totalClicks: 0,

  mainEl: document.getElementById('main-content'),
  imgDiv: document.getElementById('images'),
  buttonEl: document.getElementById('button-div'),
  propmtEl: document.getElementById('prompt'),

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
        tracker.products[tracker.imgID[j]].views++;
        charts[1].data.datasets[0].data[tracker.imgID[j]]++;
        var jsonDonutChart = JSON.stringify(charts[1].data.datasets[0].data);
        localStorage.setItem('viewData', jsonDonutChart);
        charts[1].update();
      }
      return true;
    } else {
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

    tracker.propmtEl.innerText = `Choose an item you would like to see in our catalog: ${25 - tracker.totalClicks} remaining`;

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
        tracker.products[i].votes++;
        tracker.totalClicks++;
        charts[0].data.datasets[0].data[i]++;
        var jsonBarChart = JSON.stringify(charts[0].data.datasets[0].data);
        localStorage.setItem('voteData', jsonBarChart);
        charts[0].update();
      }
    }
    if (tracker.totalClicks >= 25) {
      tracker.imgDiv.removeEventListener('click', tracker.clickHandler);
      if(!localStorage.getItem('bgcolors')) {
        tracker.saveColors();
      }
      tracker.propmtEl.innerText = 'Thank you!';
      var showCharts = document.getElementById('charts');
      showCharts.style.visibility = 'visible';
      tracker.resetButtons();
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

  resetButtons: function() {
    var reloadButton = document.createElement('button');
    reloadButton.id = 'reset';
    reloadButton.textContent = 'New Survey';
    tracker.buttonEl.appendChild(reloadButton);

    reloadButton.addEventListener('click', function() {
      location.reload();
    });

    var clearButton = document.createElement('button');
    clearButton.id = 'clear';
    clearButton.textContent = 'Erase Survey Data';
    tracker.buttonEl.appendChild(clearButton);

    clearButton.addEventListener('click', function() {
      localStorage.clear();
      location.reload();
    });
  },
  saveColors: function() {
    var backgrounds = JSON.stringify(charts[0].data.datasets[0].backgroundColor);
    localStorage.setItem('bgcolors', backgrounds);
    var borders = JSON.stringify(charts[0].data.datasets[0].borderColor);
    localStorage.setItem('bdcolors', borders);
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

var barChart;
var donutChart;
var charts = [barChart, donutChart];
(function createCharts() {
  var ctx = document.getElementById('bar-chart').getContext('2d');
  charts[0] = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: [],
      datasets: [{
        label: 'Number of Votes per Item',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
        }],
      },
    },
  });

  var cty = document.getElementById('donut-chart').getContext('2d');
  charts[1] = new Chart(cty, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        label: 'Percent of Votes per Item',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      }],
    },
    options: {
      cutoutPercentage: 40,
    },
  });

  // populates bar chart with item names for labels and data for item votes
  for(var i = 0; i < tracker.products.length; i++) {
    charts[0].data.labels.push(tracker.products[i].name);
    // conditional check for local storage data and setting it
    if (localStorage.getItem('voteData')) {
      charts[0].data.datasets[0].data = JSON.parse(localStorage.getItem('voteData'));
      charts[0].update();
    } else {
      charts[0].data.datasets[0].data.push(tracker.products[i].votes);
    }
    if (localStorage.getItem('bgcolors')) {
      charts[0].data.datasets[0].backgroundColor = JSON.parse(localStorage.getItem('bgcolors'));
      charts[0].data.datasets[0].borderColor = JSON.parse(localStorage.getItem('bdcolors'));
    } else {
      charts[0].data.datasets[0].backgroundColor.push(`rgba(${tracker.products[i].color[0]}, ${tracker.products[i].color[1]}, ${tracker.products[i].color[2]}, 0.5)`);
      charts[0].data.datasets[0].borderColor.push(`rgba(${tracker.products[i].color[0]}, ${tracker.products[i].color[1]}, ${tracker.products[i].color[2]}, 1`);
    }
  }
  // populates donut chart with names for labels and data for times item was viewed
  for(var j = 0; j < tracker.products.length; j++) {
    charts[1].data.labels.push(tracker.products[j].name);
    // conditional check for local storage data and setting it
    if (localStorage.getItem('viewData')) {
      charts[1].data.datasets[0].data = JSON.parse(localStorage.getItem('viewData'));
      charts[1].update();
    } else {
      charts[1].data.datasets[0].data.push(tracker.products[j].views);
    }
    if (localStorage.getItem('bdcolors')) {
      charts[1].data.datasets[0].backgroundColor = JSON.parse(localStorage.getItem('bgcolors'));
      charts[1].data.datasets[0].borderColor = JSON.parse(localStorage.getItem('bdcolors'));
    } else {
      charts[1].data.datasets[0].backgroundColor.push(`rgba(${tracker.products[j].color[0]}, ${tracker.products[j].color[1]}, ${tracker.products[j].color[2]}, 0.5)`);
      charts[1].data.datasets[0].borderColor.push(`rgba(${tracker.products[j].color[0]}, ${tracker.products[j].color[1]}, ${tracker.products[j].color[2]}, 1`);
    }
  }

})();

tracker.render();

tracker.imgDiv.addEventListener('click', tracker.clickHandler);