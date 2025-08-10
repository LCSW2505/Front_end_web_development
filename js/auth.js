/*Charan Devaraju
c0943138
Project 2*/

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// the  pattern used  to validate  the strong passwords like it should have minimum 8 characters, uppercase, lowercase, number, symbol
const PASS_RE  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// the function used to show the validation message and update input border color
function showValidation(el, ok, msg)
{
  const p = el.nextElementSibling; 
  if(ok)
  {
    el.style.borderColor = 'green'; // green border for valid
    if(p) p.textContent = msg || 'Looks good';
  } 
  else 
  {
    el.style.borderColor = 'var(--danger)'; // red border for invalid
    if(p) p.textContent = msg || 'Invalid';
  }
}

// handles registration form submit
async function handleRegister(e)
{
  e.preventDefault();
  const form = e.target;
  const username = form.querySelector('[name=username]').value.trim();
  const email = form.querySelector('[name=email]').value.trim();
  const password = form.querySelector('[name=password]').value;
  const confirm = form.querySelector('[name=confirm]').value;

  // basic validation checks, show errors if invalid
  if(username.length < 3){ showValidation(form.querySelector('[name=username]'), false, 'Minimum 3 chars'); return; }
  if(!EMAIL_RE.test(email)){ showValidation(form.querySelector('[name=email]'), false, 'Invalid email'); return; }
  if(!PASS_RE.test(password)){ showValidation(form.querySelector('[name=password]'), false, 'Password must be 8+ chars, upper, lower, number, symbol'); return; }
  if(password !== confirm){ showValidation(form.querySelector('[name=confirm]'), false, 'Passwords must match'); return; }

  const hashed = await hashText(password); // hash password for security
  const usersRaw = localStorage.getItem('stationery_users') || '[]'; // get users from localStorage
  const users = JSON.parse(usersRaw);

  // checks if the email already registered
  if(users.find(u=>u.email === email))
  { 
    flashMessage('Email already registered', 'warn'); 
    return; 
  }

  // adds a new user to the list and save
  users.push({username:escapeHTML(username), email, password:hashed, created:Date.now()});
  localStorage.setItem('stationery_users', JSON.stringify(users));

  flashMessage('Registration successful — you can now log in', 'success');
  form.reset(); 
}

// handles the login form submit
async function handleLogin(e)
{
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('[name=email]').value.trim();
  const password = form.querySelector('[name=password]').value;
  const remember = form.querySelector('[name=remember]').checked;

  const usersRaw = localStorage.getItem('stationery_users') || '[]';
  const users = JSON.parse(usersRaw);
  const hashed = await hashText(password); 

  // find matching user with email and hashed password
  const user = users.find(u=>u.email===email && u.password===hashed);
  if(!user)
  { 
    flashMessage('Invalid credentials', 'warn'); 
    return; 
  }

  // creates a session for logged in user
  createSession({username: user.username, email: user.email});

  // save email locally if "remember me" checked
  if(remember) localStorage.setItem('stationery_lastuser', email);

  flashMessage('Logged in', 'success');
  // redirect to homepage after short delay
  setTimeout(()=> window.location.href = 'index.html', 600);
}

// run after page loads
document.addEventListener('DOMContentLoaded', ()=>{
  // attach submit handler to registration form if it exists
  const reg = document.getElementById('register-form');
  if(reg) reg.addEventListener('submit', handleRegister);

  // attach submit handler to login form if it exists
  const login = document.getElementById('login-form');
  if(login) login.addEventListener('submit', handleLogin);

  // prefill email input with last user email if remembered
  const last = localStorage.getItem('stationery_lastuser');
  if(last)
  {
    const le = document.querySelector('#login-form [name=email]');
    if(le) le.value = last;
  }

  // generate a  CSRF token for form security
  generateCSRF();
});
