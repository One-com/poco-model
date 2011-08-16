/*global Ext*/

Ext.define('Poco.Organization', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.BelongsToAssociation'
    ],

    fields: [
        { name: 'name', type: 'string' },
        { name: 'department', type: 'string', optional: true, defaultValue: null },
        { name: 'title', type: 'string', optional: true, defaultValue: null },
        { name: 'type', type: 'string', optional: true, defaultValue: null },
        { name: 'startDate', type: 'date', dateFormat: 'c', optional: true, defaultValue: null },
        { name: 'endDate', type: 'date', dateFormat: 'c', optional: true, defaultValue: null },
        { name: 'location', type: 'string', optional: true, defaultValue: null },
        { name: 'description', type: 'string', optional: true, defaultValue: null },
        { name: 'primary', type: 'boolean', optional: true, defaultValue: null }
    ],

    belongsTo: 'Poco.Contact',

    validations: [
        { field: 'name', type: 'presence' },
        { field: 'type', type: 'inclusion', list: ['job', 'school'], optional: true },
        { field: 'primary', type: 'pocoprimary' }
    ]
});

