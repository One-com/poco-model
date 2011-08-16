/*global Ext*/

Ext.define('Poco.Address', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.BelongsToAssociation'
    ],

    /**
      * Draft spec: The components of a physical mailing address.
      * Service Providers MAY return just the full address as a single string in the
      * formatted sub-field, or they MAY return just the individual component fields
      * using the other sub-fields, or they MAY return both. If both variants are
      * returned, they SHOULD be describing the same address, with the formatted
      * address indicating how the component fields should be combined.
      */
    fields: [
        // The full mailing address, formatted for display or use with a mailing label.
        // This field MAY contain newlines.
        // This is the Primary Sub-Field for this field, for the purposes of sorting and filtering.
        { name: 'formatted', type: 'string', optional: true, defaultValue: null },
        // The full street address component, which may include house number, street name, PO BOX, and multi-line extended street address information.
        // This field MAY contain newlines.
        { name: 'StreetAddress', type: 'string', optional: true, defaultValue: null },
        // The city or locality component.
        { name: 'locality', type: 'string', optional: true, defaultValue: null },
        // The state or region component
        { name: 'region', type: 'string', optional: true, defaultValue: null },
        { name: 'postalCode', type: 'string', optional: true, defaultValue: null },
        { name: 'country', type: 'string', optional: true, defaultValue: null },
        { name: 'type', type: 'string', optional: true, defaultValue: null },
        { name: 'primary', type: 'boolean', optional: true, defaultValue: null }
    ],

    belongsTo: 'Poco.Contact',

    validations: [
        { field: 'type', type: 'inclusion', list: ['home', 'work', 'other'], optional: true },
        { field: 'primary', type: 'pocoprimary' }
    ]
});

