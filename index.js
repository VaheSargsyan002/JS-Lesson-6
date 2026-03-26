const profileForm = document.getElementById("profile-form");
const noteButton = document.getElementById("save-note");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");

const textarea = document.getElementById("note-input");
const textError = document.getElementById("textarea-error");

const banner = document.getElementById("cookie-banner");
const acceptButton = document.getElementById("accept-cookie");

const clearButton = document.getElementById("clear-all");

const jokeButton = document.getElementById("get-joke");
const jokeText = document.getElementById("joke-text");

const startButton = document.getElementById("start-countdown");
const display = document.getElementById("countdown-display");

const startTickBtn = document.getElementById("start-tick");
const stopTickBtn = document.getElementById("stop-tick");
const tickDisplay = document.getElementById("tick-display");

//  Start ticking
let intervalId = null;

startTickBtn.addEventListener("click", () => {
  if (intervalId !== null) return; // will prevent multiple intervals

  intervalId = setInterval(() => {
    tickDisplay.textContent = "Printing tick in console...";
    console.log("Tick");
  }, 1000);
});

// Stop ticking
stopTickBtn.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = null;

  tickDisplay.textContent = "Stopped";
});

let isLoading = false;

startButton.addEventListener("click", () => {
  let count = 5;
  if (isLoading) {
    return;
  }
  function Countdown() {
    isLoading = true;
    if (count > 0) {
      display.textContent = count;
      count--;

      setTimeout(Countdown, 1000);
    } else {
      display.textContent = "Go!";
      isLoading = false;
    }
  }

  Countdown();
});

const fetchJoke = async () => {
  try {
    jokeText.textContent = "Loading...";

    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    jokeText.textContent = data.joke;
  } catch (e) {
    jokeText.textContent = "Failed to fetch joke.";
    console.error(e);
  }
};

function setCookie(name, value, daysToLive, path = "/") {
  const date = new Date();
  date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
  const expirationDate = "expires=" + date.toUTCString();
  const encodedValue = encodeURIComponent(value);
  const cookieToSet = `${name}=${encodedValue};${expirationDate};path=${path}`;
  document.cookie = cookieToSet;
}

function getCookie(name) {
  const decoded = decodeURIComponent(document.cookie);
  const cookiesArray = decoded.split("; ");

  for (let item of cookiesArray) {
    const [cookieName, cookieValue] = item.split("=");

    if (cookieName === name) {
      return cookieValue;
    }
  }

  return undefined;
}

function deleteCookie(name) {
  setCookie(name, null, -1);
}

jokeButton.addEventListener("click", fetchJoke);

window.addEventListener("DOMContentLoaded", () => {
  const consentCookie = getCookie("consent");

  if (consentCookie === "true") {
    banner.classList.add("cookie-banner--hidden");
  }
});
// Load the existing data
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("userProfile");

  if (saved) {
    const parsed = JSON.parse(saved);

    console.log("Saved Profile:", parsed);

    // Populating inputs
    nameInput.value = parsed.name || "";
    emailInput.value = parsed.email || "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const savedNote = sessionStorage.getItem("note");

  if (savedNote) {
    textarea.value = savedNote;
    console.log("Loaded note:", savedNote);
  }
});

nameInput.addEventListener("input", () => {
  nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, "");

  validateNameLive();
});

emailInput.addEventListener("input", () => {
  validateEmailLive();
});

textarea.addEventListener("input", () => {
  textarea.value = textarea.value.replace(/[^A-Za-z\s]/g, "");

  validateTextAreaLive();
});

// Validation live
function validateNameLive() {
  const value = nameInput.value.trim();

  if (value.length === 0) {
    nameError.textContent = "Name is required";
    return false;
  }

  if (value.length < 5) {
    nameError.textContent = "Minimum 5 characters";
    return false;
  }

  nameError.textContent = "";
  return true;
}

function validateEmailLive() {
  const value = emailInput.value.trim();

  if (value.length === 0) {
    emailError.textContent = "Email is required";
    return false;
  }

  if (!value.includes("@") || !value.includes(".")) {
    emailError.textContent = "Invalid email format";
    return false;
  }

  emailError.textContent = "";
  return true;
}

function validateTextAreaLive() {
  const value = textarea.value.trim();

  if (value.length === 0) {
    textError.textContent = "Textarea is required";
    return false;
  }

  if (value.length < 5) {
    textError.textContent = "Minimum 5 characters";
    return false;
  }

  textError.textContent = "";
  return true;
}

// Submit
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const isNameValid = validateNameLive();
  const isEmailValid = validateEmailLive();

  if (!isNameValid || !isEmailValid) return;

  const profile = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
  };

  localStorage.setItem("userProfile", JSON.stringify(profile));
  console.log("Profile Saved:", profile);
});

// Save note
noteButton.addEventListener("click", () => {
  const note = textarea.value;
  const isTextAreaValid = validateTextAreaLive();

  if (!isTextAreaValid) return;

  sessionStorage.setItem("note", note);
  console.log("Note saved:", note);
});

acceptButton.addEventListener("click", () => {
  setCookie("consent", "true", 7);
  banner.classList.add("cookie-banner--hidden");
});

clearButton.addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();

  deleteCookie("consent");

  nameInput.value = "";
  emailInput.value = "";
  textarea.value = "";

  banner.classList.remove("cookie-banner--hidden");

  console.log("All storage cleared!");
});
