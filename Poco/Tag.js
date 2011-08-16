/*global Ext*/

Ext.define('Poco.Tag', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.BelongsToAssociation'
    ],

    fields: [
        { name: 'value', type: 'string' }
    ],

    belongsTo: 'Poco.Contact',

    validations: [
        { field: 'value', type: 'presence' }
    ]
});

