document.getElementById('searchForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get the character name from the input.
      const characterName = document.getElementById('characterName').value.trim();
      const resultDiv = document.getElementById('result');
      const errorDiv = document.getElementById('error');
      
      // Clear previous results and error messages.
      resultDiv.innerHTML = '';
      errorDiv.innerText = '';

      if (!characterName) {
        errorDiv.innerText = 'Please enter a character name.';
        return;
      }

      // Build the API URL using the filter query param
      const apiUrl = `https://kitsu.io/api/edge/characters?filter[name]=${encodeURIComponent(characterName)}`;
      const quoteUrl = `https://api.animechan.io/v1/quotes/random?character=${encodeURIComponent(characterName)}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Check if data was returned
          if (data.data && data.data.length > 0) {
            // Pick the first matched character
            const character = data.data[0];
            let imageUrl = '';
            
            // Depending on the API response, the image information may be stored inside the attributes.
            if (character.attributes && character.attributes.image) {
              // Try to fetch the best available image URL.
              imageUrl = character.attributes.image.original || character.attributes.image.large || "";
            }

            if (imageUrl) {
              const img = document.createElement('img');
              img.src = imageUrl;
              // Use character's name as alternate text if available.
              img.alt = character.attributes.name || 'Anime Character';
              resultDiv.appendChild(img);
            } else {
              errorDiv.innerText = 'Image not available for this character.';
            }
          } else {
            errorDiv.innerText = 'No character found. Try another name.';
          }

          if (quoteUrl) {
            fetch(quoteUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data); //entire responce for debugging

                const quoteText = data.data.content;
                const quote = document.createElement('p');
                quote.innerText = quoteText;
                resultDiv.appendChild(quote);
            })
            .catch(error => {
                console.error('Error fetching quote:', error);
                errorDiv.innerText = 'Oops! no quote found.';
            });
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          errorDiv.innerText = 'Are you sure that character exists?';
        });
});