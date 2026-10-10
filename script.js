
import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

const $ = (id) => document.getElementById(id);

const dropzone = $("dropzone");
const fileInput = $("file-input");
const errorBox = $("error");
const fileRow = $("file-row");
const fileName = $("file-name");
const fileSize = $("file-size");
const removeBtn = $("remove-btn");
const progress = $("progress");
const results = $("results");
const scoreValue = $("score-value");
const scoreNote = $("score-note");
const scoreBar = $("score-bar");
const presentSkills = $("present-skills");
const missingSkills = $("missing-skills");
const otherSkills = $("other-skills");
const resetBtn = $("reset-btn");
const jobDescription = $("job-description");
const themeToggle = $("theme-toggle");
const matchSummary = $("match-summary");
const matchDetails = $("match-details");
const extractionStatus = $("extraction-status");
const matchedCount = $("matched-count");
const missingCount = $("missing-count");
const presentCount = $("present-count");
const missingSkillCount = $("missing-skill-count");
const skillCountBadge = $("skill-count-badge");

const MAX_MB = 5;
let analysisId = 0;

// Skill dictionary with common synonyms.
const SKILLS = {
  "Java": ["java", "core java"],
  "Spring Boot": ["spring boot", "springboot"],
  "Spring Framework": ["spring framework"],
  "Spring AI": ["spring ai"],
  "Python": ["python"],
  "JavaScript": ["javascript", "ecmascript"],
  "TypeScript": ["typescript"],
  "Swift": ["swift", "swift language"],
  "SwiftUI": ["swiftui"],
  "UIKit": ["uikit"],
  "AppKit": ["appkit"],
  "Objective-C": ["objective-c", "objective c", "objc"],
  "Kotlin": ["kotlin"],
  "Kotlin Multiplatform": [
    "kotlin multiplatform",
    "kmp",
    "kotlin multiplatform mobile",
    "kmm"
  ],
  "React": ["react", "react.js", "reactjs"],
  "React Native": ["react native"],
  "Flutter": ["flutter"],
  "Dart": ["dart"],
  "Node.js": ["node.js", "nodejs", "node js"],
  "SQL": ["sql", "structured query language"],
  "PostgreSQL": ["postgresql", "postgres"],
  "MySQL": ["mysql"],
  "MongoDB": ["mongodb", "mongo db"],
  "Redis": ["redis"],
  "HTML": ["html", "html5"],
  "CSS": ["css", "css3"],
  "REST APIs": [
    "rest api",
    "rest apis",
    "restful api",
    "restful apis"
  ],
  "GraphQL": ["graphql"],
  "WebSockets": ["websocket", "websockets", "web socket"],
  "Push Notifications": [
    "push notification",
    "push notifications"
  ],
  "CI/CD": [
    "ci/cd",
    "continuous integration",
    "continuous delivery",
    "continuous deployment"
  ],
  "Git": ["git", "github", "gitlab", "version control"],
  "Docker": ["docker", "containerization"],
  "Kubernetes": ["kubernetes", "k8s"],
  "AWS": ["aws", "amazon web services"],
  "Azure": ["azure", "microsoft azure"],
  "GCP": ["gcp", "google cloud platform"],
  "Kafka": ["kafka", "apache kafka"],
  "Microservices": [
    "microservices",
    "microservice architecture"
  ],
  "Unit Testing": [
    "unit testing",
    "unit tests",
    "junit",
    "jest",
    "pytest",
    "xctest"
  ],
  "Integration Testing": [
    "integration testing",
    "integration tests"
  ],
  "Automated Testing": [
    "automated testing",
    "test automation"
  ],
  "CI Pipelines": ["ci pipeline", "ci pipelines"],
  "Swift Concurrency": [
    "swift concurrency",
    "async/await",
    "async await"
  ],
  "Concurrency": [
    "concurrency",
    "multithreading",
    "multi-threading"
  ],
  "Clean Architecture": ["clean architecture"],
  "MVC": ["mvc", "model view controller"],
  "MVP": [
    "model view presenter",
    "mvp architecture",
    "mvp pattern"
  ],
  "MVVM": ["mvvm", "model view viewmodel"],
  "VIPER": ["viper architecture", "viper"],
  "OOP": [
    "oop",
    "object oriented programming",
    "object-oriented programming"
  ],
  "Data Structures": [
    "data structures",
    "data structure",
    "dsa"
  ],
  "Algorithms": ["algorithms", "algorithm design"],
  "System Design": ["system design"],
  "Agile": ["agile", "scrum"],
  "Linux": ["linux", "unix", "unix/linux"],
  "Machine Learning": ["machine learning"],
  "Generative AI": ["generative ai", "genai", "gen ai"],
  "LLM": [
    "llm",
    "llms",
    "large language model",
    "large language models"
  ],
  "RAG": [
    "retrieval augmented generation",
    "retrieval-augmented generation"
  ],
  "Prompt Engineering": ["prompt engineering"],
  "AI Agents": ["ai agents", "agentic ai", "ai agent"],
  "LangChain": ["langchain"],
  "REST API Testing": ["rest api testing", "api testing"],
  "OAuth": ["oauth", "oauth2", "oauth 2.0"],
  "JWT": ["jwt", "json web token", "json web tokens"],
  "Firebase": ["firebase"],
  "Core Data": ["core data", "coredata"],
  "CocoaPods": ["cocoapods", "cocoa pods"],
  "Swift Package Manager": [
    "swift package manager",
    "spm"
  ],
  "Ktor": ["ktor"],
  "Retrofit": ["retrofit"],
  "Jetpack Compose": ["jetpack compose"],
  "Android SDK": ["android sdk"],
  "iOS Development": [
    "ios development",
    "ios developer",
    "ios application development"
  ],
  "macOS Development": [
    "macos development",
    "mac os development",
    "macos application"
  ],
  "Cross-platform Development": [
    "cross-platform development",
    "cross platform development"
  ],
  "WebRTC": ["webrtc"],
  "gRPC": ["grpc"],
  "Elasticsearch": ["elasticsearch", "elastic search"],
  "Terraform": ["terraform"],
  "Jenkins": ["jenkins"],
  "GitHub Actions": ["github actions"],
  "Jira": ["jira"],
  "Figma": ["figma"],
  "SDK Development": [
    "sdk development",
    "software development kit"
  ],
  "Crash Debugging": [
    "crash debugging",
    "crash analysis",
    "crash investigation"
  ],
  "REST Networking": ["rest networking", "http client"],
  "Web Development": ["web development"],
  "API Integration": [
    "api integration",
    "api integrations"
  ],
  "Object-Oriented Design": [
    "object-oriented design",
    "object oriented design"
  ],
  "Design Patterns": [
    "design patterns",
    "architectural patterns"
  ],
  "Xcode": ["xcode"],
  "Push SDK": ["push sdk", "push notifications sdk"],
  "Performance Optimization": [
    "performance optimization",
    "performance tuning"
  ],
  "Memory Management": [
    "memory management",
    "retain cycle",
    "retain cycles"
  ],
  "Web Services": ["web services"],
  "JSON": ["json"],
  "XML": ["xml"],
  "Networking": ["networking", "computer networks"],
  "Testing Frameworks": [
    "testing framework",
    "testing frameworks"
  ]
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(text) {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function containsTerm(text, term) {
  const escaped = escapeRegex(term.toLowerCase())
    .replace(/\s+/g, "\\s+");

  const pattern = new RegExp(
    `(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`,
    "i"
  );

  return pattern.test(text);
}

function detectSkills(text) {
  const normalized = normalizeText(text);

  return Object.entries(SKILLS)
    .filter(([, aliases]) =>
      aliases.some(alias => containsTerm(normalized, alias))
    )
    .map(([skill]) => skill);
}

async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer)
  });

  const pdf = await loadingTask.promise;
  const pages = [];

  try {
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();

      pages.push(
        content.items
          .map(item => item.str || "")
          .join(" ")
      );
    }
  } finally {
    await pdf.destroy();
  }

  return pages.join("\n").trim();
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
}

function setExtractionStatus(message, state) {
  extractionStatus.textContent = message;
  extractionStatus.dataset.state = state;
  extractionStatus.hidden = false;
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

function fillChips(list, skills) {
  list.replaceChildren();

  if (skills.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-chip";
    li.textContent = "None detected";
    list.appendChild(li);
    return;
  }

  skills.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    list.appendChild(li);
  });
}

function getScoreNote(score) {
  if (score >= 80) {
    return "Strong overlap among supported skills. Review any remaining requirements.";
  }

  if (score >= 60) {
    return "Some important skills overlap. Review the skills not detected below.";
  }

  return "Several supported job skills were not detected in your resume text.";
}

function renderReport(resumeSkills, requiredSkills) {
  const resumeSet = new Set(resumeSkills);
  const requiredSet = new Set(requiredSkills);

  const matched = requiredSkills.filter(
    skill => resumeSet.has(skill)
  );

  const missing = requiredSkills.filter(
    skill => !resumeSet.has(skill)
  );

  const other = resumeSkills.filter(
    skill => !requiredSet.has(skill)
  );

  const score = requiredSkills.length
    ? Math.round((matched.length / requiredSkills.length) * 100)
    : 0;

  fillChips(presentSkills, matched);
  fillChips(missingSkills, missing);
  fillChips(otherSkills, other);

  scoreValue.textContent = String(score);
  scoreBar.style.width = `${score}%`;

  scoreNote.textContent = getScoreNote(score);
  scoreNote.classList.toggle("good", score >= 80);
  scoreNote.classList.toggle("warn", score < 60);

  matchSummary.textContent =
    `${matched.length} of ${requiredSkills.length} recognized job skills matched.`;

  matchDetails.textContent =
    "This percentage is matched supported skills divided by all supported skills detected in the job description. Requirements outside the dictionary may not be counted.";

  matchedCount.textContent = String(matched.length);
  missingCount.textContent = String(missing.length);
  presentCount.textContent = String(matched.length);
  missingSkillCount.textContent = String(missing.length);
  skillCountBadge.textContent = `${requiredSkills.length} skills`;

  results.hidden = false;

  results.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

async function handleFile(file) {
  const thisAnalysis = ++analysisId;

  clearError();
  extractionStatus.hidden = true;
  results.hidden = true;

  if (!file) return;

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    showError("Please select a PDF resume.");
    return;
  }

  if (file.size === 0) {
    showError("This file is empty. Please select a valid PDF.");
    return;
  }

  if (file.size > MAX_MB * 1024 * 1024) {
    showError("The PDF exceeds the 5 MB limit.");
    return;
  }

  const description = jobDescription.value.trim();

  if (!description) {
    showError("Paste a job description before analyzing your resume.");
    jobDescription.focus();
    return;
  }

  const requiredSkills = detectSkills(description);

  if (requiredSkills.length === 0) {
    showError(
      "No supported technical skills were recognized in the job description. " +
      "Try explicit skills such as Swift, Java, SQL, Python, REST APIs, or AWS. " +
      "This does not mean the description has no requirements."
    );
    return;
  }

  fileName.textContent = file.name;
  fileSize.textContent = formatSize(file.size);
  fileRow.hidden = false;

  progress.hidden = false;

  setExtractionStatus(
    "Reading text from your PDF…",
    "warning"
  );

  try {
    const resumeText = await extractPdfText(file);

    if (thisAnalysis !== analysisId) return;

    if (resumeText.replace(/\s/g, "").length < 30) {
      throw new Error(
        "Very little readable text was found in this PDF. " +
        "It may be scanned or image-based. This version does not " +
        "include OCR; use a text-based PDF to continue."
      );
    }

    setExtractionStatus(
      `PDF text extracted successfully (${resumeText.length.toLocaleString()} characters).`,
      "success"
    );

    const resumeSkills = detectSkills(resumeText);

    if (resumeSkills.length === 0) {
      throw new Error(
        "PDF text was extracted, but no skills from the supported " +
        "dictionary were recognized. Your resume may use terms this " +
        "tool does not yet support."
      );
    }

    if (thisAnalysis !== analysisId) return;

    renderReport(resumeSkills, requiredSkills);
  } catch (error) {
    if (thisAnalysis !== analysisId) return;

    setExtractionStatus(
      error.message || "Could not extract text from this PDF.",
      "error"
    );

    console.error("Resume analysis failed:", error);

    showError(
      error.message ||
      "Could not analyze this PDF. Check your internet connection and browser console."
    );
  } finally {
    if (thisAnalysis === analysisId) {
      progress.hidden = true;
    }
  }
}

function reset() {
  analysisId++;

  fileInput.value = "";
  fileRow.hidden = true;
  progress.hidden = true;
  results.hidden = true;

  extractionStatus.hidden = true;
  extractionStatus.textContent = "";
  extractionStatus.removeAttribute("data-state");

  clearError();

  dropzone.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// Upload by click or keyboard.
dropzone.addEventListener("click", () => {
  fileInput.click();
});

dropzone.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    handleFile(fileInput.files[0]);
  }
});

// Drag-and-drop support.
["dragenter", "dragover"].forEach(eventName => {
  dropzone.addEventListener(eventName, event => {
    event.preventDefault();
    dropzone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach(eventName => {
  dropzone.addEventListener(eventName, event => {
    event.preventDefault();
    dropzone.classList.remove("dragover");
  });
});

dropzone.addEventListener("drop", event => {
  const file = event.dataTransfer?.files?.[0];

  if (file) {
    handleFile(file);
  }
});

removeBtn.addEventListener("click", reset);
resetBtn.addEventListener("click", reset);

// Dark/light theme.
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  themeToggle.setAttribute(
    "aria-label",
    theme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme"
  );
}

themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";

  try {
    localStorage.setItem("theme", next);
  } catch (_) {
    // The theme still works if local storage is unavailable.
  }

  applyTheme(next);
});
