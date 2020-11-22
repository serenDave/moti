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

    // 3. Process it on the server, then
    fetch('/db/process-main-criterion', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then((results) => {
            // 4. send info to client, everything's ok
            console.log(results);
        })
        .catch((e) => {
            console.log(e.message);
        });
    
    // 5. client, ok, reload page with results
});
