(() => {
    function startApp() {
        const latitude = document.getElementById('latitude')
        const longitude = document.getElementById('longitude')
        const form = document.getElementById('form')


        const apiKey = '6f4ee805459e4b72958164210242011'


        form.addEventListener('submit', function (e) {
            e.preventDefault()

            if (validatonForm(latitude, longitude)) {
                const resultContainer = document.getElementById('result-container')
                const errorContainer = document.querySelector('.error-container')
                const resultList = document.getElementById('result-list')
                errorContainer.innerHTML = ''
                const query = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude.value},${longitude.value}`
                fetch(query)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Неверный запрос')
                        }
                        latitude.value = ''
                        longitude.value = ''
                        return response.json()
                    })
                    .then((data) => {
                        resultList.innerHTML = ''
                        console.log(data)
                        resultContainer.classList.add('result-container')
                        createResultElement(resultList, 'li', ['result__item', 'location-country'], `Страна: ${data.location.country}`)
                        createResultElement(resultList, 'li', ['result__item', 'location-region'], `Область/Регион: ${data.location.region}`)
                        createResultElement(resultList, 'li', ['result__item', 'location-name'], `Город: ${data.location.name}`)
                        createResultElement(resultList, 'li', ['result__item', 'time'], `Дата и время: ${data.location.localtime}`)
                        createResultElement(resultList, 'li', ['result__item', 'temp'], `Температура в цельсиях: ${data.current.temp_c}`)
                        createResultElement(resultList, 'li', ['result__item', 'wind'], `Скорость ветра: ${data.current.wind_kph}`)
                    })
                    .catch((errorMessage) => { addError(errorContainer, errorMessage) }
                    )
            }
        })
    }

    function createResultElement(container, elemTag, arrElemClassName, elemContent) {
        const elem = document.createElement(elemTag)
        elem.textContent = elemContent
        arrElemClassName.map(classname => elem.classList.add(classname))
        container.append(elem)
    }

    function addIcon(container) {

    }

    function addError(container, message) {
        const error = document.createElement('p')
        error.textContent = message
        error.classList.add('error')
        container.append(error)
    }

    function validatonForm(latValue, lonValue) {
        const errorContainer = document.querySelector('.error-container')
        errorContainer.innerHTML = ''

        if (latValue.value > 90 || latValue.value < -90) {
            addError(errorContainer, 'Неверный диапозон широты')
        }

        if (lonValue.value > 180 || lonValue.value < -180) {
            addError(errorContainer, 'Неверный диапозон долготы')
        }

        return errorContainer.childElementCount === 0
    }


    window.startApp = startApp
})()