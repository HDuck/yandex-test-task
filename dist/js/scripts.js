(function init() {
    const APP_KEY = 'b2cd22fe35d415119bb7356909e28892';
    const APP_ID = '7f1e1273';
    const AIRPORT_CODE = 'SVO';
    const TABLE_CLASS = 'avia-board';
    const DELAY_THRESHOLD = 15;

    class TableRow {
        constructor(date, city, fscode, flightNum, terminal, status, delayed, delayedDate, delay, direction) {
            this.date = date;
            this.city = city;
            this.fsCode = fscode;
            this.fNumber = flightNum;
            this.terminal = terminal;
            this.status = status;
            this.delayed = delayed;
            this.delayedDate = delayedDate;
            this.delay = delay;
            this.direction = direction;
        }

        render() {
            let newRow = document.createElement('div');
            newRow.className = 'row py-2 border-bottom avia-board__row';

            let time = document.createElement('span');
            time.className = 'col-1 time';
            time.textContent = this.delayed
                ? `${this.delayedDate} (${this.delay}min)`
                : this.date;
            newRow.appendChild(time);

            let city = document.createElement('span');
            city.className = 'col-4 city';
            city.textContent = this.delayed && this.direction
                ? `${this.city} (${this.direction})`
                : this.city;
            newRow.appendChild(city);

            let flightNums = document.createElement('div');
            flightNums.className = 'col-2 flight-nums';

            for (let i = 0; i < this.fsCode.length; i++) {
                let num = document.createElement('p');
                num.className = 'm-0 num';
                num.textContent = `${this.fsCode[i]} ${this.fNumber[i]}`;

                flightNums.appendChild(num);
            }
            
            newRow.appendChild(flightNums);

            let terminal = document.createElement('span');
            terminal.className = 'col-1 terminal';
            terminal.textContent = this.terminal;
            newRow.appendChild(terminal);

            let status = document.createElement('span');
            status.className = 'col-4 status';
            status.textContent = this.status;
            newRow.appendChild(status);

            return newRow;
        }
    }

    let today = getCurrDate();
    let direction = 'arr';
    let flightsApi = `https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/airport/status/${AIRPORT_CODE}/${direction}/${today}?appId=${APP_ID}&appKey=${APP_KEY}&utc=false&numHours=2`;
    let flightsDummyUrl = 'https://api.flightstats.com/';

    let resultsArr = [];

    $.ajax({
        method: 'GET',
        url: flightsDummyUrl,
        dataType: 'jsonp',
        jsonpCallback: 'callback'
    })
        .done((arrivalData) => {
            console.log(`Request for arrival flights have been completed with success!\nGetting data from external API..`);

            let arrFlights = getData(arrivalData, direction);
            renderTable(arrFlights, direction);
            resultsArr.push(arrFlights);

            // Второй последовательный запрос 

            direction = 'dep';
            let flightsApi = `https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/airport/status/${AIRPORT_CODE}/${direction}/${today}?appId=${APP_ID}&appKey=${APP_KEY}&utc=false&numHours=2`;

            return $.ajax({
                method: 'GET',
                url: flightsDummyUrl,
                dataType: 'jsonp',
                jsonpCallback: 'callback'
            })
                .done((departureData) => {
                    console.log(`Request for departure flights have been completed with success!\nGetting data from external API..`);
    
                    let depFlights = getData(departureData, direction);
                    renderTable(depFlights, direction);
                    resultsArr.push(depFlights);

                    let delFlights = getDelayedFlights(resultsArr);
                    renderTable(delFlights);
                })
                .fail((_, status) => {
                    console.log(`Request for departure flights have been failed! Error: ${status}\nGetting data from local source..`);
    
                    let data = JSON.parse(testJsonObj);
    
                    let depFlights = getData(data, direction);
                    renderTable(depFlights, direction);
                    resultsArr.push(depFlights);

                    let delFlights = getDelayedFlights(resultsArr);
                    renderTable(delFlights);
                });
        })
        .fail((_, status) => {
            console.log(`Request for arrival flights have been failed! Error: ${status}\nGetting data from local source..`);

            let data = JSON.parse(testJsonObj);

            let arrFlights = getData(data, direction);
            renderTable(arrFlights, direction);
            resultsArr.push(arrFlights);
            
            // Второй последовательный запрос 

            direction = 'dep';
            let flightsApi = `https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/airport/status/${AIRPORT_CODE}/${direction}/${today}?appId=${APP_ID}&appKey=${APP_KEY}&utc=false&numHours=2`;

            return $.ajax({
                method: 'GET',
                url: flightsDummyUrl,
                dataType: 'jsonp',
                jsonpCallback: 'callback'
            })
                .done((departureData) => {
                    console.log(`Request for departure flights have been completed with success!\nGetting data from external API..`);
    
                    let depFlights = getData(departureData, direction);
                    renderTable(depFlights, direction);
                    resultsArr.push(depFlights);

                    let delFlights = getDelayedFlights(resultsArr);
                    renderTable(delFlights);
                })
                .fail((_, status) => {
                    console.log(`Request for departure flights have been failed! Error: ${status}\nGetting data from local source..`);
    
                    let data = JSON.parse(testJsonObj);
    
                    let depFlights = getData(data, direction);
                    renderTable(depFlights, direction);
                    resultsArr.push(depFlights);

                    let delFlights = getDelayedFlights(resultsArr);
                    renderTable(delFlights);
                });
        });

    // Создание массива с необходимыми данными
    
    function getData(data, direction) {
        let flightsArr = [];

        data.flightStatuses.forEach((fStatus) => {
            let flight = {
                date: '',
                city: '',
                fsCode: [],
                flightNum: [],
                terminal: '',
                status: '',
                delayed: false,
                delayedDate: '',
                delay: '',
                direction: ''
            };

            flight.fsCode.push(fStatus.carrierFsCode);
            flight.flightNum.push(fStatus.flightNumber);

            if (checkCodeshares(fStatus)) {

                fStatus.codeshares.forEach((item) => {
                    flight.fsCode.push(item.fsCode);
                    flight.flightNum.push(item.flightNumber);
                });
            }

            switch (fStatus.status) {
                case 'A': {
                    flight.status = 'Active';
                    break;
                }
                case 'C': {
                    flight.status = 'Canceled';
                    break;
                }
                case 'D': {
                    flight.status = 'Diverted';
                    break;
                }
                case 'DN': {
                    flight.status = 'Data source needed';
                    break;
                }
                case 'L': {
                    flight.status = 'Landed';
                    break;
                }
                case 'NO': {
                    flight.status = 'Not Operational';
                    break;
                }
                case 'R': {
                    flight.status = 'Redirected';
                    break;
                }
                case 'S': {
                    flight.status = 'Scheduled';
                    break;
                }
                default: {
                    flight.status = 'Unknown';
                }
            }

            flight.direction = direction === 'arr'
                ? 'arrival'
                : 'departure';

            if (direction === 'arr') {
                flight.date = fStatus.arrivalDate.dateLocal.match(/\d\d:\d\d/)[0];
                
                data.appendix.airports.some((airport) => {

                    if (airport.fs === fStatus.departureAirportFsCode) {
                        flight.city = airport.city;
                        return true;
                    }
                });

                if (checkAirportResources(fStatus, direction)) {
                    flight.terminal = fStatus.airportResources.arrivalTerminal;
                }

                if (checkOperationalTimes(fStatus, direction)) {
                    let scheduledGArrTime = fStatus.operationalTimes.scheduledGateArrival.dateLocal.match(/(\d\d):(\d\d)/)[0];
                    let estimatedGArrTime = fStatus.operationalTimes.estimatedGateArrival.dateLocal.match(/(\d\d):(\d\d)/)[0];

                    let scheduledTimeHours = parseInt(scheduledGArrTime.replace(/(\d\d):(\d\d)/, '$1'), 10);
                    let scheduledTimeMinutes = parseInt(scheduledGArrTime.replace(/(\d\d):(\d\d)/, '$2'), 10);
                    let estimatedTimeHours = parseInt(estimatedGArrTime.replace(/(\d\d):(\d\d)/, '$1'), 10);
                    let estimatedTimeMinutes = parseInt(estimatedGArrTime.replace(/(\d\d):(\d\d)/, '$2'), 10);

                    let difference = estimatedTimeHours * 60 + estimatedTimeMinutes - (scheduledTimeHours * 60 + scheduledTimeMinutes);

                    if (difference >= DELAY_THRESHOLD) {

                        flight.delayed = true;
                        flight.delayedDate = estimatedGArrTime;
                        flight.delay = difference;
                    }
                }

            } else if (direction === 'dep') {
                flight.date = fStatus.departureDate.dateLocal.match(/\d\d:\d\d/)[0];
                
                data.appendix.airports.some((airport) => {

                    if (airport.fs === fStatus.arrivalAirportFsCode) {
                        flight.city = airport.city;
                        return true;
                    }
                });

                if (checkAirportResources(fStatus, direction)) {
                    flight.terminal = fStatus.airportResources.departureTerminal;
                }
                
                if (checkOperationalTimes(fStatus, direction)) {
                    let scheduledGDepTime = fStatus.operationalTimes.scheduledGateDeparture.dateLocal.match(/(\d\d):(\d\d)/)[0];
                    let estimatedGDepTime = fStatus.operationalTimes.estimatedGateDeparture.dateLocal.match(/(\d\d):(\d\d)/)[0];

                    let scheduledTimeHours = parseInt(scheduledGDepTime.replace(/(\d\d):(\d\d)/, '$1'), 10);
                    let scheduledTimeMinutes = parseInt(scheduledGDepTime.replace(/(\d\d):(\d\d)/, '$2'), 10);
                    let estimatedTimeHours = parseInt(estimatedGDepTime.replace(/(\d\d):(\d\d)/, '$1'), 10);
                    let estimatedTimeMinutes = parseInt(estimatedGDepTime.replace(/(\d\d):(\d\d)/, '$2'), 10);

                    let difference = estimatedTimeHours * 60 + estimatedTimeMinutes - (scheduledTimeHours * 60 + scheduledTimeMinutes);

                    if (difference >= DELAY_THRESHOLD) {

                        flight.delayed = true;
                        flight.delayedDate = estimatedGDepTime;
                        flight.delay = difference;
                    }
                }
            }

            flightsArr.push(flight);
        });

        function checkCodeshares(fStatus) {
            return fStatus.codeshares;
        }

        function checkAirportResources(fStatus, direction) {
            
            return direction === 'arr'
                ? fStatus.airportResources
                    && fStatus.airportResources.arrivalTerminal
                : fStatus.airportResources
                    && fStatus.airportResources.departureTerminal;
        }

        function checkOperationalTimes(fStatus, direction) {
            
            return direction === 'arr'
                ? fStatus.operationalTimes
                    && fStatus.operationalTimes.scheduledGateArrival
                    && fStatus.operationalTimes.estimatedGateArrival
                : fStatus.operationalTimes
                    && fStatus.operationalTimes.scheduledGateDeparture
                    && fStatus.operationalTimes.estimatedGateDeparture;
        }

        return flightsArr;
    };

    function getDelayedFlights(results) {
        let delFlightsArr = [];

        // Для прилетающих рейсов

        results[0].forEach((flight) => {

            if (flight.delayed) {
                delFlightsArr.push(flight);
            }
        })

        // Для улетающих рейсов

        results[1].forEach((flight) => {

            if (flight.delayed) {
                delFlightsArr.push(flight);
            }
        });

        return delFlightsArr;
    }

    // Отрисовка таблицы с данными рейсов

    function renderTable(dataArr, direction) {
        let selector = direction === 'arr'
            ? `.${TABLE_CLASS} #arrival`
            : direction === 'dep'
                ? `.${TABLE_CLASS} #departure`
                : `.${TABLE_CLASS} #delayed`;

        let tableCont = document.querySelector(selector);

        if (direction) {
            dataArr.forEach((item) => {
                let row = new TableRow(
                    item.date,
                    item.city,
                    item.fsCode,
                    item.flightNum,
                    item.terminal,
                    item.status,
                    item.delayed,
                    item.delayedDate,
                    item.delay
                );
                
                tableCont.appendChild(row.render());
            });
        
        } else {
            dataArr.forEach((item) => {
                let row = new TableRow(
                    item.date,
                    item.city,
                    item.fsCode,
                    item.flightNum,
                    item.terminal,
                    item.status,
                    item.delayed,
                    item.delayedDate,
                    item.delay,
                    item.direction
                );
                
                tableCont.appendChild(row.render());
            });
        }

        
    }

    // Текущая дата для запроса на API

    function getCurrDate() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();

        return `${year}/${month}/${day}/${hour}`;
    }
})();
var testJsonObj = `{
    "appendix": {
        "airports": [
            {
                "fs": "BCN",
                "city": "Barcelona"
            },        
            {
                "fs": "CDG",
                "city": "Paris"
            }
        ]
    },
    "flightStatuses": [
        {
            "flightId": "1",
            "carrierFsCode": "SU",
            "flightNumber": "2471",
            "departureAirportFsCode": "BCN",
            "arrivalAirportFsCode": "BCN",
            "departureDate": {
                "dateLocal": "2018-11-13T13:05:00.000"
            },
            "arrivalDate": {
                "dateLocal": "2018-11-13T19:05:00.000"
            },
            "status": "A",
            "operationalTimes": {
                "scheduledGateDeparture": {
                    "dateLocal": "2018-11-13T13:05:00.000"
                },
                "estimatedGateDeparture": {
                    "dateLocal": "2018-11-13T12:46:00.000"
                },
                "scheduledGateArrival": {
                    "dateLocal": "2018-11-13T19:05:00.000"
                },
                "estimatedGateArrival": {
                    "dateLocal": "2018-11-13T18:52:00.000"
                }
            },
            "airportResources": {
                "departureTerminal": "A",
                "arrivalTerminal": "E"
            },
            "codeshares": [
                {
                    "fsCode": "AF",
                    "flightNumber": "4898"
                },
                {
                    "fsCode": "UE",
                    "flightNumber": "4750"
                }
            ]
        },
        {
            "flightId": "2",
            "carrierFsCode": "SU",
            "flightNumber": "2471",
            "departureAirportFsCode": "BCN",
            "arrivalAirportFsCode": "CDG",
            "departureDate": {
                "dateLocal": "2018-11-13T13:05:00.000"
            },
            "arrivalDate": {
                "dateLocal": "2018-11-13T19:05:00.000"
            },
            "status": "R",
            "operationalTimes": {
                "scheduledGateDeparture": {
                    "dateLocal": "2018-11-13T13:05:00.000"
                },
                "estimatedGateDeparture": {
                    "dateLocal": "2018-11-13T12:46:00.000"
                },
                "scheduledGateArrival": {
                    "dateLocal": "2018-11-13T19:05:00.000"
                },
                "estimatedGateArrival": {
                    "dateLocal": "2018-11-13T19:52:00.000"
                }
            },
            "airportResources": {
                "departureTerminal": "A",
                "arrivalTerminal": "E"
            }
        },
        {
            "flightId": "3",
            "carrierFsCode": "SU",
            "flightNumber": "2471",
            "departureAirportFsCode": "CDG",
            "arrivalAirportFsCode": "CDG",
            "departureDate": {
                "dateLocal": "2018-11-13T13:05:00.000"
            },
            "arrivalDate": {
                "dateLocal": "2018-11-13T19:05:00.000"
            },
            "status": "",
            "operationalTimes": {
                "scheduledGateDeparture": {
                    "dateLocal": "2018-11-13T13:05:00.000"
                },
                "estimatedGateDeparture": {
                    "dateLocal": "2018-11-13T13:46:00.000"
                },
                "scheduledGateArrival": {
                    "dateLocal": "2018-11-13T19:05:00.000"
                },
                "estimatedGateArrival": {
                    "dateLocal": "2018-11-13T18:52:00.000"
                }
            },
            "airportResources": {
                "departureTerminal": "A",
                "arrivalTerminal": "E"
            },
            "codeshares": [
                {
                    "fsCode": "AF",
                    "flightNumber": "4898"
                },
                {
                    "fsCode": "UE",
                    "flightNumber": "4750"
                }
            ]
        }
    ]
}`;