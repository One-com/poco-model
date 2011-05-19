/*global Ext*/

Ext.define('Poco.Photo', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'value', type: 'string' },
        { name: 'type', type: 'string', optional: true, defaultValue: null },
        { name: 'primary', type: 'boolean', optional: true, defaultValue: null }
    ],

    belongsTo: 'Contact',

    validations: [
        { field: 'value', type: 'presence' },
        { field: 'value', type: 'url' }, // TODO: Photo URL
        { field: 'type', type: 'inclusion', list: ['home', 'work', 'blog', 'profile', 'other'], optional: true },
        { field: 'primary', type: 'pocoprimary' }
    ]
});

