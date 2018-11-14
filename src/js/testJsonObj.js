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
            "flightNumber": "2472",
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
            "flightNumber": "2473",
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
                    "flightNumber": "4899"
                },
                {
                    "fsCode": "UE",
                    "flightNumber": "4751"
                }
            ]
        }
    ]
}`;