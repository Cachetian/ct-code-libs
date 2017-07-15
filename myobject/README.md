My Object
====
My Object, a unified technical object hold all business.
## Requirement
IT should be built based on a unified unit, which should have minimal while maximal essential information what a unit should have.
Because business should never stop, change on business requires no restart server to take effect.
How to achieve that? answer is My Object.
## Technical Design
### Schema
schema
```js
var object_schema = {
  "object_id":"String type char(36), UUID",
  "object_name":"String type char(64), Readable name which is unique and for indexing"
  "object_type":"int number(1), 0 - Entity, 1- Relation",
  "data_parent":"String type varchar(36)"
  "data_name":"String type varchar(36)",
  "data_value":"Blog type or varchar(512)"
}
```
object_type: data node or mapping node
entity object, relation object
### Business Scenarios
pure data object
```js
{
  "object_id":"6eed52f3-4d09-46b2-8910-a16884fa9ce5",
  "object_name":"com.cachetian.tools.myobject",
  "object_type":"data",
  "data_name": "remark",
  "data_value": "the myobject project"
}
```
sample of entity objects
```js
var entity_object_A = {
  "object_id":"eb5d3995-b941-49ef-987c-be3f9aa3f52c",
  "object_name":"com.cachetian.tools.myobject.doc.sample.pure_data_object_a",
  "object_type":"data",
  "data_name": "remark",
  "data_value": "sample data object A"
}
var entity_object_B = {
  "object_id":"d0395a6e-41d6-411e-a511-94f88960f802",
  "object_name":"com.cachetian.tools.myobject.doc.sample.pure_data_object_b",
  "object_type":"data",
  "data_name": "remark",
  "data_value": "sample data object B"
}
```
pure mapping object
```js
var relation_object = {
  "object_id":"d67414f4-22af-4aa4-951a-e9970a4373b9",
  "object_name":"com.cachetian.tools.myobject.doc.sample.pure_mapping_object",
  "object_type":"mapping",
  "data_name": "com.cachetian.tools.myobject",
  "data_value": "com.cachetian.tools.myobject"
}
```
master data scenario
```js
{
  "object_id":"672616e5-322e-485d-a53f-8a579c29634c",
  "object_name":"object_mytask_master_data",
  "object_type":"data",
  "property_name":"master_data",
  "property_value":"12345678901234567890123456789012"
}
```
master data description
```js
{
  "object_id":"98433b7a-2c33-4a2a-9484-aa8553ac2fe6",
  "object_name":"",
  "object_type":"data",
  "property_name":"master_data",
  "property_value":"12345678901234567890123456789012"
}
```
example for define a class:
following my object code described a class definition.
```js
var entity_object_class_mytask = new EntityObject();

var entity_object_property_id = new EntityObject();
var relation_object_property_id_propert_of_to_class_mytask = new RelationObject();

var entity_object_proepery_created_at = new EntityObject();
var relation_object_property_created_at_propert_of_to_class_mytask = new RelationObject();

var entity_object_property_name = new EntityObject();
var relation_object_property_name_propert_of_to_class_mytask = new RelationObject();

var entity_object_proepery_star = new EntityObject();
var relation_object_property_star_propert_of_to_class_mytask = new RelationObject();

var entity_object_property_catalog = new EntityObject();
var relation_object_property_catalog_propert_of_to_class_mytask = new RelationObject();
```
class mytask;
property id;
property created_at;
property name;
property star;
property catalog;
mapping property id to class mytask;
mapping property created_at to class mytask;
mapping property name to class mytask;
mapping property star to class mytask;
mapping property catalog to class mytask;

This process is modeling.

objectService provide
getChildrenObjects
getParentObject
getObjectMappings
getMappingObjects
