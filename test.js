/*global one, abook, Ext, console, window*/
/*jslint white:false*/ // JSLint doesn't like our preferred indentation of the Ext.XTemplates

Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': 'Ext/src',
        'One': 'One',
        'PoCo': 'PoCo'
    }
});

Ext.require([
    'Ext.data.Store',
    'Ext.data.StoreManager',
    'Ext.data.HasManyAssociation',
    'Ext.data.BelongsToAssociation',
    'Poco.Contact'
]);

Ext.onReady(function () {
    var store = Ext.create('Ext.data.Store', {
        model: 'Poco.Contact',
        storeId: 'contacts',
        autoLoad: true,
        autoSave: true,

        proxy: {
            type: 'rest',
            url: 'data/many.json',
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

        listeners: {
            load: function (store, records, success) {
                var contact = store.getAt(2),
                    mail = contact.emails().first(),
                    logger = function (record) {
                        console.log(JSON.stringify(record.getProxy().getWriter().getRecordData(record)));
                    };

                console.group('Deep validation');
                    var errors = store.getAt(0).validate();
                    if (errors.length > 0) {
                        errors.items.forEach(function(error) {
                            console.error('"' + error.value +'" ' + error.message);
                        });
                    }
                console.groupEnd();

                console.group('Synchronization of unchanged store');
                    store.sync();
                console.groupEnd();

                console.group('Synchronization of contact store when contact has changed');
                    var contact = store.getAt(3),
                        mail = contact.emails().first();
                    logger(contact);
                    contact.set('nickname', 'NYMICKNAME');
                    logger(contact);
                    store.sync();
                console.groupEnd();

                console.group('Synchronization of contact store when contact email has changed');
                    var contact = store.getAt(4),
                        mail = contact.emails().first();
                    logger(contact);
                    mail.set('value', 'MYEMAIL@DDRESS.COM');
                    logger(contact);
                    store.sync();
                console.groupEnd();

                console.group('Saving of contact email when contact email has changed');
                    var contact = store.getAt(5),
                        mail = contact.emails().first();
                    logger(contact);
                    mail.set('value', 'MYEMAIL@DDRESS.COM');
                    logger(contact);
                    mail.save();
                console.groupEnd();

                console.group('Saving of contact email when contact email has changed');
                    var contact = store.getAt(6),
                        mail = contact.emails().first();
                    store.getUpdatedRecords().forEach(function(record) {
                        logger(record);
                    });
                    mail.set('value', 'MYEMAIL@DDRESS.COM');
                console.groupEnd();
            }
        }
    });
});
