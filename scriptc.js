document.addEventListener('DOMContentLoaded', () => {
    const modelGrid = document.querySelector('.model-grid');
    const modelViewer = document.getElementById('model-viewer');
    const closeViewer = document.getElementById('close-viewer');
    const modelViewerElement = modelViewer.querySelector('model-viewer');
    const spinner = document.getElementById('spinner');
    const categoryButtons = document.querySelectorAll('.button');

    const jsonUrl = 'https://raw.githubusercontent.com/Msciciel55/katalog.vermis/refs/heads/main/assets/dane/ciesla.json';
    
    let models = [];

    async function fetchModels() {
        try {
            const response = await fetch(jsonUrl);
            models = await response.json();
            displayModels(models);
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    }

    function displayModels(modelsToDisplay) {
        modelGrid.innerHTML = '';
        modelsToDisplay.forEach(model => {
            const card = document.createElement('div');
            card.classList.add('model-card');
            card.setAttribute('data-model', model.model);

            const img = document.createElement('img');
            img.src = model.thumbnail;
            img.alt = model.title;

            const title = document.createElement('h2');
            title.textContent = model.title;

            card.appendChild(img);
            card.appendChild(title);
            modelGrid.appendChild(card);

            card.addEventListener('click', () => {
                document.getElementById('model-title').textContent = model.title;
                document.getElementById('model-description').textContent = model.description;
                spinner.style.display = 'block'; // Pokaż spinner

                // Najpierw usuń poprzedni model
                modelViewerElement.removeAttribute('src');

                // Dodaj krótkie opóźnienie, aby przeglądarka miała czas na wyczyszczenie
                setTimeout(() => {
                    modelViewerElement.setAttribute('src', model.model); // Ustaw nowy model
                }, 50); // Opóźnienie 50 ms

                modelViewer.style.display = 'flex'; // Pokaż podgląd
            });
        });
    }

    modelViewerElement.addEventListener('load', () => {
        spinner.style.display = 'none'; // Ukryj spinner po załadowaniu modelu
    });

    fetchModels();

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            if (category === 'all') {
                displayModels(models);
            } else {
                const filteredModels = models.filter(model => model.category === category);
                displayModels(filteredModels);
            }
        });
    });

    closeViewer.addEventListener('click', () => {
        modelViewer.style.display = 'none'; // Ukryj podgląd
        modelViewerElement.removeAttribute('src'); // Wyczyść model
        spinner.style.display = 'none'; // Ukryj spinner
    });
});