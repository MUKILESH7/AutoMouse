
// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const loginPassword = document.getElementById('loginPassword');
const signupPassword = document.getElementById('signupPassword');

// Toggle between login and signup forms
function toggleForm() {
  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
  }
}

// Password visibility toggle
function togglePasswordVisibility(passwordInput, toggleIcon) {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

// Form validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateName(name) {
  return name.trim().length >= 2;
}

// Show message function
function showMessage(form, message, type) {
  // Remove existing messages
  const existingMessage = form.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  // Insert after the first h3 element
  const h3 = form.querySelector('h3');
  h3.parentNode.insertBefore(messageDiv, h3.nextSibling);
  
  // Show message
  messageDiv.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// Login form submission
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = this.querySelector('input[name="email"]').value;
  const password = this.querySelector('input[name="password"]').value;
  
  // Validation
  if (!validateEmail(email)) {
    showMessage(this, 'Please enter a valid email address', 'error');
    return;
  }
  
  if (!validatePassword(password)) {
    showMessage(this, 'Password must be at least 6 characters long', 'error');
    return;
  }
  
  // Simulate login process
  showMessage(this, 'Logging in...', 'success');
  
  // Simulate API call delay
  setTimeout(() => {
    showMessage(this, 'Login successful! Redirecting...', 'success');
    
    // Redirect to main page after successful login
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }, 1500);
});

// Signup form submission
signupForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fullname = this.querySelector('input[name="fullname"]').value;
  const email = this.querySelector('input[name="email"]').value;
  const password = this.querySelector('input[name="password"]').value;
  
  // Validation
  if (!validateName(fullname)) {
    showMessage(this, 'Please enter your full name (at least 2 characters)', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    showMessage(this, 'Please enter a valid email address', 'error');
    return;
  }
  
  if (!validatePassword(password)) {
    showMessage(this, 'Password must be at least 6 characters long', 'error');
    return;
  }
  
  // Simulate signup process
  showMessage(this, 'Creating account...', 'success');
  
  // Simulate API call delay
  setTimeout(() => {
    showMessage(this, 'Account created successfully! Please log in.', 'success');
    
    // Switch to login form after successful signup
    setTimeout(() => {
      toggleForm();
    }, 2000);
  }, 1500);
});

// Password toggle event listeners
toggleLoginPassword.addEventListener('click', function() {
  togglePasswordVisibility(loginPassword, this);
});

toggleSignupPassword.addEventListener('click', function() {
  togglePasswordVisibility(signupPassword, this);
});

// Add loading state to buttons
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.textContent = 'Loading...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
  }
}

// Store original button text
document.querySelectorAll('button[type="submit"]').forEach(button => {
  button.dataset.originalText = button.textContent;
});

// Enhanced form submission with loading states
loginForm.addEventListener('submit', function(e) {
  const submitButton = this.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true);
  
  // Reset loading state after 3 seconds
  setTimeout(() => {
    setButtonLoading(submitButton, false);
  }, 3000);
});

signupForm.addEventListener('submit', function(e) {
  const submitButton = this.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true);
  
  // Reset loading state after 3 seconds
  setTimeout(() => {
    setButtonLoading(submitButton, false);
  }, 3000);
});

// Add smooth animations
document.addEventListener('DOMContentLoaded', function() {
  // Add fade-in animation to forms
  const forms = document.querySelectorAll('.form-container');
  forms.forEach((form, index) => {
    form.style.opacity = '0';
    form.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      form.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      form.style.opacity = '1';
      form.style.transform = 'translateY(0)';
    }, index * 200);
  });
  
  // Add hover effects to inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });
});

// Google OAuth simulation
function simulateGoogleAuth(type) {
  const message = type === 'login' ? 'Redirecting to Google...' : 'Redirecting to Google signup...';
  showMessage(
    type === 'login' ? loginForm : signupForm, 
    message, 
    'success'
  );
  
  // Simulate redirect delay
  setTimeout(() => {
    showMessage(
      type === 'login' ? loginForm : signupForm, 
      'Google authentication completed!', 
      'success'
    );
  }, 2000);
}

// Add Google button functionality
document.querySelectorAll('.google-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const isLogin = this.closest('#loginForm') !== null;
    simulateGoogleAuth(isLogin ? 'login' : 'signup');
  });
}); 