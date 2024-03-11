var shareImageButton = document.querySelector("#share-image-button");
var sharedMomentsArea = document.querySelector("#shared-moments");

function openCreatePostModal() {
  createPostArea.style.display = "block";
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === "dismissed") {
        console.log("User cancelled installation");
      } else {
        console.log("User added to home screen");
      }
    });

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = "none";
}

shareImageButton.addEventListener("click", openCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise

function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
  var cardWrapper = document.createElement("div");
  cardWrapper.className = "box";

  var imageWrapper = document.createElement("div");
  imageWrapper.className = "image";

  var imageElement = document.createElement("img");
  imageElement.src = data.image;
  imageElement.alt = "";

  imageWrapper.appendChild(imageElement);

  var contentWrapper = document.createElement("div");
  contentWrapper.className = "content";

  var priceElement = document.createElement("div");
  priceElement.className = "price";
  priceElement.textContent = data.title;

  var oldPriceSpan = document.createElement("span");
  oldPriceSpan.textContent = data.oldPrice;
  priceElement.appendChild(oldPriceSpan);

  var orderLink = document.createElement("a");
  orderLink.href = data.url;
  orderLink.id = "button";
  orderLink.dataset.bsToggle = "modal";
  orderLink.textContent = "DETAIL CARD";

  // Menambahkan event listener untuk mengarahkan ke URL yang sesuai saat tombol "Order Now" diklik
  // orderLink.addEventListener("click", function (event) {
  //   event.preventDefault(); // Mencegah tindakan default dari link
  //   window.location.href = data.url; // Mengarahkan ke URL yang sesuai dengan data kartu
  // });

  orderLink.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah tindakan default dari link
    localStorage.setItem("orderData", JSON.stringify(data)); // Menyimpan semua atribut data ke localStorage
    var newPageUrl = "/detailcard.html"; // Ubah ini sesuai dengan URL halaman baru Anda
    window.location.href = newPageUrl; // Mengarahkan ke URL halaman baru
  });

  contentWrapper.appendChild(priceElement);
  contentWrapper.appendChild(orderLink);

  cardWrapper.appendChild(imageWrapper);
  cardWrapper.appendChild(contentWrapper);

  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = "https://marcel-1bbd2-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json";
var networkDataReceived = false;

fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log("From web", data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ("indexedDB" in window) {
  readAllData("posts").then(function (data) {
    if (!networkDataReceived) {
      console.log("From cache", data);
      updateUI(data);
    }
  });
}
