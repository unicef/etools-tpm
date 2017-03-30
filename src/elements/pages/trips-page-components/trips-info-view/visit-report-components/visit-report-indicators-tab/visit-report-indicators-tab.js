'use strict';

Polymer({
    is: 'visit-report-indicators-tab',
    properties: {
        results: {
            type: Array,
            value: [{
                result: 'Output 1: Lorem ipsum dolor sit amet consectetur',
                indicators: [{
                    indicator: '% parents, students and sschool staff that demonsrtate increased knowledge on inclusive',
                    results: [{reported: '15', location: 'Ghazze (#125646)'}, {reported: '12', location: 'Mount Lebanon (#234646)'}]
                },{
                    indicator: '# of resource rooms and upgraded to accommodate students with disabilities',
                    results: [{reported: '0', location: 'Ghazze (#125646)'}, {reported: '20', location: 'Mount Lebanon (#234646)'}]
                },{
                    indicator: '# teachers trained to accomodate students with disabilities',
                    results: [{reported: '35', location: 'Ghazze (#125646)'}, {reported: '55', location: 'Mount Lebanon (#234646)'}]
                },{
                    indicator: '% lorem ipsum dolor sit amet dolor',
                    results: [{reported: '89', location: 'Ghazze (#125646)'}, {reported: '80', location: 'Mount Lebanon (#234646)'}]
                }]
            },{
                result: 'Output 2: Lorem ipsum dolor sit amet consectetur',
                indicators: [{
                    indicator: '% parents, students and sschool staff that demonsrtate increased knowledge on inclusive',
                    results: [{reported: '15', location: 'Ghazze (#125646)'}, {reported: '12', location: 'Mount Lebanon (#234646)'}]
                },{
                    indicator: '# of resource rooms and upgraded to accommodate students with disabilities',
                    results: [{reported: '0', location: 'Ghazze (#125646)'}, {reported: '20', location: 'Mount Lebanon (#234646)'}]
                },{
                    indicator: '# teachers trained to accomodate students with disabilities',
                    results: [{reported: '35', location: 'Ghazze (#125646)'}, {reported: '55', location: 'Mount Lebanon (#234646)'}]
                }]
            }],
            notify: true
        }
    }
});