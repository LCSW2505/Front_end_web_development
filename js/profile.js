/*Charan Devaraju
c0943138
Project 2*/

// Waiting for the page to load before running this code
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profile-form');
  if (!form) return; // If form doesn't exist, stop here

  // Get the saved preferences from localStorage or use empty object
  const prefs = JSON.parse(localStorage.getItem('stationery_prefs') || '{}');

  // Fill the form fields with the saved preferences (if any)
  form.querySelector('[name=firstname]').value = prefs.firstname || '';
  form.querySelector('[name=lastname]').value = prefs.lastname || '';
  form.querySelector('[name=nickname]').value = prefs.nickname || '';
  form.querySelector('[name=phone]').value = prefs.phone || '';
  form.querySelector('[name=email]').value = prefs.email || '';
  form.querySelector('[name=dob]').value = prefs.dob || '';

  // Show the avatar preview if saved in prefs
  const preview = document.getElementById('avatar-preview');
  if (prefs.avatar) 
  {
    preview.src = prefs.avatar;
  }

  // When the form is submitted
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload

    // Get the values entered by the user, trimming extra spaces
    const firstname = form.querySelector('[name=firstname]').value.trim();
    const lastname = form.querySelector('[name=lastname]').value.trim();
    const nickname = form.querySelector('[name=nickname]').value.trim();
    const phone = form.querySelector('[name=phone]').value.trim();
    const email = form.querySelector('[name=email]').value.trim();
    const dob = form.querySelector('[name=dob]').value;

    // Basic validation: check first and last names length
    if (firstname.length < 2 || lastname.length < 2) 
    {
      flashMessage('Please enter valid first and last names', 'warn');
      return; 
    }
    if (!email.includes('@')) 
    {
      flashMessage('Please enter a valid email address', 'warn');
      return;
    }

    // Prepare the new preferences object with sanitized input
    const newPrefs = {
      firstname: escapeHTML(firstname),
      lastname: escapeHTML(lastname),
      nickname: escapeHTML(nickname),
      phone: escapeHTML(phone),
      email: escapeHTML(email),
      dob: dob,
      avatar: prefs.avatar || '' // Keep existing avatar or empty string
    };

    // Save the new preferences to localStorage
    localStorage.setItem('stationery_prefs', JSON.stringify(newPrefs));
    flashMessage('Profile updated', 'success'); 
  });

  // Handle the avatar image upload and preview
  const avatarInput = document.getElementById('avatar-input');
  if (avatarInput)
     {
    avatarInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return; // If no file selected, do nothing
      const reader = new FileReader();
      reader.onload = function (ev) 
      {
        preview.src = ev.target.result; // Show the selected image preview
        prefs.avatar = ev.target.result; 
        localStorage.setItem('stationery_prefs', JSON.stringify(prefs)); // Save to localStorage
      };
      reader.readAsDataURL(f); 
    });
  }
});
