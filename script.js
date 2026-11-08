(() => {
  "use strict";

  // ---------- Config ----------
  const MIN_PASSWORD_LENGTH = 6;
  const MAX_BIO_LENGTH = 200;
  const BIO_WARNING_THRESHOLD = 180;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // ---------- DOM references ----------
  const form = document.getElementById("registrationForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMessage = document.getElementById("successMessage");
  const bioCounter = document.getElementById("bioCounter");

  const fields = {
    name:     { input: document.getElementById("name"),     error: document.getElementById("nameError") },
    email:    { input: document.getElementById("email"),    error: document.getElementById("emailError") },
    password: { input: document.getElementById("password"), error: document.getElementById("passwordError") },
    bio:      { input: document.getElementById("bio"),      error: document.getElementById("bioError") },
  };

  const touched = { name: false, email: false, password: false, bio: false };

  // ---------- Validators ----------
  const validators = {
    name(value) {
      return value.trim() === "" ? "Name is required." : "";
    },
    email(value) {
      const v = value.trim();
      if (v === "") return "Email is required.";
      if (!EMAIL_PATTERN.test(v)) return "Please enter a valid email address (e.g. name@example.com).";
      return "";
    },
    password(value) {
      if (value === "") return "Password is required.";
      if (value.length < MIN_PASSWORD_LENGTH) {
        const remaining = MIN_PASSWORD_LENGTH - value.length;
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters (${remaining} more needed).`;
      }
      return "";
    },
    bio(value) {
      if (value.trim() === "") return "Bio is required.";
      if (value.length > MAX_BIO_LENGTH) return `Bio cannot exceed ${MAX_BIO_LENGTH} characters.`;
      return "";
    },
  };

  function showFieldState(key, errorText) {
    const { input, error } = fields[key];
    error.textContent = errorText;
    input.classList.toggle("invalid", errorText !== "");
    input.classList.toggle("valid", errorText === "" && input.value !== "");
    input.setAttribute("aria-invalid", errorText !== "" ? "true" : "false");
  }

  function updateBioCounter() {
    const length = fields.bio.input.value.length;
    bioCounter.textContent = `${length} / ${MAX_BIO_LENGTH} characters`;

    bioCounter.classList.remove("warning", "limit");
    if (length >= MAX_BIO_LENGTH) {
      bioCounter.classList.add("limit");
    } else if (length >= BIO_WARNING_THRESHOLD) {
      bioCounter.classList.add("warning");
    }

    if (length >= MAX_BIO_LENGTH) {
      fields.bio.error.textContent = `Character limit reached (${MAX_BIO_LENGTH}).`;
      fields.bio.error.className = "message warning";
    } else if (length >= BIO_WARNING_THRESHOLD) {
      fields.bio.error.textContent = `${MAX_BIO_LENGTH - length} characters remaining.`;
      fields.bio.error.className = "message warning";
    } else {
      fields.bio.error.className = "message error";
    }
  }

  function validateField(key) {
    const errorText = validators[key](fields[key].input.value);
    if (touched[key]) {
      if (key === "bio" && errorText === "") {
        showFieldState(key, "");
        updateBioCounter();
      } else {
        if (key === "bio") fields.bio.error.className = "message error";
        showFieldState(key, errorText);
      }
    }
    return errorText === "";
  }

  function isFormValid() {
    return Object.keys(validators).every(
      (key) => validators[key](fields[key].input.value) === ""
    );
  }

  function refreshSubmitButton() {
    submitBtn.disabled = !isFormValid();
  }

  Object.keys(fields).forEach((key) => {
    const { input } = fields[key];

    input.addEventListener("input", () => {
      touched[key] = true;
      successMessage.hidden = true; 
      if (key === "bio") updateBioCounter();
      validateField(key);
      refreshSubmitButton();
    });

    input.addEventListener("blur", () => {
      touched[key] = true;
      validateField(key);
      refreshSubmitButton();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    
    Object.keys(touched).forEach((key) => (touched[key] = true));
    const allValid = Object.keys(validators).map(validateField).every(Boolean);
    if (!allValid) {
      refreshSubmitButton();
      return;
    }

    const userName = fields.name.input.value.trim();
    successMessage.textContent = `Thanks, ${userName}! Your registration was submitted successfully.`;
    successMessage.hidden = false;

    // Reset the form to its initial state
    form.reset();
    Object.keys(touched).forEach((key) => {
      touched[key] = false;
      showFieldState(key, "");
      fields[key].input.classList.remove("valid", "invalid");
    });
    fields.bio.error.className = "message error";
    updateBioCounter();
    refreshSubmitButton();
  });

  // ---------- Initial state ----------
  updateBioCounter();
  refreshSubmitButton();
})();
