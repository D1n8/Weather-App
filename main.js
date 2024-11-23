(() => {
    function startApp() {
        const apiKey = '6f4ee805459e4b72958164210242011'
        const widgetContainer = document.getElementById('widget-container')
        const addWidget = document.getElementById('add-widget')
        let id = 0
        addWidget.addEventListener('click', function () {
            id += 1
            widgetContainer.append(createWidget(id))
            formSubmit(document.getElementById(`form_${id}`), id, apiKey, document.getElementById(`lat_${id}`), document.getElementById(`lon_${id}`))
        })
    }

    function createWidget(widgetId) {
        const widget = document.createElement('div')
        const resultContainer = document.createElement('div')
        const resultList = document.createElement('ul')
        const deleteBtn = document.createElement('button')

        widget.classList.add('widget')
        resultContainer.setAttribute('id', `result-container_${widgetId}`)
        resultList.classList.add('result__list')
        resultList.setAttribute('id', `result-list_${widgetId}`)
        deleteBtn.classList.add('btn', 'delete-btn')
        deleteBtn.setAttribute('id', `delete_${widgetId}`)
        deleteBtn.textContent = 'Удалить виджет'
        deleteBtn.addEventListener('click', function (e) {
            e.preventDefault()
            widget.remove()
        })

        resultContainer.append(resultList)
        widget.append(createForm(widgetId), resultContainer, deleteBtn)

        return widget
    }

    function createForm(widgetId) {
        const form = document.createElement('form')
        const errorContainer = document.createElement('div')
        const btn = document.createElement('button')
        const inputLat = createInput(widgetId, 'Широта', 'lat')
        const inputLon = createInput(widgetId, 'Долгота', 'lon')

        form.setAttribute('id', `form_${widgetId}`)
        errorContainer.classList.add('error-container')
        errorContainer.setAttribute('id', `error-container_${widgetId}`)
        btn.classList.add('btn')
        btn.textContent = 'Показать погоду'

        form.append(inputLat, inputLon, errorContainer, btn)
        return form
    }

    function createInput(widgetId, title, id) {
        const inputContainer = document.createElement('div')
        const titleBox = document.createElement('h2')
        const input = document.createElement('input')

        titleBox.classList.add('form__title')
        titleBox.textContent = title
        input.classList.add('form__input')
        input.setAttribute('type', 'number')
        input.setAttribute('step', 'any')
        input.setAttribute('id', `${id}_${widgetId}`)

        inputContainer.append(title, input)
        return inputContainer
    }

    function formSubmit(form, widgetId, key, latitude, longitude) {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            if (validatonForm(widgetId, latitude, longitude)) {
                const resultContainer = document.getElementById(`result-container_${widgetId}`)
                const errorContainer = document.getElementById(`error-container_${widgetId}`)
                const resultList = document.getElementById(`result-list_${widgetId}`)
                errorContainer.innerHTML = ''
                const query = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${latitude.value},${longitude.value}`
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
                        resultContainer.classList.add('result-container')
                        resultList.innerHTML = ''
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

    function addError(container, message) {
        const error = document.createElement('p')
        error.textContent = message
        error.classList.add('error')
        container.append(error)
    }

    function validatonForm(widgetId, latValue, lonValue) {
        const errorContainer = document.getElementById(`error-container_${widgetId}`)
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