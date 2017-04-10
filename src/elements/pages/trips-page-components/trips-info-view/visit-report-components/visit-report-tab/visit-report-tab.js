'use strict';

Polymer({
    is: 'visit-report-tab',
    properties: {
        report: {
            type: Object,
            value: function() {
                return {
                    indicators: [
                        {
                            location: 'Ghazze (#125646)',
                            results: [{
                                result: 'Output 1: Lorem ipsum dolor sit amet consectetur',
                                indicators_points: [{
                                    indicator: '% parents, students and sschool staff that demonsrtate increased knowledge on inclusive',
                                    reported: '15'
                                },{
                                    indicator: '# of resource rooms and upgraded to accommodate students with disabilities',
                                    reported: '0'
                                },{
                                    indicator: '# teachers trained to accomodate students with disabilities',
                                    reported: '35'
                                },{
                                    indicator: '% lorem ipsum dolor sit amet dolor',
                                    reported: '89'
                                }]
                            },{
                                result: 'Output 2: Lorem ipsum dolor sit amet consectetur',
                                indicators_points: [{
                                    indicator: '% parents, students and sschool staff that demonsrtate increased knowledge on inclusive',
                                    reported: '12'
                                },{
                                    indicator: '# of resource rooms and upgraded to accommodate students with disabilities',
                                    reported: '0'
                                },{
                                    indicator: '# teachers trained to accomodate students with disabilities',
                                    reported: '35'
                                }]
                            }],
                            questions: [
                                {
                                    category: {value: 3, label: 'Other'},
                                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?'
                                },
                                {
                                    category: {value: 1, label: 'Quality'},
                                    question: 'Morbi condimentum, diam quis facilisis tincidunt, lorem mauris elementum neque, in faucibus leo elit ac sem. Mauris vel mi ex. Donec laoreet dolor sit amet nunc luctus, in maximus ante auctor.?'
                                }
                            ]
                        },
                        {
                            location: 'Mount Lebanon (#4564489)',
                            results: [{
                                result: 'Output 1: Lorem ipsum dolor sit amet consectetur',
                                indicators_points: [{
                                    indicator: '% parents, students and sschool staff that demonsrtate increased knowledge on inclusive',
                                    reported: '15'
                                },{
                                    indicator: '# of resource rooms and upgraded to accommodate students with disabilities',
                                    reported: '0'
                                },{
                                    indicator: '# teachers trained to accomodate students with disabilities',
                                    reported: '35'
                                },{
                                    indicator: '% lorem ipsum dolor sit amet dolor',
                                    reported: '89'
                                }]
                            },{
                                result: 'Output 2: Lorem ipsum dolor sit amet consectetur',
                                indicators_points: [{
                                    indicator: '% parents, students and sschool staff that demonsrtate increased knowledge on inclusive',
                                    reported: '12'
                                },{
                                    indicator: '# of resource rooms and upgraded to accommodate students with disabilities',
                                    reported: '0'
                                },{
                                    indicator: '# teachers trained to accomodate students with disabilities',
                                    reported: '35'
                                }]
                            }],
                            questions: [
                                {
                                    category: {value: 3, label: 'Other'},
                                    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?'
                                },
                                {
                                    category: {value: 1, label: 'Quality'},
                                    question: 'Morbi condimentum, diam quis facilisis tincidunt, lorem mauris elementum neque, in faucibus leo elit ac sem. Mauris vel mi ex. Donec laoreet dolor sit amet nunc luctus, in maximus ante auctor.?'
                                }
                            ]
                        }
                    ]

                };
            }
        }
    }
});
