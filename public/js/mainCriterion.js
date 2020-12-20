const getResultButton = document.getElementById('get-result');
getResultButton.addEventListener('click', (e) => {
    // 1. Get info from forms
    const mainCriterion = document.querySelector('input[name="main"]:checked').value;

    const data = {
        main: mainCriterion
    };
    const selectedMarks = Array.from(document.getElementsByClassName('mark'));

    selectedMarks.forEach((mark) => {
        const input = mark.querySelector('.input');

        data[input.dataset.name] = {
            compare: input.tagName === 'SELECT' ? 'strict' : 'min',
            value: input.value || false
        };
    });

    // 2. Send info to the server:
    fetch('/db/process-main-criterion', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then((results) => {
            // 3. client, ok, reload page with results
            const winnerId = document.querySelector('#winner-id');
            winnerId.textContent = results.data.winner.id;
            
            const winnerName = document.querySelector('#winner-name');
            winnerName.textContent = results.data.winner.name;

            const winnerContainer = document.querySelector('.winner');
            winnerContainer.style.display = 'block';
        })
        .catch((e) => {
            console.log(e.message);
        });
});
