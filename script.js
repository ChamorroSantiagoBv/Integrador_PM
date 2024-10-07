document.addEventListener("DOMContentLoaded", function() { 
    const apiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

    function fetchCardData(cardName) {
        const params = `?name=${encodeURIComponent(cardName)}`;

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

                    // Actualizar el contenido con los datos de la carta
                    document.getElementById('card-name-header').textContent = card.name;
                    document.getElementById('card-name').textContent = card.name;
                    document.getElementById('card-type').textContent = card.type;
                    document.getElementById('card-race').textContent = card.race;
                    document.getElementById('card-description').textContent = card.desc;
                    document.getElementById('card-price').textContent = 'Precio: ' + card.card_prices[0].tcgplayer_price + '$' || 'N/A';

                    // Mostrar la imagen de la carta
                    const img = document.createElement('img');
                    img.src = card.card_images[0].image_url;
                    img.alt = card.name;
                    img.classList.add('hover-zoom');
                    const imgContainer = document.getElementById('card-image');
                    imgContainer.innerHTML = '';
                    imgContainer.appendChild(img);

                    // Seleccionar los campos de atributo, nivel y ATK/DEF
                    const attributeCol = document.getElementById('card-attribute').parentElement;
                    const levelCol = document.getElementById('card-level').parentElement;
                    const atkDefCol = document.getElementById('card-atk-def').parentElement;

                    // Ocultar campos si es "Spell" o "Trap"
                    if (card.type.includes('Spell') || card.type.includes('Trap')) {
                        attributeCol.style.display = 'none';
                        levelCol.style.display = 'none';
                        atkDefCol.style.display = 'none';
                    } else {
                        // Mostrar los campos y actualizar su contenido si es un monstruo
                        attributeCol.style.display = 'table-row';
                        levelCol.style.display = 'table-row';
                        atkDefCol.style.display = 'table-row';

                        document.getElementById('card-attribute').textContent = card.attribute || 'N/A';
                        document.getElementById('card-level').textContent = card.level || 'N/A';
                        document.getElementById('card-atk-def').textContent = `${card.atk} / ${card.def}` || 'N/A';
                    }
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
        event.preventDefault();
        const cardName = document.getElementById('card-search-input').value;
        if (cardName) {
            fetchCardData(cardName);
        } else {
            alert('Por favor ingrese el nombre de una carta.');
        }
    });
});

