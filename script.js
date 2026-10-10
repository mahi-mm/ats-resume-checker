const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const errorBox = document.getElementById("error");
const fileRow = document.getElementById("file-row");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const removeBtn = document.getElementById("remove-btn");
const progress = document.getElementById("progress");
const results = document.getElementById("results");
const scoreValue = document.getElementById("score-value");
const scoreNote = document.getElementById("score-note");
const presentSkills = document.getElementById("present-skills");
const missingSkills = document.getElementById("missing-skills");
const resetBtn = document.getElementById("reset-btn");

const MAX_MB = 5;
let currentFile = null;
let timerId = null;

// ---- Mock "parser" -----------------------------------------------------
// Every upload gets a score and two skill lists. It's deterministic: the
// same file always produces the same report, so the demo feels like a real
// parser rather than a random number generator.

const KNOWN_SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "HTML", "CSS", "REST APIs", "Testing", "Docker", "Figma",
];

const WORD_POOL = ["browser", "render", "list", "flex", "count", "chip", "sort", "toggle"];

function hashFile(file) {
  let hash = 0;
  const text = file.name + file.size;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function buildReport(file) {
  const seed = hashFile(file);
  const presentCount = 5 + (seed % 4); // 5–8 skills "found"
  const present = [];
  for (let i = 0; i < presentCount; i++) {
    present.push(KNOWN_SKILLS[(seed + i * 3) % KNOWN_SKILLS.length]);
  }
  const presentSet = new Set(present);
  const missing = KNOWN_SKILLS.filter((s) => !presentSet.has(s));

  const score = 40 + (seed % 51); // 40–90
  return { score, present, missing };
}

function scoreNote(score) {
  if (score >= 80) return "Strong resume — most core skills are covered.";
  if (score >= 65) return "Decent foundation. The missing skills below are the quick wins.";
  return "There's a lot of room to grow. Check the missing skills and try working them into your experience.";
}

// ---- Rendering ---------------------------------------------------------

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
}

function showFile(file) {
  currentFile = file;
  fileName.textContent = file.name;
  fileSize.textContent = formatSize(file.size);
  fileRow.hidden = false;
  clearError();
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

function renderReport({ score, present, missing }) {
  progress.hidden = true;
  results.hidden = false;
  scoreValue.textContent = score;
  scoreNote.textContent = scoreNote(score);
  scoreNote.classList.toggle("good", score >= 80);
  scoreNote.classList.toggle("warn", score < 65);
  fillChips(presentSkills, present);
  fillChips(missingSkills, missing);
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fillChips(list, skills) {
  list.textContent = "";
  skills.forEach((skill) => {
    const li = document.createElement("li");
    li.textContent = skill;
    list.appendChild(li);
  });
}

function reset() {
  clearTimeout(timerId);
  fileInput.value = "";
  currentFile = null;
  fileRow.hidden = true;
  progress.hidden = true;
  results.hidden = true;
  clearError();
  dropzone.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ---- Wiring ------------------------------------------------------------

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
});

["dragenter", "dragover"].forEach((type) =>
  dropzone.addEventListener(type, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  })
);

["dragleave", "drop"].forEach((type) =>
  dropzone.addEventListener(type, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  })
);

dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (file) handleFile(file);
});

removeBtn.addEventListener("click", reset);
resetBtn.addEventListener("click", reset);

function handleFile(file) {
  clearError();

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    showError("Only PDF files are accepted. Please choose a PDF resume.");
    return;
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    showError(`File is too large (${formatSize(file.size)}). The limit is ${MAX_MB} MB.`);
    return;
  }
  if (file.size === 0) {
    showError("That file looks empty. Please choose a valid PDF resume.");
    return;
  }

  showFile(file);
  results.hidden = true;
  progress.hidden = false;

  // Simulated parse delay before revealing the report.
  timerId = setTimeout(() => {
    renderReport(buildReport(file));
  }, 1500);
}
