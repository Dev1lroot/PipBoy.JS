// Соотношение строн всегда должно быть равно 4:3
var pipWidth = (window.innerHeight/3) * 4
var canvas = document.getElementById('display');

function resizeCanvas() {

    // Set the canvas dimensions to match the window's inner dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Соотношение строн всегда должно быть равно 4:3
    pipWidth = (window.innerHeight/3) * 4;
}

window.addEventListener('resize', resizeCanvas);

CanvasRenderingContext2D.prototype.drawCenteredText = function(text, x, y) {

    // Measure the text width
    const textMetrics = this.measureText(text);
    
    // Calculate the starting x coordinate so the text is centered
    const startX = x - textMetrics.width / 2;
    
    // Draw the text at the calculated position
    this.fillText(text, startX, y);
};

CanvasRenderingContext2D.prototype.simpleLinearGradient = function(x,y,w,h,color_a,color_b,orientation = "h")
{
    if(orientation == "h")
    {
        let gradient = this.createLinearGradient(x, 0, x + w, 0);
        gradient.addColorStop(0, color_a);
        gradient.addColorStop(1, color_b);
        this.fillStyle = gradient;
        this.fillRect(x, y, w, h);
    }
    else
    {
        let gradient = this.createLinearGradient(0, y, 0, y + h);
        gradient.addColorStop(0, color_a);
        gradient.addColorStop(1, color_b);
        this.fillStyle = gradient;
        this.fillRect(x, y, w, h);
    }
}

CanvasRenderingContext2D.prototype.drawItemList = function(list,selected)
{

    const start  = 64;
    const uiWidth = pipWidth - 32;
    const start_pos = (canvas.width/2 - uiWidth/2);
    const item_height = 32;

    for(let i in list)
    {
        const item = list[i];
        const offset = (i * (item_height + 1))

        if(i == selected)
        {
            this.fillStyle = '#00FF00';
            this.fillRect(start_pos, start + offset, uiWidth, item_height);
            this.fillStyle = '#000000';
            this.fillText(item.name,start_pos + 8, start + offset + item_height * 0.7);
        }
        else
        {
            this.fillStyle = '#00FF00';
            this.fillText(item.name,start_pos + 8, start + offset + item_height * 0.7);
        }
    }
};

resizeCanvas();

var glitch_pos = 0;

var geo = {
    lat: 0,
    lng: 0,
    err: "",
    scale: 50000
}

var menu_selected = {
    main: 0,
    sub:  0,
    radio: 0,
}
var radioStations = [
    {
        name: "Disabled",
    },
    {
        name: "Enclave Radio",
        data: new EnclaveRadio()
    },
    {
        name: "Classic Radio",
        data: new RadioStation([
            new Audio("radio/classic/blue-danube.ogg"),
            new Audio("radio/classic/morning-mood.ogg"),
            new Audio("radio/classic/tragic-overture.ogg"),
            new Audio("radio/classic/valkyrie.ogg"),
            new Audio("radio/classic/valkyrie-flight.ogg"),
            new Audio("radio/classic/mountain-king.ogg"),
        ])
    },
];
var markers = [
    {
        name: "Metro Isani",
        type: "marker",
        lat: 41.686622827409366, lng: 44.84082412195955
    },
    {
        name: "Liberty Square",
        type: "marker",
        lat: 41.69338588935219, lng: 44.8015020130252
    },
    {
        name: "Embassy of Ukraine",
        type: "marker",
        lat: 41.709637150242806, lng: 44.74231144735748
    },
    {
        name: "Metro Technical University",
        type: "marker",
        lat: 41.71990598817448, lng: 44.77846116793988
    },
    {
        name: "Metro Rustaveli",
        type: "marker",
        lat: 41.704159846076024, lng: 44.78959323029074
    }
]
var menu = [
    {
        name: "STAT",
        data: [
            {
                name: "STATUS"
            },
            {
                name: "SPECIALS"
            },
            {
                name: "SKILLS"
            },
            {
                name: "PERKS"
            },
            {
                name: "GENERAL"
            },
        ]
    },
    {
        name: "INV",
        data: [
            {
                name: "ARMOR"
            },
            {
                name: "WEAPONS"
            },
            {
                name: "AMMO"
            },
            {
                name: "AID"
            },
            {
                name: "JUNK"
            },
            {
                name: "HOLO"
            },
        ]
    },
    {
        name: "DATA",
        data: [
            {
                name: "QUESTS"
            },
            {
                name: "WORKSHOPS"
            },
            {
                name: "STATS",
            }
        ]
    },
    {
        name: "MAP"
    },
    {
        name: "RADIO"
    }
]

function render()
{

    const ctx = canvas.getContext('2d');
    const interval = 6;
    const borderSize = Math.min(canvas.width/2, canvas.height/2);

    ctx.fillStyle = `rgba(0, 31, 0, 255)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderUI();

    // Рисуем ебучие полоски
    ctx.strokeStyle = `#00FF0020`;
    ctx.beginPath();

    for (let x = 0; x < canvas.height; x += interval)
    {
        ctx.moveTo(0, x);
        ctx.lineTo(canvas.width,x);
    }
    ctx.stroke();

    // Рисуем глитч-тень
    const glitch_height = canvas.height/2;

    // Верхняя тень
    ctx.fillStyle = `#00000055`;
    ctx.fillRect(0, 0, canvas.width, glitch_pos);

    // Градиентная тень
    let gradient = ctx.createLinearGradient(0, glitch_pos, 0, glitch_pos + glitch_height);
    gradient.addColorStop(0, '#00000055');
    gradient.addColorStop(1, '#00000015'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, glitch_pos, canvas.width, glitch_height);

    // Нижняя тень
    ctx.fillStyle = `#00000055`;
    ctx.fillRect(0, glitch_pos + glitch_height, canvas.width, canvas.height - glitch_pos);

    // Передвигаем глитчер
    glitch_pos += 16;
    if(glitch_pos > canvas.height) glitch_pos = -glitch_height;

    // Высчитываем отступ от края канваса для рендера тени
    const padding = ((canvas.width - pipWidth)/2)

    ctx.simpleLinearGradient(padding,0,borderSize,canvas.height, "#0000005F", "#00000000", "h");
    ctx.simpleLinearGradient(canvas.width - borderSize - padding,0,borderSize,canvas.height, "#00000000", "#0000005F", "h");

    ctx.simpleLinearGradient(0,0,canvas.width,borderSize, "#0000005F", "#00000000", "v");
    ctx.simpleLinearGradient(0,canvas.height - borderSize,canvas.width,borderSize, "#00000000", "#0000005F", "v");


    // Скрываем черным фоном то чно видно быть не должно
    ctx.fillStyle = `#000000`;
    ctx.fillRect(0,0,padding,canvas.height);
    ctx.fillRect(canvas.width - padding,0,padding,canvas.height);
}
function mmddyyyy()
{
    const date = new Date()

    let day = date.getDate();
    let month = date.getMonth() + 1; // getMonth returns 0-11
    let year = date.getFullYear();

    // Pad the month and day with leading zeros if necessary
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
        
    return month + '.' + day + '.' + year;
}
function time12()
{
    const date = new Date()

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; // adding leading zero to minutes if needed

    return hours + ':' + minutes + ' ' + ampm;
}
function latLngToCanvas(lat, lng) {
    const x = canvas.width / 2 + (lng - geo.lng) * geo.scale;
    const y = canvas.height / 2 - (lat - geo.lat) * geo.scale;
    return { x, y };
}
function drawMapGrid()
{
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#009900';

    const kmPerDegreeLat = 111; // Approx km per degree latitude
    const kmPerDegreeLng = Math.cos(geo.lat * Math.PI / 180) * 111; // Adjust longitude km by latitude

    const degreeStepLat = 0.1 / kmPerDegreeLat; // Step per km in degrees latitude
    const degreeStepLng = 0.1 / kmPerDegreeLng; // Step per km in degrees longitude

    ctx.strokeStyle = '#005500';
    ctx.beginPath();

    // Vertical lines (constant longitude)
    for (let lng = geo.lng - 1; lng <= geo.lng + 1; lng += degreeStepLng) {
        const {x} = latLngToCanvas(geo.lat, lng);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    // Horizontal lines (constant latitude)
    for (let lat = geo.lat - 1; lat <= geo.lat + 1; lat += degreeStepLat) {
        const {y} = latLngToCanvas(lat, geo.lng);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
}
function renderUI()
{

    const ctx = canvas.getContext('2d');

    const uiWidth = pipWidth - 32;
    const button_width = uiWidth / menu.length;
    const start_pos = (canvas.width/2 - uiWidth/2);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#00FF00';

    // Рисуем основное меню
    for(let i in menu)
    {
        const button = { 
            begin: start_pos + button_width * i, 
            middle: start_pos + (button_width * i) + (button_width/2), 
            end: start_pos + button_width * i + button_width
        }

        ctx.drawCenteredText(menu[i].name,button.middle, 32);

        if(menu_selected.main == i)
        {
            const button_text_width = ctx.measureText(menu[i].name).width;
            const line_width = button_width - button_text_width - 16; // Высчитываем занимаемое место + буфер 8 пикселей

            // Горизонтальные основные линии
            ctx.fillRect(button.begin, 40, line_width/2, 1);
            ctx.fillRect(button.end - line_width/2, 40, line_width/2, 1);

            // Вертикальные линии
            ctx.fillRect(button.begin + line_width/2, 24, 1, 17);
            ctx.fillRect(button.end - line_width/2, 24, 1, 17);
        
            // Горизонтальные указатели
            ctx.fillRect(button.begin + line_width/2, 24, 6, 1);
            ctx.fillRect(button.end - line_width/2 - 6, 24, 6, 1);
        }
        else
        {
            ctx.fillRect(button.begin, 40, button_width, 1);
        }
    }

    // Рисуем вспомогательное меню
    if(menu.length > menu_selected.main)
    {
        if(menu[menu_selected.main].hasOwnProperty("data"))
        {
            // Смещение определяется позицией текущей вкладки и открытого меню
            const shift = (button_width * menu_selected.main) - (button_width * menu_selected.sub)


            for(let i in menu[menu_selected.main].data)
            {
                const button = { 
                    begin: shift + start_pos + button_width * i, 
                    middle: shift + start_pos + (button_width * i) + (button_width/2), 
                    end: shift + start_pos + button_width * i + button_width
                }

                if(menu_selected.sub == i)
                {
                    ctx.fillStyle = '#00FF00';
                }
                else
                {
                    ctx.fillStyle = '#008800';
                }

                ctx.drawCenteredText(menu[menu_selected.main].data[i].name,button.middle, 70);
            }
        }
    }

    // Обработчик радио
    if(["RADIO"].includes(menu[menu_selected.main].name))
    {
        ctx.drawItemList(radioStations,menu_selected.radio);
    }

    // Рисуем футер с датой и временем
    if(["DATA","MAP"].includes(menu[menu_selected.main].name))
    {
        // Рисуем блок с датой
        ctx.fillStyle = '#00FF0022';
        ctx.fillRect(start_pos, canvas.height - 40, uiWidth/4-4, 32);
        ctx.fillStyle = '#00FF00';
        ctx.fillText(mmddyyyy(),start_pos + 8, canvas.height - 16);
    
        // Рисуем блок со временем
        ctx.fillStyle = '#00FF0022';
        ctx.fillRect(start_pos + uiWidth/4, canvas.height - 40, uiWidth/4-4, 32);
        ctx.fillStyle = '#00FF00';
        ctx.fillText(time12(),start_pos + uiWidth/4 + 8, canvas.height - 16);
        

        // Обработчик для карты
        if(["MAP"].includes(menu[menu_selected.main].name))
        {
            if(geo.err.length > 0)
            {
                ctx.drawCenteredText(geo.err,canvas.width/2,canvas.height/2);
            }
            else
            {
                // Рисуем игрока
                ctx.fillStyle = '#00FF00';
                ctx.drawCenteredText(`^`,canvas.width/2,canvas.height/2);

                // Рисуем линии квадрантов
                drawMapGrid();


                // Рисуем маркеры
                ctx.fillStyle = '#00FF00';
                for(let marker of markers)
                {
                    let rel = relativePosition(canvas, geo, marker);

                    //console.log(deltaX, deltaY);

                    ctx.font = '14px Arial';
                    ctx.drawCenteredText("x",rel.x,rel.y);
                    ctx.font = '10px Arial';
                    ctx.drawCenteredText(marker.name,rel.x,rel.y+20);
                    ctx.font = '14px Arial';
                }
            }
        }
    }
}

function relativePosition(canvas,origin,child)
{
    let deltaX = (child.lng - origin.lng) * origin.scale;
    let deltaY = (child.lat - origin.lat) * origin.scale;

    let x = canvas.width / 2 + deltaX;
    let y = canvas.height / 2 - deltaY;

    return {x, y}
}

var controls = {
    up: () => {

        if(menu[menu_selected.main].name == "MAP")
        {
            if(250000 > geo.scale) geo.scale += 1000;
        }
        if(menu[menu_selected.main].name == "RADIO")
        {
            if(menu_selected.radio > 0) menu_selected.radio -= 1;

            for(let station of radioStations) if(station.hasOwnProperty("data")) station.data.stop();
            if(radioStations[menu_selected.radio].hasOwnProperty("data")) radioStations[menu_selected.radio].data.play();
        }
    },
    down: () => {

        if(menu[menu_selected.main].name == "MAP")
        {
            if(geo.scale > 2000) geo.scale -= 1000;
        }
        if(menu[menu_selected.main].name == "RADIO")
        {
            menu_selected.radio += 1;
            if(menu_selected.radio >= radioStations.length) menu_selected.radio = 0;

            for(let station of radioStations) if(station.hasOwnProperty("data")) station.data.stop();
            if(radioStations[menu_selected.radio].hasOwnProperty("data")) radioStations[menu_selected.radio].data.play();
        }
    },
    left: () => {

        if(menu_selected.main > 0)
        {
            menu_selected.main -= 1;
        }
        else
        {
            menu_selected.main = menu.length - 1;
        }
    },
    right: () => {

        if(menu.length - 1 > menu_selected.main)
        {
            menu_selected.main += 1;
        }
        else
        {
            menu_selected.main = 0;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    document.addEventListener('keydown', function(event) {
        console.log(event.code);

        // Управление первичным меню
        if(event.code == "KeyA") controls.left();
        if(event.code == "KeyD") controls.right();

        // Управление масштабированием карты и предметами
        if(event.code == "KeyW") controls.up();
        if(event.code == "KeyS") controls.down();

        // Управление вторичным меню
        if(menu.length - 1 > menu_selected.main && menu[menu_selected.main].hasOwnProperty("data"))
        {
            if(event.code == "KeyZ")
            {
                if(menu_selected.sub > 0)
                {
                    menu_selected.sub -= 1;
                }
                else
                {
                    menu_selected.sub = menu[menu_selected.main].data.length - 1;
                }
            }
            if(event.code == "KeyC")
            {
                if(menu[menu_selected.main].data.length - 1 > menu_selected.sub)
                {
                    menu_selected.sub += 1;
                }
                else
                {
                    menu_selected.sub = 0;
                }
            }
        }
    });

    // Проверяем работает ли гео-локация
    if ("geolocation" in navigator)
    {
        navigator.geolocation.watchPosition((e) => {
            geo.lat = e.coords.latitude;
            geo.lng = e.coords.longitude;
            geo.err = "";
        }, (e) => {
            switch(e.code) {
                case e.PERMISSION_DENIED:
                    geo.err = "ACCESS DENIED";
                    break;
                case e.POSITION_UNAVAILABLE:
                    geo.err = "LOCATION UNAVAILABLE";
                    break;
                case e.TIMEOUT:
                    geo.err = "REQUEST TIMED OUT";
                    break;
                case e.UNKNOWN_ERROR:
                    geo.err = "UNKNOWN ERROR";
                    break;
            }
        },{
            enableHighAccuracy: true,
            timeout: 5000,  // Extend timeout to longer than your interval
            maximumAge: 3000 // Accept cached positions within 10 seconds
        });
    }
    else
    {
        geo.err = "DEVICE UNSUPPORTED";
    }

    document.getElementById('display').addEventListener('click', (event) => {

        // Если это клик в зоне меню
        if(event.clientY >= 0 && 42 > event.clientY)
        {
            const uiWidth = pipWidth - 32;
            const button_width = uiWidth / menu.length;
            const start_pos = (canvas.width/2 - uiWidth/2);

            for(let i in menu)
            {
                const button = { 
                    begin: start_pos + button_width * i, 
                    middle: start_pos + (button_width * i) + (button_width/2), 
                    end: start_pos + button_width * i + button_width
                }

                if(event.clientX > button.begin && button.end > event.clientX)
                {
                    menu_selected.main = i;
                }
            }
        }

        // Переключение вверх вниз пока такое
        const padding = ((canvas.width - pipWidth)/2)
        if(event.clientX > canvas.width - padding)
        {
            if(event.clientY > canvas.height/2)
            {
                controls.down();
            }
            else
            {
                controls.up();
            }
        }
    });

});


setInterval(() => render(), 1000 / 60);
