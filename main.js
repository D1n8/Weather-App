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
        const deleteBtn = document.createElement('img')

        widget.classList.add('widget')
        resultContainer.setAttribute('id', `result-container_${widgetId}`)
        resultList.classList.add('result__list')
        resultList.setAttribute('id', `result-list_${widgetId}`)
        deleteBtn.classList.add('delete-btn')
        deleteBtn.setAttribute('id', `delete_${widgetId}`)
        deleteBtn.setAttribute('src', 'img/close.png')
        deleteBtn.addEventListener('click', function (e) {
            e.preventDefault()
            widget.remove()
        })


        resultContainer.append(resultList)
        widget.append(deleteBtn, createForm(widgetId), resultContainer)

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

    function addMap(container, lat, lon) {
        const existingMap = container.querySelector('.map');
        if (existingMap) {
            existingMap.remove();
        }

        const mapContainer = document.createElement('div');
        mapContainer.classList.add('map');
        mapContainer.style.height = '300px';
        container.append(mapContainer);

        const map = L.map(mapContainer).setView([lat, lon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
            .bindPopup(`Координаты: ${lat}, ${lon}`)
            .openPopup();
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

                        return response.json()
                    })
                    .then((data) => {
                        resultContainer.classList.add('result-container')
                        resultList.innerHTML = ''
                        createResultElement(resultList, 'li', ['result__item', 'time'], `${data.location.localtime}`)

                        let locContainer = createResultElement(resultList, 'li', ['result__item', 'location-container'])
                        createResultElement(locContainer, 'p', ['result__item', 'location-country'], `${data.location.country}`)
                        createResultElement(locContainer, 'p', ['result__item', 'location-name'], `${data.location.name}`)

                        createResultElement(resultList, 'li', ['result__item', 'temp'], `${data.current.temp_c}°C`)
                        createResultElement(resultList, 'li', ['result__item', 'wind'], `Ветер: ${data.current.wind_kph} км/ч`)

                        addMap(resultList, latitude.value, longitude.value)
                        latitude.value = ''
                        longitude.value = ''
                    })
                    .catch((errorMessage) => { addError(errorContainer, errorMessage) }
                    )

            }
        })
    }

    function createResultElement(container, elemTag, arrElemClassName, elemContent = '') {
        const elem = document.createElement(elemTag)
        elem.textContent = elemContent
        arrElemClassName.map(classname => elem.classList.add(classname))
        container.append(elem)
        return elem
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