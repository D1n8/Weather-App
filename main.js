(() => {
    function startApp() {
        const latitude = document.getElementById('latitude')
        const longitude = document.getElementById('longitude')
        const form = document.getElementById('form')

        form.addEventListener('submit', async function (e) {
            e.preventDefault()

            if (validatonForm(latitude, longitude)) {
                
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