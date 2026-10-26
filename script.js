const wrapper = document.querySelector(".wrapper");
const searchInput = document.querySelector(".search input");
const infoText = wrapper.querySelector(".info-text");
const wordTitle = wrapper.querySelector(".word p");
const wordInfo = wrapper.querySelector(".word span");
const meaningText = wrapper.querySelector(".meaning span");
const exampleText = wrapper.querySelector(".example span");
const synonymsBox = wrapper.querySelector(".synonyms");
const synonymsList = wrapper.querySelector(".synonyms .list");
const volumeIcon = document.getElementById("volume") || wrapper.querySelector(".word i");
const clearIcon = wrapper.querySelector(".search span");

let audioUrls = [];
let player = null;
let currentWord = "";

volumeIcon.setAttribute("title", "Listen to pronunciation");

function setPlaying(isPlaying) {
  volumeIcon.classList.toggle("playing", isPlaying);
}

function findExample(entries) {
  for (const entry of entries) {
    for (const meaning of entry.meanings) {
      for (const def of meaning.definitions) {
        if (def.example) return def.example;
      }
    }
  }
  return "No example available.";
}

function findAudios(entries) {
  const urls = [];
  for (const entry of entries) {
    for (const p of entry.phonetics || []) {
      if (p.audio && p.audio.trim()) {
        urls.push(p.audio.startsWith("//") ? "https:" + p.audio : p.audio);
      }
    }
  }
  return [...new Set(urls)];
}

function findSynonyms(entry) {
  const found = [];
  for (const meaning of entry.meanings) {
    found.push(...(meaning.synonyms || []));
    for (const def of meaning.definitions) {
      found.push(...(def.synonyms || []));
    }
  }
  return [...new Set(found)].slice(0, 5);
}

function stopSound() {
  if (player) {
    player.pause();
    player = null;
  }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  setPlaying(false);
}

function speak(word) {
  if (!("speechSynthesis" in window)) {
    console.warn("This browser has no speech synthesis.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.onstart = () => setPlaying(true);
  utterance.onend = () => setPlaying(false);
  utterance.onerror = () => setPlaying(false);
  speechSynthesis.speak(utterance);
}

function tryPlay(index) {
  if (index >= audioUrls.length) {
    console.log("Using browser voice for:", currentWord);
    speak(currentWord);
    return;
  }

  let moved = false;
  const next = () => {
    if (moved) return;
    moved = true;
    console.warn("Audio failed, trying next:", audioUrls[index]);
    tryPlay(index + 1);
  };

  console.log("Trying audio:", audioUrls[index]);
  player = new Audio(audioUrls[index]);
  player.onplay = () => setPlaying(true);
  player.onended = () => setPlaying(false);
  player.onerror = next;
  player.play().catch(next);
}

function playAudio() {
  stopSound();
  tryPlay(0);
}

function showResult(result, word) {
  if (!Array.isArray(result)) {
    wrapper.classList.remove("active");
    infoText.style.color = "#d33";
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please try another word.`;
    return;
  }

  const entry = result[0];
  const meaning = entry.meanings[0];
  const definition = meaning.definitions[0];
  const phoneticText = entry.phonetic || entry.phonetics.find(p => p.text)?.text || "";

  stopSound();
  currentWord = entry.word;
  audioUrls = findAudios(result);
  console.log("Audio files found:", audioUrls);

  wordTitle.textContent = entry.word;
  wordInfo.textContent = `${meaning.partOfSpeech} ${phoneticText}`.trim();
  meaningText.textContent = definition.definition;
  exampleText.textContent = findExample(result);

  const synonyms = findSynonyms(entry);
  synonymsList.innerHTML = "";

  if (synonyms.length === 0) {
    synonymsBox.style.display = "none";
  } else {
    synonymsBox.style.display = "block";
    synonyms.forEach(syn => {
      const span = document.createElement("span");
      span.textContent = syn;
      span.addEventListener("click", () => search(syn));
      synonymsList.appendChild(span);
    });
  }

  infoText.style.color = "";
  wrapper.classList.add("active");
}

async function search(word) {
  searchInput.value = word;
  wrapper.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>...`;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    const result = await response.json();
    console.log(result);
    showResult(result, word);
  } catch (error) {
    console.error(error);
    infoText.style.color = "#d33";
    infoText.textContent = "Something went wrong. Check your connection and try again.";
  }
}

searchInput.addEventListener("keyup", e => {
  const word = e.target.value.trim();
  if (e.key === "Enter" && word) search(word);
});

volumeIcon.addEventListener("click", playAudio);

clearIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  stopSound();
  infoText.style.color = "";
  infoText.textContent =
    "Type a word and press Enter to get its meaning, pronunciation, and synonyms.";
});