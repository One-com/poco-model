/*global Ext*/

Ext.define('Poco.URL', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.BelongsToAssociation'
    ],

    fields: [
        { name: 'value', type: 'string' },
        { name: 'type', type: 'string', optional: true, defaultValue: null },
        { name: 'primary', type: 'boolean', optional: true, defaultValue: null }
    ],

    belongsTo: 'Poco.Contact',

    validations: [
        { field: 'value', type: 'presence' },
        { field: 'value', type: 'url' },
        { field: 'type', type: 'inclusion', list: ['home', 'work', 'blog', 'profile', 'other'], optional: true },
        { field: 'primary', type: 'pocoprimary' }
    ]
});

