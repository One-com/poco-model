/*global Ext*/

Ext.define('Poco.Phone', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'value', type: 'string' },
        { name: 'type', type: 'string', optional: true, defaultValue: null },
        { name: 'primary', type: 'boolean', optional: true, defaultValue: null }
    ],

    belongsTo: 'Contact',

    validations: [
        { field: 'value', type: 'presence' },
        { field: 'value', type: 'format', matcher: /^\+?[\d\- #]+$/ }, // FIXME: Put in a proper phone number validation regex
        { field: 'type', type: 'inclusion', list: ['home', 'work', 'mobile', 'fax', 'pager', 'other'], optional: true },
        { field: 'primary', type: 'pocoprimary' }
    ]
});

