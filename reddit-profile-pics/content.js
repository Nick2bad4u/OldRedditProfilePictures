// Function to fetch new Reddit profile picture
async function fetchProfilePicture(username) {
  const response = await fetch(`https://www.reddit.com/user/${username}/about.json`);
  const data = await response.json();
  // Remove parameters from the URL
  const profilePictureUrl = data.data.icon_img.split('?')[0];
  return profilePictureUrl;
}

// Function to inject profile pictures into the comment section
async function injectProfilePictures() {
  const comments = document.querySelectorAll('.author');
  for (const comment of comments) {
    const username = comment.textContent;
    const profilePictureUrl = await fetchProfilePicture(username);
    if (profilePictureUrl) {
      const img = document.createElement('img');
      img.src = profilePictureUrl;
      img.classList.add('profile-picture');
      img.onerror = () => {
        img.style.display = 'none';
      };
      img.addEventListener('click', () => {
        window.open(profilePictureUrl, '_blank');
      });
      comment.parentNode.insertBefore(img, comment);
      
      // Create enlarged image element
      const enlargedImg = document.createElement('img');
      enlargedImg.src = profilePictureUrl;
      enlargedImg.classList.add('enlarged-profile-picture');
      document.body.appendChild(enlargedImg);
      
      // Show enlarged image on hover
      img.addEventListener('mouseover', () => {
        enlargedImg.style.display = 'block';
        const rect = img.getBoundingClientRect();
        enlargedImg.style.top = `${rect.top + window.scrollY + 20}px`;
        enlargedImg.style.left = `${rect.left + window.scrollX + 20}px`;
      });
      
      // Hide enlarged image when not hovering
      img.addEventListener('mouseout', () => {
        enlargedImg.style.display = 'none';
      });
    }
  }
}

// Run the function when the page loads
window.addEventListener('load', injectProfilePictures);

// Add CSS to style the images
const style = document.createElement('style');
style.textContent = `
  .profile-picture {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 5px;
    transition: transform 0.2s ease-in-out;
    position: relative;
    z-index: 1;
    cursor: pointer; /* Add cursor pointer for clickable images */
  }
  .enlarged-profile-picture {
    width: 150x; /* Increased size */
    height: 150px; /* Increased size */
    border-radius: 50%;
    position: absolute;
    display: none;
    z-index: 1000;
    pointer-events: none;
  }
`;
document.head.appendChild(style);
