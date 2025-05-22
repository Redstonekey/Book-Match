document.addEventListener('DOMContentLoaded', () => {
  const navbars = document.querySelectorAll('.navbar');

  navbars.forEach(navbar => {
    // Home/For You (House Icon)
    const homeLink = navbar.querySelector('a[href="#"] svg[data-icon="House"]');
    if (homeLink) {
      homeLink.closest('a').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'home.html';
      });
    }

    // Explore/Search (MagnifyingGlass Icon)
    const exploreLink = navbar.querySelector('a[href="#"] svg[data-icon="MagnifyingGlass"]');
    if (exploreLink) {
      exploreLink.closest('a').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'form.html';
      });
    }

    // Settings (Gear Icon)
    const settingsLink = navbar.querySelector('a[href="#"] svg[data-icon="Gear"]');
    if (settingsLink) {
      settingsLink.closest('a').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'profile.html';
      });
    }

    // Profile (User Icon) - Specific to home.html
    const profileLink = navbar.querySelector('a[href="#"] svg[data-icon="User"]');
    if (profileLink) {
      profileLink.closest('a').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'profile.html';
      });
    }

    // Library/Bookmark (Bookmark Icon) - Specific to book-details.html
    const libraryLink = navbar.querySelector('a[href="#"] svg[data-icon="Bookmark"]');
    if (libraryLink) {
      libraryLink.closest('a').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Library/Bookmark icon clicked (no-op for now)');
      });
    }
  });

  // Check if we are on home.html by looking for a unique element
  const exploreMatchesHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Explore Matches');

  if (exploreMatchesHeading) {
    // Book Card Clicks
    const bookCardContainers = document.querySelectorAll('div.overflow-y-auto div.gap-3 div.min-w-40');
    bookCardContainers.forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = 'book-details.html';
      });
    });

    // Genre Item Clicks
    const genreSection = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Genres');
    if (genreSection) {
      const genreItemsParent = genreSection.nextElementSibling.querySelector('div.gap-8');
      if (genreItemsParent) {
        const genreItems = genreItemsParent.querySelectorAll('div.min-w-32');
        genreItems.forEach(item => {
          item.addEventListener('click', () => {
            window.location.href = 'form.html';
          });
        });
      }
    }
  }

  // Check if we are on book-details.html
  const bookDetailsHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Book Details');

  if (bookDetailsHeading) {
    // Back Arrow Navigation
    const headerDiv = document.querySelector('div.flex.items-center.bg-\\[\\#f9f9fb\\].p-4.pb-2.justify-between');
    if (headerDiv) {
      const backArrow = headerDiv.querySelector('div[data-icon="ArrowLeft"]');
      if (backArrow) {
        backArrow.addEventListener('click', () => {
          history.back();
        });
      }
    }

    // Share Icon
    const shareButton = document.querySelector('button svg[data-icon="Share"]');
    if (shareButton) {
      shareButton.closest('button').addEventListener('click', () => {
        alert('Share functionality to be implemented');
      });
    }

    // "Read Now" Button
    const readNowButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Read Now');
    if (readNowButton) {
      readNowButton.closest('button').addEventListener('click', () => {
        alert('Read Now functionality to be implemented');
      });
    }

    // Thumbs Up/Down Buttons for Reviews
    const reviewInteractionSections = document.querySelectorAll('div.flex.gap-9.text-\\[\\#545e92\\]');
    reviewInteractionSections.forEach(section => {
      const buttons = section.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          // Toggle active state visual
          if (button.classList.contains('text-[#3e58da]')) {
            button.classList.remove('text-[#3e58da]');
            button.classList.add('text-[#545e92]');
          } else {
            // Remove from other button in the pair if selected
            const otherButton = button.parentElement.querySelector('button:not(#' + button.id + ')'); // Basic way to select the sibling
            if (otherButton && otherButton.classList.contains('text-[#3e58da]')) {
                otherButton.classList.remove('text-[#3e58da]');
                otherButton.classList.add('text-[#545e92]');
            }
            button.classList.remove('text-[#545e92]');
            button.classList.add('text-[#3e58da]');
          }

          const svgIcon = button.querySelector('svg');
          if (svgIcon) {
            const iconType = svgIcon.getAttribute('data-icon');
            if (iconType === 'ThumbsUp') {
              alert('Liked review');
            } else if (iconType === 'ThumbsDown') {
              alert('Disliked review');
            }
          }
        });
      });
    });
    
    // "Write a Review" Button
    const writeReviewButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Write a Review');
    if (writeReviewButton) {
      writeReviewButton.closest('button').addEventListener('click', () => {
        alert('Write a Review functionality to be implemented');
      });
    }

    // Similar Book Card Clicks
    const similarBooksHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Similar Books');
    if (similarBooksHeading) {
      const similarBooksContainer = similarBooksHeading.nextElementSibling; 
      if (similarBooksContainer) {
        const similarBookCards = similarBooksContainer.querySelectorAll('div.min-w-40');
        similarBookCards.forEach(card => {
          card.addEventListener('click', () => {
            window.location.href = 'book-details.html';
          });
        });
      }
    }
  }

  // Check if we are on form.html
  const formHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'What genres do you enjoy?');
  if (formHeading) {
    // Genre Tag Selection
    const genreTagsContainer = document.querySelector('div.flex.gap-3.p-3.flex-wrap.pr-4');
    if (genreTagsContainer) {
      const genreTags = genreTagsContainer.querySelectorAll('div.flex.h-8.shrink-0'); 
      genreTags.forEach(tag => {
        const paragraph = tag.querySelector('p');
        tag.addEventListener('click', () => {
          const isSelected = tag.classList.contains('bg-[#3e58da]');
          if (isSelected) {
            tag.classList.remove('bg-[#3e58da]');
            tag.classList.add('bg-[#e8eaf2]');
            if (paragraph) {
              paragraph.classList.remove('text-white');
              paragraph.classList.add('text-[#0f111a]');
            }
          } else {
            tag.classList.remove('bg-[#e8eaf2]');
            tag.classList.add('bg-[#3e58da]');
            if (paragraph) {
              paragraph.classList.remove('text-[#0f111a]');
              paragraph.classList.add('text-white');
            }
          }
        });
      });
    }

    // "Next" Button
    const nextButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Next');
    if (nextButton) {
      nextButton.closest('button').addEventListener('click', () => {
        alert('Navigating to next step of the form');
      });
    }
  }

  // Check if we are on profile.html
  const profilePageHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Profile');
  if (profilePageHeading) {
    // Back Arrow Navigation
    const headerDiv = document.querySelector('div.flex.items-center.bg-\\[\\#f9f9fb\\].p-4.pb-2.justify-between');
    if (headerDiv) {
      const backArrow = headerDiv.querySelector('div[data-icon="ArrowLeft"]');
      if (backArrow) {
        backArrow.addEventListener('click', () => {
          history.back();
        });
      }
    }

    // "Update Account" Arrow
    const updateAccountSection = Array.from(document.querySelectorAll('div.flex.items-center.gap-4.bg-\\[\\#f9f9fb\\].px-4.min-h-14.justify-between'))
      .find(div => div.querySelector('p')?.textContent.trim() === 'Update Account');
    if (updateAccountSection) {
      updateAccountSection.addEventListener('click', () => {
        alert('Update account functionality to be implemented');
      });
    }
    
    // Notification Preference Toggle Switches
    const toggleSwitches = document.querySelectorAll('label.relative.flex.h-\\[31px\\].w-\\[51px\\].cursor-pointer');
    toggleSwitches.forEach(label => {
      const checkbox = label.querySelector('input[type="checkbox"]');
      label.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default label behavior that might interfere
        
        // Toggle checkbox state
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }

        // Toggle visual state based on a class or checkbox state
        if (checkbox && checkbox.checked) {
          label.classList.remove('bg-[#e8eaf2]');
          label.classList.add('bg-[#3e58da]');
          // If there's a specific class for 'on' state that moves the inner circle, add it.
          // label.classList.add('switch-active'); 
        } else {
          label.classList.remove('bg-[#3e58da]');
          label.classList.add('bg-[#e8eaf2]');
          // Remove the 'on' state class
          // label.classList.remove('switch-active');
        }
      });
    });

    // "Logout" Button
    const logoutButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Logout');
    if (logoutButton) {
      logoutButton.closest('button').addEventListener('click', () => {
        alert('Logout functionality to be implemented');
        window.location.href = 'home.html';
      });
    }
  }
});
