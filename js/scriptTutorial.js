document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    // console.log('Hello Word!');
    const customer = document.getElementById('customer'),
        freelancer = document.getElementById('freelancer'),
        blockCustomer = document.getElementById('block-customer'),
        blockFreelancer = document.getElementById('block-freelancer'),
        blockChoice = document.getElementById('block-choice'),
        btnExit = document.getElementById('btn-exit'),
        formCustomer = document.getElementById('form-customer'),
        ordersTable = document.getElementById('orders'), //получаем таблицу цены фрилансера
        modalOrder = document.getElementById('order_read'),
        modalOpenActive = document.getElementById('order_active'),
        headTable = document.getElementById('headTable');
    // console.log(customer, freelancer);
    // ctr+shift+l  и выделить
    // localStorage.clear(); //очистка локалсторэдж
    // const orders = [];
    const orders = JSON.parse(localStorage.getItem('freeOrders')) || []; //parse преврашает строку в массив из jsona
    console.log(orders);
    console.log(typeof 'orders');

    //функция которая будет записывать в localStorage: мы в дальнейшем можем этой-же функцией(чучуть переписать) отправлять на сервер
    const toStorage = () => {
        localStorage.setItem('freeOrders', JSON.stringify(orders)); //записываем в локалсторэдж первое значение ключ второе те данные которые хотим записать только в строках  посмотреть в browserTools - application обьект JSON встроет тоже в джс 
    };
    const declOfNum = (number, titles) => number + ' ' +
        titles[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];

    const calcDeadline = (data) => {
        const deadline = new Date(data);
        const toDay = Date.now();
        if (deadline.toISOString().substring(0, 10) === new Date().toISOString().substring(0, 10)) {
            return 'сегодня';
        }
        const remaining = (deadline - toDay) / 1000 / 60 / 60; //в одной сек 1000сек,в одной минуте-60сек, в одним часе 60 мин и в одоим дне 24часа
        if (remaining / 24 > 2) {
            return declOfNum(Math.floor(remaining / 24), ['день', 'дня', 'дней']);
        }
        return declOfNum(Math.floor(remaining), ['час', 'часа', 'часов']);
    };

    const renderOrders = () => {
        ordersTable.textContent = '';
        orders.forEach((order, i) => {
            // console.log(order);
            //order-это мы обращаемся к нашему заказу-массиву и берем от туда title, currency-value
            ordersTable.innerHTML += `
                <tr class="order ${order.active ? 'taken' : ''}" data-number-order="${i}">
                    <td>${i+1}</td>
                    <td>${order.title}</td> 
                    <td class="${order.currency}"></td>
                    <td>${calcDeadline(order.deadline)}</td>
                </tr>`;
        });

    };
    const handlerModal = (event) => {
        const target = event.target;
        const modal = target.closest('.order-modal');
        // target.closest //где бы вы не кликнули будет подыматься и находить класс или селектор из скобок
        const order = orders[modal.id];
        // console.log(target);
        const baseAction = () => {
            modal.style.display = 'none';
            toStorage();
            renderOrders();
        };
        if (target.closest('.close') || target === modal) {
            modal.style.display = 'none';
        }
        if (target.classList.contains('get-order')) {
            order.active = true; //если мы нажимаем на кнопку взять заказ, то в селуйщий раз этот заказ на модалке будет активный
            baseAction();
        }
        if (target.id === 'capitulation') { //target.id сравнить с ид capitulation
            order.active = false;
            baseAction();

        }
        if (target.id === 'ready') {
            //    console.log(orders.indexOf(order)); //indexOf перебор массивов- он находит индекс того что туда передали он проходится по всем элементам что туда передали и как только встречает элемент который нам надо то передает ешо индекс
            //теперь из списка заказа удалить надо строчку
            order.splice(orders.indexOf(order), 1); //удаляет,принимает два параметра индекс и кол-во сколько штук удалить
            baseAction();
        }
        //    console.log(modal, modal.id);
    };
    const openModal = (numberOrder) => {
        const order = orders[numberOrder];
        //до диструктивного присваивания:
        //const modal = order.active ? modalOrderActive : modalOrder; // тернарный оператор если актавно то ... а если нет то...
        // console.log(order);

        //делаем диструктивное присвоение: можно выполнять с обьектами, с массивами  в данном случае order обьект у нас и мы с него будем доставать его св-ва-console.log(order); фигурные скобки и означают диструктивное присваивание, после знака равно указываем откуда эти св-ва мы будем доставать, также точно мы можем деструктурировать массив[], но это будут элементы от 0 до ... могу присваивать значения внутри диструктуризации active=true
        const {
            title,
            firstName,
            email,
            phone,
            description,
            amount,
            currency,
            deadline,
            active = false // active = true

        } = order;
        const modal = active ? modalOpenActive : modalOrder;
        //и теперь это у нас обычные переменные:
        // console.log(title, firstName, email, description, amount, currency, deadline, active);
        // console.dir({title, firstName, email, description, amount, currency, deadline, active}); //как обьект



        const firstNameBlock = modal.querySelector('.firstName'),
            titleBlock = modal.querySelector('.modal-title'),
            emailBlock = modal.querySelector('.email'),
            descriptionBlock = modal.querySelector('.description'),
            deadlineBlock = modal.querySelector('.deadline'),
            currencyBlock = modal.querySelector('.currency_img'),
            countBlock = modal.querySelector('.count'),
            phoneBlock = modal.querySelector('.phone');


        modal.id = numberOrder; //там у нас число соответсвующее индексу заказа в массиве orders


        // до диструктивного присваивания:
        // titleBlock.textContent = order.title;
        // firstNameBlock.textContent=order.firstName;
        // emailBlock.textContent=order.email;
        // emailBlock.href='mailto:'+order.email;
        // descriptionBlock.textContent=order.description;
        // deadlineBlock.textContent=order.deadline;
        // // currencyBlock.className='currency_img'+order.currency; //className заменяет класс, а classList добавляет classList.contains проверяет и возвращает true or false; classList.toggle()
        // currencyBlock.classList.add(order.currency);
        // countBlock.textContent=order.amount;
        // phoneBlock.href='tel:'+order.phone;

        //после диструктивного присваивания
        titleBlock.textContent = title;
        firstNameBlock.textContent = firstName;
        emailBlock.textContent = email;
        emailBlock.href = 'mailto:' + email;
        descriptionBlock.textContent = description;
        deadlineBlock.textContent = calcDeadline(deadline);
        currencyBlock.className = 'currency_img'; //сбрасываем класс, можно и при закрытии
        currencyBlock.classList.add(currency);
        countBlock.textContent = amount;
        phoneBlock ? phoneBlock.href = 'tel:' + phone : ''; // чтоб защитить себя от того что чегото нет в модалке используем условия-тернарный оператор так как phoneBlock не существует на второй модалке, тет он равно ниже:
        // if (phoneBlock)phoneBlock.href='tel:'+ phone;
        //и phoneBlock && (phoneBlock.href='tel:'+phone) те если условие phoneBlock true то делает\выполняет следущее действие\условие


        modal.style.display = 'flex';

        modal.addEventListener('click', handlerModal);
    };
    const sortOrder = (arr, property) => {
        arr.sort((a, b) => a[property] > b[property] ? 1 : -1); //если да то возвращает единицу, если нет то минус единица
    };
    headTable.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('head-sort')) {
            if (target.id === 'taskSort') {
                sortOrder(orders, 'title');
            }
            if (target.id === 'currencySort') {
                sortOrder(orders, 'currency');
            }
            if (target.id === 'deadlineSort') {
                sortOrder(orders, 'deadline');
            }
            toStorage();
            renderOrders();

        }
    });
    //наша функция с методом innerHtml из-за того что мы поставили += таблица не заменяется а добавляет наш html к уже существующему коду
    ordersTable.addEventListener('click', event => {
        const target = event.target;
        console.log(target);
        const targetOrder = target.closest('.order'); //берем всю строчку этот метот берет и подымается вверх по вёрстке до того элемента который мы пропишем тег класс ид внутри
        if (targetOrder) { //если ссуществует targetOrder
            openModal(targetOrder.dataset.numberOrder);
        }

        // console.log(targetOrder);
        console.log(targetOrder.dataset.numberOrder); //получить дата атрибут так .dataset.название атрибута через кемелКейс dataset-свойства
        console.log(orders[targetOrder.dataset.numberOrder]); //получаем заказ по номеру заказа из дата атрибута, номер заказа это позиция его в массиве orders
    });

    customer.addEventListener('click', () => {
        // console.dir(blockCustomer);
        // console.dir() показывает обьект
        blockChoice.style.display = "none";
        const toDay = new Date().toISOString().substring(0, 10); //обрезает и возвращает то что вырезал
        document.getElementById('deadline').min = toDay; //минимальная дата которую можно ввести
        //    console.dir(document.getElementById('deadline'));//чтоб посмотреть  какие есть свойства у обьекта-атрибуты инпута в данном случае
        blockCustomer.style.display = "block";
        btnExit.style.display = "block";
    });
    //mouseover -водится мышь
    freelancer.addEventListener('click', () => {
        blockChoice.style.display = "none";
        renderOrders();
        blockFreelancer.style.display = "block";
        btnExit.style.display = "block";
    });
    btnExit.addEventListener('click', () => {
        btnExit.style.display = "none";
        blockFreelancer.style.display = "none";
        blockCustomer.style.display = "none";
        blockChoice.style.display = "block";
    });

    formCustomer.addEventListener('submit', () => {
        event.preventDefault();
        //  console.log(event);
        const obj = {};
        //start перебор элементов формы с помощью методов переборов forEach вместо for цикла
        //         // оператор rest собирает в кучу - массив! а spret разбивает на единичные элементы[...] если используем в функции принимаем аргументы то это spret, 
        // [...formCustomer.elements].forEach( // через заппяту элемент и ещё ...
        //     //Array.from(formCustomer.elements).forEach(   и можно через запяту добавить элементы
        //     (elem)=>{//(elem, index, array)
        //         if ((elem.tagName === "INPUT" && elem.type !== 'radio') ||
        //         (elem.type === 'radio' && elem.checked) ||
        //         (elem.tagName === 'TEXTAREA')) {
        //         //  console.log(elem);
        //         // console.dir(elem);
        //         obj[elem.name] = elem.value;
        //         if (elem.type !== 'radio') {
        //             elem.value = '';
        //         }
        //     }
        //     }
        // );
        //end перебор элементов формы с помощью методов переборов forEach вместо for цикла
        //start перебор элементов формы с помощью методов переборов filter///только ещё фильтр делает ретёрн
        const elements = [...formCustomer.elements]
            .filter((elem) => (elem.tagName === "INPUT" && elem.type !== 'radio') ||
                (elem.type === 'radio' && elem.checked) ||
                (elem.tagName === 'TEXTAREA'));
        //тоже самое =>     .filter((elem) => {return (elem.tagName === "INPUT" && elem.type !== 'radio') ||
        // (elem.type === 'radio' && elem.checked) ||
        // (elem.tagName === 'TEXTAREA')}; 
        elements.forEach(
            (elem) => { //(elem, index, array)

                obj[elem.name] = elem.value;
                //ресет для формы после сохранения 
                // if (elem.type !== 'radio') {
                //     elem.value = '';
                // } delete

            }
        );
        //end перебор эл ементов формы с помощью методов переборов filter/////

        // перебор элементов ч помощью for , без массива
        //  debugger; // и в браузере в консоли f9 добавить шаг
        // for (const elem of formCustomer.elements) {
        //     if ((elem.tagName === "INPUT" && elem.type !== 'radio') ||
        //         (elem.type === 'radio' && elem.checked) ||
        //         (elem.tagName === 'TEXTAREA')) {
        //         //  console.log(elem);
        //         // console.dir(elem);
        //         obj[elem.name] = elem.value;
        //         if (elem.type !== 'radio') {
        //             elem.value = '';
        //         }
        //     }

        // }
        // elem.filter(()=>{});
        //  console.log(obj);
        //ресет для формы после сохранения 
        formCustomer.reset(); //переведет в те значения которые были в вёрстке-value
        orders.push(obj);
        // console.log(orders);
        toStorage();
    });
    ///start table function///////////

    ///end table function/////////////


});

//все функции создаются по правилам тона до обработчиков событий
//если ()=> без фигурных скобок то это return
