(() => {
    function startApp() {
        const latitude = document.getElementById('latitude')
        const longitude = document.getElementById('longitude')
        const form = document.getElementById('form')

        const apiKey = '6f4ee805459e4b72958164210242011'
        

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            if (validatonForm(latitude, longitude)) {
                const query = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude.value},${longitude.value}`
                
                fetch(query).then((response) => {
                    latitude.value = ''
                    longitude.value = ''
                    return response.json()
                }).then((data) => {
                    console.log(data)
                })
            }
        })
    }

    function validatonForm(latValue, lonValue) {
        const errorContainer = document.querySelector('.error-container')
        errorContainer.innerHTML = ''

        if (latValue.value > 90 || latValue.value < -90) {
            const error = document.createElement('p')
            error.textContent = 'Неверный диапозон широты'
            error.classList.add('error')
            errorContainer.append(error)
        }

        if (lonValue.value > 90 || lonValue.value < -90) {
            const error = document.createElement('p')
            error.textContent = 'Неверный диапозон долготы'
            error.classList.add('error')
            errorContainer.append(error)
        }

        return errorContainer.childElementCount === 0
    }


    window.startApp = startApp
})()