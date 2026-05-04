document.addEventListener("DOMContentLoaded", function () {
  let currentArtwork = null;
  let gallery = [];

document.getElementById("search-btn").addEventListener("click", () => {
  const title = document.getElementById("painting-input").value.trim();

  if (!title) {
    document.getElementById("status-message").textContent = "Please type a painting title.";
    return;
  }
  searchMet(title);
});

function searchMet(title) {
  fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.objectIDs || data.objectIDs.length === 0) {
        document.getElementById("status-message").textContent = "Error searching. This artwork may not be in the MET's collection.";
        return;
      }

      const firstID = data.objectIDs[0];
      fetchArtwork(firstID);
    })
    .catch(() => {
      document.getElementById("status-message").textContent = "Error searching. This artwork may not be in the MET's collection.";
    });
}

function fetchArtwork(id) {
  fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
    .then(res => res.json())
    .then(art => {
      document.getElementById("art-img").src = art.primaryImageSmall;
      document.getElementById("art-title").textContent = art.title;
      document.getElementById("art-artist").textContent = art.artistDisplayName || "Unknown";

      currentArtwork = {
        image: art.primaryImageSmall,
        title: art.title,
        artist: art.artistDisplayName || "Unknown",
        date: art.objectDate
      };

      document.getElementById("add-to-gallery-btn").style.visibility = "visible";
      document.getElementById("status-message").textContent = "";
    })
    .catch(() => {
      document.getElementById("status-message").textContent = "Error loading. This artwork may not be in the MET's collection.";
    });
}

document.getElementById("add-to-gallery-btn").addEventListener("click", () => {
  if (!currentArtwork) return;

  gallery.push(currentArtwork);
  localStorage.setItem("gallery", JSON.stringify(gallery));

  renderGallery();
  document.getElementById("your-gallery").style.display = "block";
});

function renderGallery() {
  const box = document.getElementById("gallery");
  box.innerHTML = "";

  gallery.forEach(item => {
    box.innerHTML += `
      <div class="gallery-item">
        <img src="${item.image}">
        <p><strong>${item.title}</strong><br>${item.artist}<br>${item.date}</p>
      </div>
    `;
  });
}
renderGallery();
});

const newArtBtn = document.getElementById("new-art-btn");
const artCard = document.getElementById("art-card");
const artImage = document.getElementById("art-image");
const artTitle = document.getElementById("game-art-title");
const artYear = document.getElementById("game-art-year");
const optionsEl = document.getElementById("options");
const feedback = document.getElementById("feedback");

let correctArtist = "";
let cachedIDs = [];

async function loadIDsOnce() {
  if (cachedIDs.length > 0) return;

  const res = await fetch(
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting"
  );
  const data = await res.json();
  cachedIDs = data.objectIDs || [];
}

async function getRandomArtworkID() {
  await loadIDsOnce();
  return cachedIDs[Math.floor(Math.random() * cachedIDs.length)];
}

async function getArtworkDetails(id) {
  const res = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  );
  return await res.json();
}

function generateArtistOptions(correct) {
  const artists = [
    "Gian Lorenzo Bernini",
    "Norman Rockwell",
    "Albrecht Durer",
    "Andy Warhol",
    "Jack Vettriano",
    "Raphael Sanzio",
    "Sandro Botticelli",
    "Paul Cézanne",
    "Jacques-Louis David",
    "El Greco",
    "Francisco de Goya",
    "Johannes Vermeer",
    "Rembrandt", 
    "Winslow Homer",
    "Francisco de Goya,",
    "Frida Kahlo", 
    "Georgia O'Keeffe"
  ];

  const filtered = artists.filter(a => a !== correct);

    for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  const options = filtered.slice(0, 3);
  options.push(correct);

  return options.sort(() => Math.random() - 0.5);
}

async function renderQuestion() {
  artCard.style.display = "none";
  optionsEl.classList.remove("show");

  artImage.src = "";
  artTitle.textContent = "";
  artYear.textContent = "";
  optionsEl.innerHTML = "";
  feedback.textContent = "";
  feedback.className = "";

  const id = await getRandomArtworkID();
  const art = await getArtworkDetails(id);

  if (!art.primaryImageSmall || !art.artistDisplayName) {
    setTimeout(renderQuestion, 0);
    return;
  }

  artImage.style.opacity = 0;
  artImage.src = art.primaryImageSmall;

  requestAnimationFrame(() => {
    artImage.style.opacity = 1;
  });

  artTitle.textContent = art.title || "Untitled";
  artYear.textContent = art.objectDate || "";
  correctArtist = art.artistDisplayName;

  const options = generateArtistOptions(correctArtist);

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-dark";
    btn.textContent = option;
    btn.addEventListener("click", () => checkAnswer(option));
    optionsEl.appendChild(btn);
  });

  artCard.style.display = "block";

  requestAnimationFrame(() => {
    optionsEl.classList.add("show");
  });
}

function checkAnswer(selected) {
  feedback.classList.remove("text-correct", "text-incorrect");

  if (selected === correctArtist) {
    feedback.textContent = "Correct! You are a real artist!";
    feedback.classList.add("text-correct");
  } else {
    feedback.textContent = `Incorrect, try again!`;
    feedback.classList.add("text-incorrect");
  }
}
newArtBtn.addEventListener("click", renderQuestion);
