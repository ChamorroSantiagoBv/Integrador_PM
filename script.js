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
                    document.getElementById('card-atk-def').textContent = `${card.atk} / ${card.def}`;
                    document.getElementById('card-price').textContent = 'Precio: '+ card.card_prices[0].tcgplayer_price+'$' || 'N/A';

                    // Insertar descripción y clasificación
                    document.getElementById('card-description').textContent = card.desc;
                    const classificationList = document.getElementById('card-classification');
                   // classificationList.innerHTML = ''; // Limpiar cualquier contenido previo
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

    // Escuchar el evento submit del formulario
    const form = document.getElementById('card-search-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe normalmente
        const cardName = document.getElementById('card-search-input').value; // Obtener el valor del input de búsqueda
        if (cardName) {
            fetchCardData(cardName); // Llamar a la función para buscar la carta
        } else {
            alert('Por favor ingrese el nombre de una carta.');
        }
    });
});
