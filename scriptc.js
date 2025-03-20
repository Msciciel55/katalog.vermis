document.addEventListener('DOMContentLoaded', () => {
    const modelGrid = document.querySelector('.model-grid');
    const modelViewer = document.getElementById('model-viewer');
    const closeViewer = document.getElementById('close-viewer');
    const modelViewerElement = modelViewer.querySelector('model-viewer');
    const spinner = document.getElementById('spinner'); // Pobierz spinner
    const categoryButtons = document.querySelectorAll('.button');

    const jsonUrl = 'https://raw.githubusercontent.com/Msciciel55/3dkatalog/refs/heads/main/dane.json';

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
            
                spinner.style.display = 'block';
            
                // Stary model usuwamy
                modelViewerElement.remove();
            
                // Tworzymy nowy element <model-viewer>
                const newModelViewer = document.createElement('model-viewer');
                newModelViewer.setAttribute('src', model.model);
                newModelViewer.setAttribute('alt', model.title);
                newModelViewer.setAttribute('auto-rotate', '');
                newModelViewer.setAttribute('camera-controls', '');
                newModelViewer.setAttribute('reveal', 'interaction'); // Opcjonalne, zapobiega błędom ładowania
                newModelViewer.style.width = '100%';
                newModelViewer.style.height = '100%';
            
                // Dodajemy nowy element do kontenera
                modelViewer.insertBefore(newModelViewer, spinner);
            
                // Ukrywamy spinner po załadowaniu modelu
                newModelViewer.addEventListener('load', () => {
                    spinner.style.display = 'none';
                });
            
                modelViewer.style.display = 'flex';
            });
            
            
            
        });
    }

    modelViewerElement.addEventListener('load', () => {
        spinner.style.display = 'none';
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
        modelViewer.style.display = 'none';
    });
});