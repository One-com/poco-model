/*global Ext*/

Ext.define('Poco.Tag', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'value', type: 'string' }
    ],

    belongsTo: 'Contact',

    validations: [
        { field: 'value', type: 'presence' }
    ]
});

