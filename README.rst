Ext JS 4 Portable Contacts (PoCo) model
=======================================
This project is an example implementation of a PoCo model in Ext JS 4's
data model. It uses Ext JS's Data package to set up associations for 
PoCo's singular and multiple fields.

Some extra validation types are mixed into the ``Ext.data.validations``
object, to be able to validate PoCo fields like email, url etc.

Portable Contacts: `http://portablecontacts.net/draft-spec.html <http://portablecontacts.net/draft-spec.html>`_

Patched Ext JS 4
================
This code example runs with a patched version on Ext JS 4 found here:
`Ext JS 4 with denormalized data package patch <https://github.com/One-com/Ext-JS-4>`_


Why patch the data package?
---------------------------
The complete thread about the reasoning can be found here:
`Sencha Platform denormalized Data patch <http://www.sencha.com/forum/showthread.php?127547-Sencha-Platform-denormalized-Data-patch>`_ 


Premise:
~~~~~~~~
Denormalized databases, or document databases, have gained a lot of momentum
in the last years. There are a lot of use cases where denormalized data has
been shown to be a more effective way of storing and scaling large datasets.
Thus it is an interesting use case for the Sencha Platform's Data package to
implement some way of working with denormalized datasets.

The current Data package currently handles eager loading of related data
through a nested data structure quite well. The model still assumes complete
normalization on the backend though. Here are some of the things that would
be nice to have when working with denormalized data:

* A way to define when an association should be treated as denormalized
  I will refer to these relations as 'inner'.
* Optional properties
  Most document databases allow for schemaless datasets, which don't require all
  properties to be set. For example the PoCo specification includes a lot of
  optional properties. The Sencha Model should be able to represent this by not
  serializing empty properties when saving data.
* Optional validation
  If a property can be optional, then the model itself should be able to validate
  even when the optional property is not set.
* Deep validation
  A Model that has inner relations should do a deep validation of all its inner
  relations, since upon serialization these are conceptually a part of the Model
  itself.
* Deep serialization
  When a Model is serialized, all its inner relations should be serialized as
  well for remote storage.

And specific for ExtJS and Sencha Touch:

* A Record that is marked as dirty should mark its parent relation as dirty
  as well if it is an inner relation.
* Saving a modified record should delegate to the records parent record if it
  is an inner relation.


Usage
=====
Run ``./server/static.js`` or point your webserver at your git checkout
and visit the index.html file to see a few very basic tests of the model
in action.
The tests primary goal are for patch development, and are not in any way 
exhausitve.


License
=======
This work is licensed under a standard 3-clause BSD license -- see the
``LICENSE``-file for details.

