/*global Ext*/
/*jslint regexp:false*/

/**
 * This is an example implementation of Portable Contacts 1.0 Draft C: http://portablecontacts.net/draft-spec.html
 */


Ext.require([
    'Poco.Email',
    'Poco.URL',
    'Poco.Phone',
    'Poco.IM',
    'Poco.Photo',
    'Poco.Tag',
    'Poco.Address',
    'Poco.Organization'
]);

Ext.define('Poco.Contact', {
    extend: 'Ext.data.Model',
    
    require: [
        'Ext.data.BelongsToAssociation',
        'Ext.data.HasManyAssociation',
    ],

    proxy: {
        type: 'rest',
        url: 'data.json',
        reader: {
            type: 'json',
            root: 'entry',
            idProperty: 'id',
            totalProperty: 'totalResults'
        },
        writer: {
            root: 'entry'
        }
    },

    fields: [
        // Portable Contacts Singular fields: http://portablecontacts.net/draft-spec.html#anchor16
        /**
         * id:
         * Unique identifier for the Contact. Each Contact returned MUST
         * include a non-empty id value. This identifier MUST be unique
         * across this user's entire set of Contacts, but MAY not be
         * unique across multiple users' data. It MUST be a stable ID
         * that does not change when the same contact is returned in
         * subsequent requests. For instance, an e-mail address is not a
         * good id, because the same person may use a different e-mail
         * address in the future. Usually, in internal database ID will
         * be the right choice here, e.g. "12345".
         */
        { name: 'id', type: 'string' },

        /**
         * displayName:
         * The name of this Contact, suitable for display to end-users.
         * Each Contact returned MUST include a non-empty displayName value.
         * The name SHOULD be the full name of the Contact being described
         * if known (e.g. Joseph Smarr or Mr. Joseph Robert Smarr, Esq.),
         * but MAY be a username or handle, if that is all that is available
         * (e.g. jsmarr). The value provided SHOULD be the primary textual
         * label by which this Contact is normally displayed by the
         * Service Provider when presenting it to end-users.
         */
        { name: 'displayName', type: 'string' },

        /**
         * Draft spec: The components of the contact's real name.
         * Providers MAY return just the full name as a single string in the formatted
         * sub-field, or they MAY return just the individual component fields using
         * the other sub-fields, or they MAY return both. If both variants are returned,
         * they SHOULD be describing the same name, with the formatted name indicating
         * how the component fields should be combined.
         */
        {
            name: 'name',
            type: 'auto',
            convert: function (value, record) {
                return value || {};
            }
        }, // This is a nested object. Getters and setters defined below

        /**
         * nickname:
         * The casual way to address this Contact in real life, e.g. "Bob" or
         * "Bobby" instead of "Robert". This field SHOULD NOT be used to represent
         * a user's username (e.g. jsmarr or daveman692); the latter should be
         * represented by the preferredUsername field.
         */
        { name: 'nickname', type: 'string', optional: true, defaultValue: null },

        /**
         * published:
         * The date this Contact was first added to the user's address book or
         * friends list (i.e. the creation date of this entry). The value MUST be a
         * valid xs:dateTime (e.g. 2008-01-23T04:56:22Z).
         */
        { name: 'published', type: 'date', dateFormat: 'c', optional: true, defaultValue: null },

        /**
         * updated:
         * The most recent date the details of this Contact were updated (i.e. the
         * modified date of this entry). The value MUST be a valid xd:dateTime
         * (e.g. 2008-01-23T04:56:22Z). If this Contact has never been modified
         * since its initial creation, the value MUST be the same as the value
         * of published. Note the updatedSince Query Parameter described in
         * Section 6.3 (Query Parameters) can be used to select only contacts
         * whose updated value is equal to or more recent than a given xs:dateTime.
         * This enables Consumers to repeatedly access a user's data and only
         * request newly added or updated contacts since the last access time.
         */
        { name: 'updated', type: 'date', dateFormat: 'c', optional: true, defaultValue: null },

        /**
         * birthday:
         * The birthday of this contact. The value MUST be a valid xs:date
         * (e.g. 1975-02-14). The year value MAY be set to 0000 when the age of
         * the Contact is private or the year is not available.
         */
        { name: 'birthday', type: 'date', dateFormat: 'c', optional: true, defaultValue: null },

        /**
         * anniversary:
         * The wedding anniversary of this contact. The value MUST be a valid
         * xs:date (e.g. 1975-02-14. The year value MAY be set to 0000 when the
         * year is not available.
         */
        { name: 'anniversary', type: 'date', dateFormat: 'c', optional: true, defaultValue: null },

        /**
         * gender:
         * The gender of this contact. Service Providers SHOULD return one of the
         * following Canonical Values, if appropriate: male, female, or
         * undisclosed, and MAY return a different value if it is not covered by
         * one of these Canonical Values.
         */
        { name: 'gender', type: 'string', optional: true, defaultValue: null },

        /**
         * note:
         * Notes about this contact, with an unspecified meaning or usage
         * (normally contact notes by the user about this contact).
         * This field MAY contain newlines.
         */
        { name: 'note', type: 'string', optional: true, defaultValue: null },

        /**
         * preferredUsername:
         * The preferred username of this contact on sites that ask for a username
         * (e.g. jsmarr or daveman692). This field may be more useful for
         * describing the owner (i.e. the value when /@me/@self is requested) than
         * the user's contacts, e.g. Consumers MAY wish to use this value to
         * pre-populate a username for this user when signing up for a new service.
         */
        { name: 'preferredUsername', type: 'string', optional: true, defaultValue: null },

        /**
         * utcOffset:
         * The offset from UTC of this Contact's current time zone, as of the time
         * this response was returned. The value MUST conform to the offset
         * portion of xs:dateTime, e.g. -08:00. Note that this value MAY change
         * over time due to daylight saving time, and is thus meant to signify
         * only the current value of the user's timezone offset.
         */
        { name: 'utcOffset', type: 'date', dateFormat: 'P', optional: true, defaultValue: null },

        /**
         * connected:
         * Boolean value indicating whether the user and this Contact have
         * established a bi-directionally asserted connection of some kind on
         * the Service Provider's service. The value MUST be either true or false.
         * The value MUST be true if and only if there is at least one value for
         * the relationship field, described below, and is thus intended as a
         * summary value indicating that some type of bi-directional relationship
         * exists, for Consumers that aren't interested in the specific nature of
         * that relationship. For traditional address books, in which a user
         * stores information about other contacts without their explicit
         * acknowledgment, or for services in which users choose to "follow" other
         * users without requiring mutual consent, this value will always be false.
         */
        { name: 'connected', type: 'boolean', optional: true, defaultValue: false }
/*
        // Open Social Singular fields
        { name: 'aboutMe', type: 'string' },
        { name: 'bodyType', type: 'string' },
        { name: 'currentLocation', type: 'string' },
        { name: 'drinker', type: 'string' },
        { name: 'ethnicity', type: 'string' },
        { name: 'fashion', type: 'string' },
        { name: 'happiestWhen', type: 'string' },
        { name: 'humor', type: 'string' },
        { name: 'livingArrangement', type: 'string' },
        { name: 'lookingFor', type: 'string' },
        { name: 'profileSong', type: 'string' },
        { name: 'profileVideo', type: 'string' },
        { name: 'relationshipStatus', type: 'string' },
        { name: 'religion', type: 'string' },
        { name: 'romance', type: 'string' },
        { name: 'scaredOf', type: 'string' },
        { name: 'sexualOrientation', type: 'string' },
        { name: 'smoker', type: 'string' },
        { name: 'status', type: 'string' }
*/
    ],

    // Plural fields
    hasMany: [
        { inner: true, model: 'Poco.Email', name: 'emails' },
        { inner: true, model: 'Poco.URL', name: 'urls' },
        { inner: true, model: 'Poco.Phone', name: 'phoneNumbers' },
        { inner: true, model: 'Poco.IM', name: 'ims' },
        { inner: true, model: 'Poco.Photo', name: 'photos' },
        { inner: true, model: 'Poco.Tag', name: 'tags' },
//        { inner: true, model: 'Poco.Relationship', name: 'relationships' },
        { inner: true, model: 'Poco.Address', name: 'addresses' },
        { inner: true, model: 'Poco.Organization', name: 'organizations' }
//        { inner: true, model: 'Poco.Account', name: 'accounts' }
    ],

    validations: [
        { field: 'id', type: 'presence' },
        { field: 'displayName', type: 'presence' }
    ],

    setFormatted: function (value) {
        // TODO
    },

    getDisplayName: function () {
        return this.getFormattedName() || this.get('displayName') || this.getEmail().get('value').replace(/@.*/, '') || 'unnamed';
    }
});

Ext.onReady(function () {
    var proto = Ext.ModelMgr.getModel('Poco.Contact').prototype,
        nameFields = ['honorificPrefix', 'givenName', 'middleName', 'familyName', 'honorificSuffix'],
        pluralFields = [
            { single: 'email', plural: 'emails'},
            { single: 'url', plural: 'urls'},
            { single: 'phoneNumber', plural: 'phoneNumbers'},
            { single: 'im', plural: 'ims'},
            { single: 'address', plural: 'addresses'},
            { single: 'organization', plural: 'organizations'}
        ];

    nameFields.forEach(function (item) {
        proto['get' + Ext.String.capitalize(item)] = function () {
            return this.data.name[item];
        };

        proto['set' + Ext.String.capitalize(item)] = function (value) {
            this.data.name[item] = value;

            if (this.data.name.formatted) {
                this.data.name.formatted = nameFields.map(function (item) {
                    return this.data.name[item];
                }, this).filter(function (item) {
                    return !!item;
                }).join(' ');
            }
        };
    });

    proto.getFormattedName = function () {
        var fn = this.data.name.formatted;
        if (!fn) {
            fn = nameFields.map(function (item) {
                return this.data.name[item];
            }, this).filter(function (item) {
                return !!item;
            }).join(' ');
        }
        return fn;
    };

    pluralFields.forEach(function (item) {
        proto['get' + Ext.String.capitalize(item.single)] = function () {
            var store = this[item.plural](),
                idx = store.findExact('primary', true);
            return store.getAt(idx === -1 ? 0 : idx);
        };
    });
});
