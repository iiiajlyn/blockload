let last_scroll, //флаг для проверки в какую сторону скролим
    direction = 'down', // в какую сторону подгружался последний контент
    blockMain = document.querySelector('main'), // Получаем родительский блок
    loading = false, // флаг для проверки загружается ли сейчас элемент 
    blockArr = [
        { name: '1' },
        { name: '2' },
        { name: '3' },
        { name: '4' },
        { name: '5' },
        { name: '6' },
        { name: '7' },
        { name: '8' },
    ],
    quantityItems = blockArr.length - 1, // количество всех элементов
    counterItems = blockArr.length - 1 // номер последнего подгружаемого элемента

//
//--Получаем данные с url
//
function getElement(url, selector) {
    return new Promise(function (success, error) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', 'http://waypoints/page/' + url, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let html = document.createElement('div');
                    html.innerHTML = xhr.responseText;
                    success(html.querySelector(selector));
                }
            }
        }
    })
}

//
//--Функция для появления элементов при скролле
//
async function scroll() {
    if (loading == false) {
        loading = true
        window.removeEventListener("scroll", scroll);
        let section = document.querySelectorAll('.section'),
            contentHeight = blockMain.offsetHeight,      //  высота блока контента вместе с границами
            yOffset = window.pageYOffset,            //  текущее положение скролбара
            window_height = window.innerHeight,      //  высота внутренней области окна документа
            y = yOffset + window_height,
            loadHtml = document.createElement('div');

            loadHtml.className = "load"
            loadHtml.innerHTML = "loading"

        //если пользователь достиг конца добавляем элемент
        if (y >= contentHeight - 50) {

            blockMain.append(loadHtml);

            if (section.length > 3) {
                section[0].remove()
            }
            if (direction == 'up') {
                counterItems = counterItems - 5
                if (counterItems < 0) {
                    counterItems = counterItems + quantityItems + 1
                }
            }
            let element = await getElement(blockArr[counterItems].name + '.html', '.section')
            blockMain.append(element);
            counterItems--;

            if (counterItems < 0) {
                counterItems = quantityItems;
            }
            direction = 'down';
        }
        //Если пользователь скроллит в верх удаляем нижний элемент и добавляем верхний
        if (window.scrollY < last_scroll && window.scrollY < 200) {
            if (section.length > 3) {
                blockMain.prepend(loadHtml);
                section[3].remove()
            }
            if (direction == 'down') {
                counterItems = counterItems + 5
                if (counterItems > quantityItems) {
                    counterItems = counterItems - quantityItems - 1
                }
            }
            let element = await getElement(blockArr[counterItems].name + '.html', '.section')
            blockMain.prepend(element)
            counterItems++
            if (counterItems > quantityItems) {
                counterItems = 0
            }

            direction = 'up'
        }

        last_scroll = window.scrollY;
        loading = false

        if (direction == 'up' && document.querySelector("html").scrollTop == 0) {
            let heightSection = document.querySelector('.section').offsetHeight,
                heightLoad = document.querySelector('.load').offsetHeight

            window.scrollTo({
                top: heightSection - heightLoad,
                left: 0,
            })
        }
        loadHtml.remove()
        window.addEventListener("scroll", scroll);
    }
}

//
//--Стартовый контент
//
async function startContent() {
    loading = true
    for (let i = 0; i < 4; i++) {
        let element = await getElement(blockArr[counterItems].name + '.html', '.section')
        blockMain.append(element)
        counterItems--
    }
    window.addEventListener("scroll", scroll);
    direction = 'down';
    loading = false
}


//
//--Запуск
//



startContent()


