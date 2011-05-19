/*global Ext*/

Ext.define('Poco.IM', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'value', type: 'string' },
        { name: 'type', type: 'string', optional: true, defaultValue: null },
        { name: 'primary', type: 'boolean', optional: true, defaultValue: null }
    ],

    belongsTo: 'Contact',

    validations: [
        { field: 'value', type: 'presence' },
        { field: 'type', type: 'inclusion', list: ['aim', 'gtalk', 'icq', 'xmpp', 'msn', 'skype', 'qq', 'yahoo'], optional: true },
        { field: 'primary', type: 'pocoprimary' }
    ]
});

