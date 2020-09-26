async function addItem(itemType, data) {
    const rawResponse = await fetch(`/db/add/${itemType}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    location.reload();
}

async function removeItem(event, itemType, itemId) {
    event.preventDefault();

    const rawResponse = await fetch(`/db/remove/${itemType}/${itemId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    location.reload();
}
