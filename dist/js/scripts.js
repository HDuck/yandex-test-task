(function init() {
    const APP_KEY = 'b2cd22fe35d415119bb7356909e28892';
    const APP_ID = '7f1e1273';
    const AIRPORT_CODE = 'SVO';
    const TABLE_CLASS = 'avia-board';

    class TableRow {
        constructor(date, city, fscode, flightNum, terminal, status) {
            this.date = date;
            this.city = city;
            this.fsCode = fscode;
            this.fNumber = flightNum;
            this.terminal = terminal;
            this.status = status;
        }

        render() {
            let newRow = document.createElement('div');
            newRow.className = 'row py-2 border-bottom avia-board__row';

            let time = document.createElement('span');
            time.className = 'col-1 time';
            time.textContent = this.date;
            newRow.appendChild(time);

            let city = document.createElement('span');
            city.className = 'col-4 city';
            city.textContent = this.city;
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
    
    let flightData;

    $.ajax({
        method: 'GET',
        url: 'https://api.flightstats.com/',
        dataType: 'jsonp',
        jsonpCallback: 'callback',
        success: (res) => {
            console.log(`Request - success!\nGetting data from external API..`);
            flightData = res;
        },
        error: (_, status) => {
            console.log(`Request - failed! Error: ${status}\nGetting data from local source..`);
            flightData = JSON.parse(testJsonObj);
        }
    })
    .done(() => {
        let flights = getData(flightData, direction);
        renderTable(flights)
    })
    .fail(() => {
        let flights = getData(flightData, direction);
        renderTable(flights);
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
                status: ''
            };

            flight.fsCode.push(fStatus.carrierFsCode);
            flight.flightNum.push(fStatus.flightNumber);

            if (fStatus.codeshares) {

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

            if (direction === 'arr') {
                flight.date = fStatus.arrivalDate.dateLocal.match(/\d\d:\d\d/)[0];
                
                data.appendix.airports.some((airport) => {

                    if (airport.fs === fStatus.departureAirportFsCode) {
                        flight.city = airport.city;
                        return true;
                    }
                });

                if (fStatus.airportResources && fStatus.airportResources.arrivalTerminal) {
                    flight.terminal = fStatus.airportResources.arrivalTerminal;
                }

            } else if (direction === 'dep') {
                flight.date = fStatus.departureDate.dateLocal.match(/\d\d:\d\d/)[0];
                
                data.appendix.airports.some((airport) => {

                    if (airport.fs === fStatus.arrivalAirportFsCode) {
                        flight.city = airport.city;
                        return true;
                    }
                });

                if (fStatus.airportResources && fStatus.airportResources.departureTerminal) {
                    flight.terminal = fStatus.airportResources.departureTerminal;
                }
            }

            flightsArr.push(flight);
        });

        return flightsArr;
    };

    function renderTable(dataArr) {
        let table = document.querySelector(`.${TABLE_CLASS}`);

        dataArr.forEach((item) => {
            let row = new TableRow(
                item.date,
                item.city,
                item.fsCode,
                item.flightNum,
                item.terminal,
                item.status
            );
            
            table.appendChild(row.render());
        });
    }

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
            "arrivalAirportFsCode": "VSO",
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
            "arrivalAirportFsCode": "VSO",
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
                    "dateLocal": "2018-11-13T18:52:00.000"
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
            "arrivalAirportFsCode": "VSO",
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
        }
    ]
}`;