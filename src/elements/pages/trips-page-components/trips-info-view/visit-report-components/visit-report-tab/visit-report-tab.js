'use strict';

Polymer({
    is: 'visit-report-tab',
    properties: {
        report: {
            type: Object,
            value: function() {
                return {
                    request_supply: true,
                    questions: [
                        {category: {value: 3, label: "Other"}, question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?'},
                        {category: {value: 1, label: "Quality"}, question: 'Morbi condimentum, diam quis facilisis tincidunt, lorem mauris elementum neque, in faucibus leo elit ac sem. Mauris vel mi ex. Donec laoreet dolor sit amet nunc luctus, in maximus ante auctor.?'}
                    ],
                    results: [{
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
                    }]
                }
            }
        }
    }
});