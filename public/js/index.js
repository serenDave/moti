async function addItem(itemType, data) {
    await fetch(`/db/add/${itemType}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    location.reload();
}

async function editItem(itemType, itemId, data) {
    const rawResponse = await fetch(`/db/edit/${itemType}/${itemId}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const response = await rawResponse.json();

    if (response) {
        let link;

        switch (itemType) {
            case 'alternative':
                link = '/alternatives';
                break;
            case 'criterion':
                link = '/criteria';
                break;
            case 'mark':
                link = '/marks';
            default:
                break;
        }

        window.location.href = link;
    } else {
        alert('Error updating item');
    }
}

async function removeItem(event, itemType, itemId) {
    event.preventDefault();

    await fetch(`/db/remove/${itemType}/${itemId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    location.reload();
}