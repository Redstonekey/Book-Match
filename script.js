const GOOGLE_BOOKS_API_KEY = 'AIzaSyBONoVdufQG2tS-QjRO3y4MSZ1FiI8S5F8v';

async function fetchBooks(query, apiKey) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Google Books API request failed: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching books from Google Books API:', error);
    return null;
  }
}

async function fetchBookById(bookId, apiKey) {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Google Books API (fetchBookById) request failed: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    return null;
  }
}

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
  const homeHtmlExploreMatchesHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Explore Matches');

  if (homeHtmlExploreMatchesHeading) {
    // Genre Item Clicks on home.html
    const genreSection = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Genres');
    if (genreSection) {
      const genreItemsParent = genreSection.nextElementSibling.querySelector('div.gap-8');
      if (genreItemsParent) {
        const genreItems = genreItemsParent.querySelectorAll('div.min-w-32');
        genreItems.forEach(item => {
          item.addEventListener('click', () => {
            const genreNameElement = item.querySelector('p');
            if (genreNameElement) {
              const genreName = genreNameElement.textContent.trim();
              window.location.href = `form.html?genre=${encodeURIComponent(genreName)}`;
            } else {
              window.location.href = 'form.html'; // Fallback if genre name not found
            }
          });
        });
      }
    }

    // Dynamically load "Explore Matches"
    if (homeHtmlExploreMatchesHeading) {
      const exploreMatchesContainerParent = homeHtmlExploreMatchesHeading.nextElementSibling; 
      if (exploreMatchesContainerParent) {
        const exploreMatchesContainer = exploreMatchesContainerParent.querySelector('div.flex.items-stretch.p-4.gap-3');
        
        if (exploreMatchesContainer) {
          (async () => {
            const query = "highly acclaimed novels"; 
            const data = await fetchBooks(query, GOOGLE_BOOKS_API_KEY);

            if (!data || !data.items || data.items.length === 0) {
              console.log("Could not fetch explore matches or no books found.");
              exploreMatchesContainer.innerHTML = '<p class="text-[#545e92]">No books found for "Explore Matches" at the moment.</p>';
              return;
            }

            exploreMatchesContainer.innerHTML = ''; 

            data.items.slice(0, 5).forEach(book => {
              const id = book.id;
              const title = book.volumeInfo.title || 'No Title';
              const authors = book.volumeInfo.authors;
              const thumbnail = book.volumeInfo.imageLinks?.thumbnail || '';
              const categories = book.volumeInfo.categories;
              
              const subtitle = categories ? categories[0] : (authors ? authors.join(', ') : 'No Category/Author');

              const cardHTML = `
                <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 book-card-dynamic cursor-pointer">
                  <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col" style="background-image: url('${thumbnail}');"></div>
                  <div>
                    <p class="text-[#0f111a] text-base font-medium leading-normal">${title}</p>
                    <p class="text-[#545e92] text-sm font-normal leading-normal">${subtitle}</p>
                  </div>
                </div>
              `;
              exploreMatchesContainer.insertAdjacentHTML('beforeend', cardHTML);
              
              const newCard = exploreMatchesContainer.lastElementChild;
              if (newCard) {
                newCard.addEventListener('click', () => {
                  window.location.href = `book-details.html?id=${id}`;
                });
              }
            });
          })();
        } else {
          console.error("Explore Matches card container (div.flex.items-stretch.p-4.gap-3) not found.");
        }
      } else {
         console.error("Parent of Explore Matches container not found.");
      }
    }

    // Dynamically load "Popular Picks"
    const popularPicksHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Popular Picks');
    if (popularPicksHeading) {
      const popularPicksContainerParent = popularPicksHeading.nextElementSibling;
      if (popularPicksContainerParent) {
        const popularPicksContainer = popularPicksContainerParent.querySelector('div.flex.items-stretch.p-4.gap-3');
        
        if (popularPicksContainer) {
          (async () => {
            const query = "top rated books"; 
            const data = await fetchBooks(query, GOOGLE_BOOKS_API_KEY);

            if (!data || !data.items || data.items.length === 0) {
              console.log("Could not fetch popular picks or no books found.");
              popularPicksContainer.innerHTML = '<p class="text-[#545e92]">No popular books found at the moment.</p>';
              return;
            }

            popularPicksContainer.innerHTML = ''; 

            data.items.slice(0, 5).forEach(book => {
              const id = book.id;
              const title = book.volumeInfo.title || 'No Title';
              const authors = book.volumeInfo.authors;
              const thumbnail = book.volumeInfo.imageLinks?.thumbnail || '';
              const categories = book.volumeInfo.categories;
              
              const subtitle = categories ? categories[0] : (authors ? authors.join(', ') : 'No Category/Author');

              const cardHTML = `
                <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 book-card-dynamic cursor-pointer">
                  <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col" style="background-image: url('${thumbnail}');"></div>
                  <div>
                    <p class="text-[#0f111a] text-base font-medium leading-normal">${title}</p>
                    <p class="text-[#545e92] text-sm font-normal leading-normal">${subtitle}</p>
                  </div>
                </div>
              `;
              popularPicksContainer.insertAdjacentHTML('beforeend', cardHTML);
              
              const newCard = popularPicksContainer.lastElementChild;
              if (newCard) {
                newCard.addEventListener('click', () => {
                  window.location.href = `book-details.html?id=${id}`;
                });
              }
            });
          })();
        } else {
          console.error("Popular picks card container (div.flex.items-stretch.p-4.gap-3) not found.");
        }
      } else {
         console.error("Parent of popular picks container not found.");
      }
    }
  }

  // Check if we are on book-details.html
  const bookDetailsPageHeadingElement = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Book Details');

  if (bookDetailsPageHeadingElement) {
    const params = new URLSearchParams(window.location.search);
    const currentBookId = params.get('id'); 

    if (currentBookId) {
      (async () => {
        const bookData = await fetchBookById(currentBookId, GOOGLE_BOOKS_API_KEY);
        const mainContentArea = document.querySelector('div.relative.flex.size-full > div:first-child'); 

        if (!bookData) {
          console.error(`Book details not found for ID: ${currentBookId}`);
          if (mainContentArea) {
            mainContentArea.innerHTML = '<p class="p-4 text-center text-red-500">Book details not found.</p>';
          }
          return;
        }

        const volumeInfo = bookData.volumeInfo || {};
        
        const coverImageDiv = document.querySelector('div.min-h-80');
        if (coverImageDiv) {
          const imageUrl = volumeInfo.imageLinks?.large || volumeInfo.imageLinks?.medium || volumeInfo.imageLinks?.thumbnail || '';
          coverImageDiv.style.backgroundImage = `url('${imageUrl}')`;
        }

        const titleContainer = document.querySelector('div.flex.flex-wrap.gap-x-8.gap-y-6.p-4');
        if (titleContainer) {
          const existingH1 = titleContainer.querySelector('h1.book-title-dynamic');
          if (existingH1) existingH1.remove(); 

          const titleH1 = document.createElement('h1');
          titleH1.className = 'book-title-dynamic text-[#0f111a] text-3xl font-bold leading-tight tracking-[-0.02em] w-full mb-2'; 
          titleH1.textContent = volumeInfo.title || 'Title Not Available';
          titleContainer.prepend(titleH1);
        }
        
        const ratingValueElement = titleContainer?.querySelector('p.text-4xl');
        if (ratingValueElement) {
          ratingValueElement.textContent = volumeInfo.averageRating || 'N/A';
        }
        const reviewsCountElement = titleContainer?.querySelector('p.text-base.font-normal.leading-normal'); 
        if (reviewsCountElement && volumeInfo.ratingsCount !== undefined) {
          reviewsCountElement.textContent = `${volumeInfo.ratingsCount} reviews`;
        } else if (reviewsCountElement) {
          reviewsCountElement.textContent = 'No reviews';
        }

        const genreTagsContainer = document.querySelector('div.flex.gap-3.p-3.flex-wrap.pr-4');
        if (genreTagsContainer) {
          genreTagsContainer.innerHTML = ''; 
          const categories = volumeInfo.categories || [];
          if (categories.length > 0) {
            categories.forEach(category => {
              const tagHTML = `<div class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#e8eaf2] pl-4 pr-4"><p class="text-[#0f111a] text-sm font-medium leading-normal">${category}</p></div>`;
              genreTagsContainer.insertAdjacentHTML('beforeend', tagHTML);
            });
          } else {
            genreTagsContainer.innerHTML = '<p class="text-[#545e92]">No genres listed</p>';
          }
        }

        const descriptionElement = document.querySelector('p.text-\\[\\#0f111a\\].text-base.font-normal.leading-normal.pb-3.pt-1.px-4');
        if (descriptionElement) {
          descriptionElement.textContent = volumeInfo.description || 'No description available.';
        }

        const similarBooksHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Similar Books');
        if (similarBooksHeading) {
            const similarBooksContainerParent = similarBooksHeading.nextElementSibling; 
            if (similarBooksContainerParent) {
                const similarBooksContainer = similarBooksContainerParent.querySelector('div.flex.items-stretch.p-4.gap-3');
                if (similarBooksContainer) {
                    let similarQuery = '';
                    if (volumeInfo.categories && volumeInfo.categories.length > 0) {
                        similarQuery = `subject:${volumeInfo.categories[0]}`;
                    } else if (volumeInfo.authors && volumeInfo.authors.length > 0) {
                        similarQuery = `inauthor:${volumeInfo.authors[0]}`;
                    }

                    if (similarQuery) {
                        const similarBooksData = await fetchBooks(similarQuery, GOOGLE_BOOKS_API_KEY);
                        similarBooksContainer.innerHTML = ''; 

                        if (similarBooksData && similarBooksData.items && similarBooksData.items.length > 0) {
                            let count = 0;
                            for (const book of similarBooksData.items) {
                                if (book.id === currentBookId) continue; 
                                if (count >= 5) break; 

                                const id = book.id;
                                const title = book.volumeInfo.title || 'No Title';
                                const thumbnail = book.volumeInfo.imageLinks?.thumbnail || '';

                                const cardHTML = `
                                    <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 similar-book-card cursor-pointer">
                                      <div class="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl flex flex-col" style="background-image: url('${thumbnail}');"></div>
                                      <p class="text-[#0f111a] text-base font-medium leading-normal">${title}</p>
                                    </div>
                                  `;
                                similarBooksContainer.insertAdjacentHTML('beforeend', cardHTML);
                                
                                const newCard = similarBooksContainer.lastElementChild;
                                if (newCard) {
                                    newCard.addEventListener('click', () => {
                                        window.location.href = `book-details.html?id=${id}`;
                                    });
                                }
                                count++;
                            }
                            if (count === 0) {
                                similarBooksContainer.innerHTML = '<p class="text-[#545e92]">No other similar books found.</p>';
                            }
                        } else {
                            similarBooksContainer.innerHTML = '<p class="text-[#545e92]">No similar books found.</p>';
                        }
                    } else {
                        similarBooksContainer.innerHTML = '<p class="text-[#545e92]">Not enough information to find similar books.</p>';
                    }
                } else {
                    console.error("Similar books card container not found.");
                }
            } else {
                console.error("Parent of Similar books container not found.");
            }
        }
      })();
    } else {
      const mainContentArea = document.querySelector('div.relative.flex.size-full > div:first-child');
      if (mainContentArea && !mainContentArea.querySelector('.book-title-dynamic')) { 
         mainContentArea.innerHTML = '<p class="p-4 text-center text-red-500">No book ID provided in the URL.</p>';
      }
      console.log("No book ID found in URL for book-details page.");
    }

    const headerDiv = document.querySelector('div.flex.items-center.bg-\\[\\#f9f9fb\\].p-4.pb-2.justify-between');
    if (headerDiv) {
      const backArrow = headerDiv.querySelector('div[data-icon="ArrowLeft"]');
      if (backArrow) {
        backArrow.addEventListener('click', () => {
          history.back();
        });
      }
    }

    const shareButton = document.querySelector('button svg[data-icon="Share"]');
    if (shareButton) {
      shareButton.closest('button').addEventListener('click', () => {
        alert('Share functionality to be implemented');
      });
    }

    const readNowButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Read Now');
    if (readNowButton) {
      readNowButton.closest('button').addEventListener('click', () => {
        alert('Read Now functionality to be implemented');
      });
    }

    const reviewInteractionSections = document.querySelectorAll('div.flex.gap-9.text-\\[\\#545e92\\]');
    reviewInteractionSections.forEach(section => {
      const buttons = section.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          if (button.classList.contains('text-[#3e58da]')) {
            button.classList.remove('text-[#3e58da]');
            button.classList.add('text-[#545e92]');
          } else {
            const otherButton = button.parentElement.querySelector('button.text-\\[\\#3e58da\\]'); 
            if (otherButton) {
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
    
    const writeReviewButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Write a Review');
    if (writeReviewButton) {
      writeReviewButton.closest('button').addEventListener('click', () => {
        alert('Write a Review functionality to be implemented');
      });
    }
  }

  // Check if we are on form.html
  const formPageHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'What genres do you enjoy?');
  if (formPageHeading) {
    const genreTagsContainer = document.querySelector('div.flex.gap-3.p-3.flex-wrap.pr-4');
    const allGenreTagsOnPage = genreTagsContainer ? Array.from(genreTagsContainer.querySelectorAll('div.flex.h-8.shrink-0')) : [];

    // Pre-select genre if passed in URL
    const params = new URLSearchParams(window.location.search);
    const genreFromUrl = params.get('genre');
    if (genreFromUrl) {
      const decodedGenre = decodeURIComponent(genreFromUrl);
      const tagToSelect = allGenreTagsOnPage.find(tag => tag.querySelector('p')?.textContent.trim() === decodedGenre);
      if (tagToSelect) {
        // Apply selected styles directly
        tagToSelect.classList.remove('bg-[#e8eaf2]');
        tagToSelect.classList.add('bg-[#3e58da]');
        const pElement = tagToSelect.querySelector('p');
        if (pElement) {
          pElement.classList.remove('text-[#0f111a]');
          pElement.classList.add('text-white');
        }
      }
    }

    // Genre Tag Click Handler (selection/deselection)
    if (genreTagsContainer) {
      allGenreTagsOnPage.forEach(tag => {
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

    // "Next" Button Logic
    const nextButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Next');
    if (nextButton) {
      nextButton.closest('button').addEventListener('click', () => {
        const selectedTags = allGenreTagsOnPage.filter(tag => tag.classList.contains('bg-[#3e58da]'));
        const selectedGenreNames = selectedTags.map(tag => tag.querySelector('p')?.textContent.trim()).filter(name => name);

        if (selectedGenreNames.length > 0) {
          const constructedQuery = selectedGenreNames.map(name => `subject:"${name}"`).join(' '); // Use "name" for better accuracy with multi-word genres
          alert(`Query for API: ${constructedQuery}`);
        } else {
          alert('Please select at least one genre.');
        }
      });
    }
  }

  // Check if we are on profile.html
  const profilePageHeading = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'Profile');
  if (profilePageHeading) {
    const headerDiv = document.querySelector('div.flex.items-center.bg-\\[\\#f9f9fb\\].p-4.pb-2.justify-between');
    if (headerDiv) {
      const backArrow = headerDiv.querySelector('div[data-icon="ArrowLeft"]');
      if (backArrow) {
        backArrow.addEventListener('click', () => {
          history.back();
        });
      }
    }

    const updateAccountSection = Array.from(document.querySelectorAll('div.flex.items-center.gap-4.bg-\\[\\#f9f9fb\\].px-4.min-h-14.justify-between'))
      .find(div => div.querySelector('p')?.textContent.trim() === 'Update Account');
    if (updateAccountSection) {
      updateAccountSection.addEventListener('click', () => {
        alert('Update account functionality to be implemented');
      });
    }
    
    const toggleSwitches = document.querySelectorAll('label.relative.flex.h-\\[31px\\].w-\\[51px\\].cursor-pointer');
    toggleSwitches.forEach(label => {
      const checkbox = label.querySelector('input[type="checkbox"]');
      label.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }

        if (checkbox && checkbox.checked) {
          label.classList.remove('bg-[#e8eaf2]');
          label.classList.add('bg-[#3e58da]');
        } else {
          label.classList.remove('bg-[#3e58da]');
          label.classList.add('bg-[#e8eaf2]');
        }
      });
    });

    const logoutButton = Array.from(document.querySelectorAll('button span.truncate')).find(span => span.textContent.trim() === 'Logout');
    if (logoutButton) {
      logoutButton.closest('button').addEventListener('click', () => {
        alert('Logout functionality to be implemented');
        window.location.href = 'home.html';
      });
    }
  }
});
