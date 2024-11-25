document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    const saveBtn = document.getElementById('saveBtn');
    const cardElements = {
        nameHeader: document.getElementById('card-name-header'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
        race: document.getElementById('card-race'),
        description: document.getElementById('card-description'),
        price: document.getElementById('card-price'),
        archetype: document.getElementById('card-archetype'),
        imageContainer: document.getElementById('card-image'),
        attribute: document.getElementById('card-attribute').parentElement,
        level: document.getElementById('card-level').parentElement,
        atkDef: document.getElementById('card-atk-def').parentElement,
    };

    // Actualiza el ícono del botón dependiendo si está en favoritas
    function actualizarIcono() {
        const nombre = cardElements.name.textContent;
        if (nombre && nombre !== '-') {
            const lista = JSON.parse(localStorage.getItem('cartas')) || [];
            saveBtn.innerHTML = lista.includes(nombre)
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>`;
        }
    }

    // Maneja el estado de las cartas favoritas
    saveBtn.addEventListener("click", () => {
        const nombre = cardElements.name.textContent;
        if (nombre && nombre !== '-') {
            let lista = JSON.parse(localStorage.getItem('cartas')) || [];
            if (lista.includes(nombre)) {
                lista = lista.filter(carta => carta !== nombre);
                alert('¡Carta eliminada de la lista!');
            } else {
                lista.push(nombre);
                alert('¡Carta añadida a la lista!');
            }
            localStorage.setItem('cartas', JSON.stringify(lista));
            actualizarIcono();
        } else {
            alert('No hay carta para guardar.');
        }
    });

    // Realiza la búsqueda de la carta y actualiza la interfaz
    function fetchCardData(cardName) {
        fetch(`${apiUrl}?name=${encodeURIComponent(cardName)}`)
            .then(response => {
                if (!response.ok) throw new Error('Error en la solicitud');
                return response.json();
            })
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const card = data.data[0];
                    // Actualizar campos principales
                    cardElements.nameHeader.textContent = card.name;
                    cardElements.name.textContent = card.name;
                    cardElements.type.textContent = card.type;
                    cardElements.race.textContent = card.race;
                    cardElements.description.textContent = card.desc;
                    cardElements.price.textContent = `Precio: ${card.card_prices[0].tcgplayer_price || 'N/A'}$`;
                    cardElements.archetype.textContent = `Arqueotipo: ${card.archetype || 'N/A'}`;

                    // Actualizar imagen
                    cardElements.imageContainer.innerHTML = `<img src="${card.card_images[0].image_url}" alt="${card.name}" class="hover-zoom">`;

                    // Mostrar/ocultar atributos específicos
                    const isMonster = !(card.type.includes('Spell') || card.type.includes('Trap'));
                    cardElements.attribute.style.display = isMonster ? 'table-row' : 'none';
                    cardElements.level.style.display = isMonster ? 'table-row' : 'none';
                    cardElements.atkDef.style.display = isMonster ? 'table-row' : 'none';

                    if (isMonster) {
                        document.getElementById('card-attribute').textContent = card.attribute || 'N/A';
                        document.getElementById('card-level').textContent = card.level || 'N/A';
                        document.getElementById('card-atk-def').textContent = `${card.atk} / ${card.def}` || 'N/A';
                    }

                    // Actualizar ícono de favoritas
                    actualizarIcono();
                } else {
                    console.log('No se encontró la carta.');
                }
            })
            .catch(error => console.error('Error en la solicitud:', error));
    }

    // Maneja el evento de búsqueda
    document.getElementById('card-search-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const cardName = document.getElementById('card-search-input').value.trim();
        if (cardName) {
            fetchCardData(cardName);
        } else {
            alert('Por favor ingrese el nombre de una carta.');
        }
    });
});
