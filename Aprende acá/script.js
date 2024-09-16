document.addEventListener("DOMContentLoaded", function() {
    // URL base de la API de YGOPRODeck
    const apiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

    // Función que realiza la solicitud y actualiza el contenido
    function fetchCardData(cardName) {
        const params = `?name=${encodeURIComponent(cardName)}`;

        // Realizar la solicitud HTTP
        fetch(apiUrl + params)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const card = data.data[0];

                    // Insertar los datos de la carta en los elementos HTML correspondientes
                    document.getElementById('card-name-header').textContent = card.name; // Nombre de la carta en el header
                    document.getElementById('card-name').textContent = card.name;
                    document.getElementById('card-type').textContent = card.type;
                    document.getElementById('card-attribute').textContent = card.attribute || 'N/A';
                    document.getElementById('card-level').textContent = card.level || 'N/A';
                    document.getElementById('card-race').textContent = card.race;
                    document.getElementById('card-atk-def').textContent = `${card.atk || '---'} / ${card.def || '---'}`;
                    document.getElementById('card-price').textContent = card.tcgplayer_price;

                    // Insertar descripción y clasificación
                    document.getElementById('card-description').textContent = card.desc;
                    const classificationList = document.getElementById('card-classification');
                    classificationList.innerHTML = ''; // Limpiar cualquier contenido previo
                    classificationList.innerHTML = `
                        <li>Arquetipo: ${card.archetype || 'N/A'}</li>
                    `;

                    // Mostrar la imagen de la carta
                    const img = document.createElement('img');
                    img.src = card.card_images[0].image_url;
                    img.alt = card.name;
                    img.classList.add('hover-zoom');
                    const imgContainer = document.getElementById('card-image');
                    imgContainer.innerHTML = ''; // Limpiar cualquier contenido previo
                    imgContainer.appendChild(img);
                } else {
                    console.log('No se encontró la carta.');
                }
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error);
            });
    }

    // Escuchar el clic del botón
    const button = document.getElementById('fetch-card-btn');
    button.addEventListener('click', function() {
        // Llamar a la función con el nombre de la carta deseada
        cardName = 'Monster%Reborn'; // Puedes cambiar el nombre de la carta aquí
        fetchCardData(cardName);
    });
});