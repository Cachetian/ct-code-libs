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
var myobject_schema_metadata = {
  "object_id":"String type UUID char(36)",
  "object_name":"String type char(64) unique index"
  "object_type":"data/mapping",
  "property":"String type varchar(36)"
  "property_name":"String type varchar(36)",
  "property_value":"blog type or varchar(512)"
}
```
object_type: data node or mapping node
entity object, relation object
### Scenario
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
sample data object A
```js
{
  "object_id":"eb5d3995-b941-49ef-987c-be3f9aa3f52c",
  "object_name":"com.cachetian.tools.myobject.doc.sample.pure_data_object_a",
  "object_type":"data",
  "data_name": "remark",
  "data_value": "sample data object A"
}
```

```js
{
  "object_id":"d0395a6e-41d6-411e-a511-94f88960f802",
  "object_name":"com.cachetian.tools.myobject.doc.sample.pure_data_object_b",
  "object_type":"data",
  "data_name": "remark",
  "data_value": "sample data object B"
}
```
pure mapping object
```js
{
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
```js
var entity_object_class_mytask = new EntityObject();
var entity_object_property_id = new EntityObject();
var entity_object_proepery_created_at = new EntityObject();
var entity_object_property_name = new EntityObject();
var entity_object_proepery_star = new EntityObject();
var entity_object_property_catalog = new EntityObject();

var relation_object_property_id_belong_to_class_mytask = new RelationObject();


```
