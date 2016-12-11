#!/usr/bin/env node

'use strict';

/** Draft of draft
 As to Flow.addMapping, a Mapping object should be drag from a Node exit to a
 Node or stage exit.

*/
//
// Code Documentation
//
// description:
// This is an all-in-one code sample.
//
// Organization:
// 1. Use cases
// 2. Class defination
// 3. Singleton objects.
// 4. Unit Test cases.
//
// How to understand version numbers, e.g. V1, V2
// Version goes with the code implemation progress, according to a time sequence.
//

//
// Use Cases
//

// Summary:
// I want make a tool, a light weight tool, that helps to make flow easier.
// especially for MVC based apps.

// Story 1:
// Flow Maker, a SDK tool, that make flow model
//             an Flow Maker can create an new Flow Model. and enrich the Model
//             step by step.
//             The making progress, can be like:
//             1. create a emtpy skeleton.
//             2. add nodes or flow as a node to its repo
//             3. link mappings, drag from one exit to one node, or parent exit.
//
// Flow Model, describe a flow. Flow Model consist of Flow Data and Flow
//             functions. Flow Data Core is in JSON format.
//
// Node Model, represent for a logical or physical MVC node.
//             logical node, can be seen as linkage entity to a physical one.
//             The same as Flow Model, Node Model consist of Node Data and Node
//             functions. Node Model's major desgin purpose is to represent for
//             a Node type, like a class. Node Model can be added to Flow Model
//             Repo Section, and Node instance can be added to stage.
//
// Node instance, an object create new from Node Model, which can be used in
//             Stage of Flow Model
//
// Flow Engine, runs an flow model.
//             Flow Engine, can run a Flow Model,
//
// App,        MVC Flow App, which can run with Flow Engine.
//
// Also, I want use pom to manage the MVC world. every node or flow can be a
// project artifcat.
console.log("################################################################");
console.log("# ");
console.log("# This is mvc-flow Sample");
console.log("# ");
console.log("# Welcome!");
console.log("# ");
console.log("################################################################");
// global domain of com.cachetian.mvcflow domain
var global = {};

//
// Class defination section
//

Object.prototype.clone = function() {
  var copy = (this instanceof Array) ? [] : {};
  for (var attr in this) {
    if (!this.hasOwnProperty(attr)) continue;
    copy[attr] = (typeof this == "object") ? this[attr].clone() : this[attr];
  }
  return copy;
};

////////////////////////////////////////////////////////////////////////////////
//
// V3 OO based mvcflow
//
// Version 3.0 code start from here!
//
////////////////////////////////////////////////////////////////////////////////

var util = require('util');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var os = require("os");
var uuid = require('node-uuid');

function Info(oData) {
  this._code = "";
  this._name = "";
  this._remark = "";
  if (oData && oData instanceof Object) {
    if (oData.code) {
      this._code = oData.code;
    }
    if (oData.name) {
      this._name = oData.name;
    }
    if (oData.remark) {
      this._remark = oData.remark;
    }
  }
};
Info.prototype.getCode = function() {
  return this._code;
};
Info.prototype.setCode = function(sCode) {
  this._code = sCode;
}
Info.prototype.getName = function() {
  return this._name;
}
Info.prototype.setName = function(sName) {
  this._name = sName
}
Info.prototype.getRemark = function() {
  return this._remark;
}
Info.prototype.setRemark = function(sRemark) {
  this._remark = sRemark;
}

function Target(oData) {
  // property
  this._Id = null;

  // aggregation
  this._info = null;

  // association
  this._scope = null;
}

Target.prototype.getId = function() {
  return this._Id;
}
Target.prototype.setId = function(sId) {
  this._Id = sId;
}
Target.prototype.getInfo = function() {
  return this._info;
}
Target.prototype.setInfo = function(oInfo) {
  this._info = oInfo;
}
Target.prototype.getScope = function() {
  return this._scope;
}
Target.prototype.setScope = function(oScope) {
  this._scope = oScope;
}

function Scope() {
  this._targets = new Object();
}
Scope.prototype.getTarget = function(sId) {
  return this._targets[sId];
}
Scope.prototype.registerTarget = function(oTarget) {
  oTarget.setScope(this);
  this._targets[oTarget.getId()] = oTarget;
}
Scope.prototype.getAllTargetIds = function() {
  var aProps = [];
  for (var variable in this._targets) {
    if (this._targets.hasOwnProperty(variable)) {
      aProps.push(variable);
    }
  }
  return aProps;
}
Scope.prototype.toPrintString = function() {
  return printObject(this._targets);
}

function Destination() {
  this._isExit = false;
  // exit or targetId
  this._target = "";
}
Destination.prototype.isFlowEnd = function() {
  return this._isExit;
}
Destination.prototype.getFlowEnd = function() {
  return this._isExit;
}
Destination.prototype.setFlowEnd = function(bFlowEnd) {
  this._isExit = bFlowEnd;
}
Destination.prototype.getTarget = function() {
  return this._target;
}
Destination.prototype.setTarget = function(oTarget) {
  this._target = oTarget;
}

function NodeModel() {
  // master
  this._info = null;
  this._inputs = [];
  this._outputs = [];
  this._exits = [];
}
NodeModel.prototype.getInfo = function() {
  return this._info;
}
NodeModel.prototype.setInfo = function(oInfo) {
  this._info = oInfo;
}
NodeModel.prototype.getInputs = function() {
  return this._inputs;
}
NodeModel.prototype.setInputs = function(aInputs) {
  this._inputs = aInputs;
}
NodeModel.prototype.getOuputs = function() {
  return this._outputs;
}
NodeModel.prototype.setOutputs = function(aOutputs) {
  this._outputs = aOutputs;
}
NodeModel.prototype.getExits = function() {
  return this._exits;
}
NodeModel.prototype.setExits = function(aExits) {
  for (var i = 0; i < aExits.length; i++) {
    if (!this._exitName2Index) {
      this._exitName2Index = {};
    }
    this._exitName2Index[aExits[i]] = i;
  }
  this._exits = aExits;
}
NodeModel.prototype.getExitIndexByName = function(sName) {
  var index = this._exitName2Index[sName];
  return this._exits.indexOf(sName);
}
NodeModel.prototype.newInstance = function() {
  if (!this._instaces) {
    this._instaces = []
  }
  var oNode = new Node();
  oNode.setInfo(new Info());
  oNode.getInfo().setCode(this.getInfo().getCode());
  oNode.getInfo().setName(this.getInfo().getName() + " " + this._instaces.length);
  oNode.getInfo().setRemark("auto created by Model.newInstance()");
  oNode.setId(uuid.v1());
  oNode.setModel(this);
  this._instaces.push(oNode);
  return oNode;
}

function FlowModel() {
  // master
  this._entry = "";
  this._models = [];
  this._nodes = [];
  this._scope = null
}
util.inherits(FlowModel, NodeModel);

FlowModel.prototype.addNode = function(oNode) {
  console.log("FlowModel.addNode(<oNode=[" + printNode(oNode) + "]>");
  if (!this._scope) {
    this._scope = new Scope();
  }
  this._nodes.push(oNode);
  this._scope.registerTarget(oNode);
}
FlowModel.prototype.addMapping = function(oSource, oDestination) {
  console.log("FlowModel.addMapping(<oSource=[" + printSource(oSource) + "]>, <oDestination=[" + printDestination(oDestination) + "]>) ");
  // get Node
  var oNode = oSource.node;
  // get exit
  var iExit = oNode.getModel().getExitIndexByName(oSource.exit);
  oNode.setExit(iExit, oDestination);
}
FlowModel.prototype.getScope = function() {
  return this._scope;
}
FlowModel.prototype.setScope = function(oScope) {
  this._scope = oScope;
}
FlowModel.prototype.getEntry = function() {
  return this._entry;
}
FlowModel.prototype.setEntry = function(sId) {
  try {
    // NOTE:
    // oNode must be one added oNodes
    this._entry = sId;
  } catch (e) {
    throw new Error("FlowModel.setEntry error, message: " + e.message + ", traceStack is: ");
  } finally {

  }
}
FlowModel.prototype.getNodeModelByCode = function(sCode) {
  if (this._modelCode2Inst) {
    var found = this._modelCode2Inst[sCode];
    if (found) {
      return found;
    }
  }
  throw new Error("Model not found in FlowModel!");
}
FlowModel.prototype.registerModel = function(oModel) {
  this._models.push(oModel);
  if (!this._modelCode2Inst) {
    this._modelCode2Inst = {};
  }
  this._modelCode2Inst[oModel.getInfo().getCode()] = oModel;
}
FlowModel.prototype.getRegisteredModels = function() {
  return this._models;
}
FlowModel.prototype.setRegisteredModels = function(aModels) {
  this._models = [];
  for (var i = 0; i < aModels.length; i++) {
    var oModel = aModels[i];
    this.registerModel(oModel);
  }
}
FlowModel.prototype.getNodes = function() {
  return this._nodes;
}
FlowModel.prototype.setNodes = function(aNodes) {
  this._nodes = [];
  this._scope = null;
  for (var i = 0; i < aNodes.length; i++) {
    var oNode = aNodes[i];
    this.addNode(oNode);
  }
}
FlowModel.prototype.newInstance = function() {
  if (!this._instaces) {
    this._instaces = []
  }
  var oNode = new FlowNode();
  oNode.setInfo(new Info());
  oNode.getInfo().setCode(this.getInfo().getCode());
  oNode.getInfo().setName(this.getInfo().getName() + " " + this._instaces.length);
  oNode.getInfo().setRemark("auto created by Model.newInstance()");
  oNode.setId(uuid.v1());
  oNode.setModel(this);
  this._instaces.push(oNode);
  return oNode;
}

function Node() {
  this._model = null;
  // Array of Destination
  this._exits = null;
}
util.inherits(Node, Target);
Node.prototype.getModel = function() {
  return this._model;
}
Node.prototype.setModel = function(oModel) {
  this._model = oModel;
}
Node.prototype.getExits = function() {
  return this._exits;
}
Node.prototype.setExits = function(aExits) {
  this._exits = aExits;
}
Node.prototype.setExit = function(iExit, oDestination) {
  //console.log("Node.setExit(<iExit=[" + iExit + "]>, <oDestination=[" + printDestination(oDestination) + "]>)");
  if (!this._exits) {
    this._exits = [];
    this._exits.length = this.getModel().getExits().length;
  }
  this._exits[iExit] = oDestination;
}

/**
 * Flow Engine, which konws how to find the next, the "goToNextNode" algorithm
 * @param {FlowModel} oRootFlowModel the root FlowModel
 */
function FlowEngine(oRootFlowModel) {
  this._flowModel = oRootFlowModel;
  this._currentNode = null;
  // runtime exit, the actual eixt return at runtime.
  this._flowExit = "";
  this._stack = [];
}

FlowEngine.prototype.getFlowModel = function() {
  return this._flowModel;
}
FlowEngine.prototype.setFlowModel = function(oFlowModel) {
  this._flowModel = oFlowModel;
}
FlowEngine.prototype.getCurrentNode = function() {
  //console.log("FlowEngine.getCurrentNode() <return=[" + printObject(this._currentNode) + "]>");
  return this._currentNode;
}

/**
 * Startup the flow
 */
FlowEngine.prototype.start = function() {
  try {
    console.log("FlowEngine.start()");
    // require
    this._currentNode = this.getFlowModel().getScope().getTarget(this.getFlowModel().getEntry());
  } catch (e) {

  }
}

FlowEngine.prototype.goToNextNode = function(sResult) {
  if (this.getCurrentNode()) {
    var iExit = this.getCurrentNode().getModel().getExitIndexByName(sResult);
    var oDestination = this.getCurrentNode().getExits()[iExit];
    console.log("FlowEngine.goToNextNode(<sResult=[" + sResult + "]>) return=[" + printDestination(oDestination) + "]");
    if (oDestination && oDestination instanceof Destination) {
      if (oDestination.isFlowEnd()) {
        this._flowExit = oDestination.getTarget();
        // out stack
        if (this._stack.length === 0) {
          console.log("FlowEngine.goToNextNode() Flow end with exit [" + this._flowExit + "]!");
          this._currentNode = null;
        } else {
          console.log("FlowEngine.goToNextNode() out stack!");
          this._currentNode = this._stack.pop();
          this.goToNextNode(this._flowExit);
        }
      } else {
        this._currentNode = this.getCurrentNode().getScope().getTarget(oDestination.getTarget());
        // enter stack
        if (this.getCurrentNode() instanceof FlowNode) {
          console.log("FlowEngine.goToNextNode() enter stack!");
          this._stack.push(this.getCurrentNode());
          this._currentNode = this.getCurrentNode().getModel().getScope().getTarget(this.getCurrentNode().getModel().getEntry());
        }
      }
    }
  }
}

function FlowNode() {}
util.inherits(FlowNode, Node);

var FlowMaker = (function() {

  var MVC_FLOW_REPO_ROOT = os.homedir() + path.sep + '.mvcflow' + path.sep + 'repo';

  function saveFlowModelCoreToFile(oFlowModel) {
    // get storage path
    var storeDir = getPathFromCode(oFlowModel.getInfo().getCode());
    var flowModelJsonFilePath = storeDir + path.sep + 'flowModel.json';
    // persist
    if (!fs.existsSync(storeDir)) {
      mkdirp.sync(storeDir);
    }
    fs.writeFileSync(flowModelJsonFilePath, flowModelToJSONString(oFlowModel));
  }

  function saveNodeModelToFile(oNodeModel) {
    // get storage path
    var storeDir = getPathFromCode(oNodeModel.getInfo().getCode());
    var nodeModelJsonFilePath = storeDir + path.sep + 'nodeModel.json';
    // persist
    if (!fs.existsSync(storeDir)) {
      mkdirp.sync(storeDir);
    }
    fs.writeFileSync(nodeModelJsonFilePath, nodeModelToJSONString(oNodeModel));
  }

  function getPathFromCode(sCode) {
    var codePath = sCode.replace(/\./g, path.sep);
    return MVC_FLOW_REPO_ROOT + path.sep + codePath;
  }

  function readFlowModelCoreFromFile(sCode) {
    // get storage path
    var storeDir = getPathFromCode(sCode);
    var nodeModelJsonFilePath = storeDir + path.sep + 'flowModel.json';
    var jsonString = fs.readFileSync(nodeModelJsonFilePath, {
      encoding: 'utf-8'
    });
    return jsonStringToFlowModel(jsonString);
  }

  function readNodeModelCoreFromFile(sCode) {
    // get storage path
    var storeDir = getPathFromCode(sCode);
    var nodeModelJsonFilePath = storeDir + path.sep + 'nodeModel.json';
    var jsonString = fs.readFileSync(nodeModelJsonFilePath, {
      encoding: 'utf-8'
    });
    return jsonStringToNodeModel(jsonString);
  }

  return {
    saveNodeModelToFile: function(oNodeModel) {
      console.log("FlowMaker.saveNodeModelToFile(<oNodeModel=[" + printInfo(oNodeModel.getInfo()) + "]>)");
      saveNodeModelToFile(oNodeModel);
    },

    saveFlowModelToFile: function(oFlowModel) {
      console.log("FlowMaker.saveFlowModelToFile(<oFlowModel=[" + printInfo(oFlowModel.getInfo()) + "]>)");
      // e.g. a.b.c => a/b/c
      saveFlowModelCoreToFile(oFlowModel);
      var aModels = oFlowModel.getRegisteredModels();
      for (var i = 0; i < aModels.length; i++) {
        var oModel = aModels[i];
        if (oModel instanceof FlowModel) {
          this.saveFlowModelToFile(oModel);
        } else {
          this.saveNodeModelToFile(oModel);
        }
      }
    },
    readNodeModelFromFile: function(sCode) {
      console.log("FlowMaker.readNodeModelFromFile(<sCode=[" + sCode + "]>)");
      return readNodeModelCoreFromFile(sCode);
    },
    readFlowModelFromFile: function(sCode) {
      console.log("FlowMaker.readFlowModelFromFile(<sCode=[" + sCode + "]>)");
      var oModel = readFlowModelCoreFromFile(sCode);

      // models
      // replace logic with real models
      var aLogicRegModels = oModel.getRegisteredModels();
      var aRealRegModels = [];
      aRealRegModels.length = aLogicRegModels.length;
      for (var i = 0; i < aLogicRegModels.length; i++) {
        var oLogicRegModel = aLogicRegModels[i];
        var oRealRegModel = null;
        if (oLogicRegModel instanceof FlowModel) {
          oRealRegModel = this.readFlowModelFromFile(oLogicRegModel.getInfo().getCode());
        } else {
          oRealRegModel = this.readNodeModelFromFile(oLogicRegModel.getInfo().getCode());
        }
        aRealRegModels[i] = oRealRegModel;
      }
      oModel.setRegisteredModels(aRealRegModels);

      // nodes
      var aLogicNodes = oModel.getNodes();
      var aRealNodes = [];
      for (var k = 0; k < aLogicNodes.length; k++) {
        var oRealNode = aLogicNodes[k];
        oRealNode.setModel(oModel.getNodeModelByCode(oRealNode.getInfo().getCode()));
        aRealNodes.push(oRealNode);
      }
      oModel.setNodes(aRealNodes);
      return oModel;
    }
  };
})();

//
// generaters
//

var idSequenceNumber = 0;
var randomSequenceNumber = 0;

function generateMockTarget() {
  var seq = idSequenceNumber++;
  var oTarget = new Target();
  oTarget.setId(uuid.v1());
  oTarget.setInfo(generateMockInfo());
  return oTarget;
}

function generateMockInfo() {
  var seq = randomSequenceNumber++;
  var oInfo = new Info();
  oInfo.setCode("code" + seq);
  oInfo.setName("name" + seq);
  oInfo.setRemark("This is info of seq" + seq);
  return oInfo;
}

function generateNodeModel(oData) {
  var oNodeModel = new NodeModel();
  oNodeModel.setInfo(new Info());
  oNodeModel.getInfo().setCode(oData.code);
  oNodeModel.getInfo().setName(oData.name);
  oNodeModel.getInfo().setRemark(oData.remark);
  oNodeModel.setExits(oData.exits);
  return oNodeModel;
}

// function generateNode(oModel) {
//   var oNode = new Node();
//   oNode.setInfo(new Info());
//   oNode.getInfo().setCode(oModel.getInfo().getCode());
//   oNode.getInfo().setName(oModel.getInfo().getName());
//   oNode.setId(uuid.v1());
//   oNode.setModel(oModel);
//   return oNode;
// }

function generateSource(oNode, sExit) {
  var oSource = {
    "node": oNode,
    "exit": sExit
  }
  return oSource;
}

function generateDestination(bFlowEnd, oValue) {
  var oDestination = new Destination();
  oDestination.setFlowEnd(bFlowEnd);
  if (bFlowEnd) {
    oDestination.setTarget(oValue);
  } else {
    oDestination.setTarget(oValue.getId());
  }
  return oDestination;
}

function generateFlowModel(oData) {
  var oFlowModel = new FlowModel();
  oFlowModel.setInfo(new Info());
  oFlowModel.getInfo().setCode(oData.code);
  oFlowModel.getInfo().setName(oData.name);
  oFlowModel.getInfo().setRemark(oData.remark);
  oFlowModel.setExits(oData.exits);
  return oFlowModel;
}

function generateFlowEngine(oFlowModel) {
  var oFlowEngine = new FlowEngine();
  oFlowEngine.setFlowModel(oFlowModel);
  return oFlowEngine;
}

//
// print util
//

function printInfo(oInfo) {
  if (oInfo && oInfo instanceof Info) {
    return "{code:\"" + oInfo.getCode() + "\", name:\"" + oInfo.getName() + "\", remark:\"" + oInfo.getRemark() + "\"}";
  }
  return "empty";
}

function printNode(oNode) {
  if (oNode && oNode instanceof Node) {
    return "{id:\"" + oNode.getId() + "\", info:" + printInfo(oNode.getInfo()) + "}, exits:" + JSON.stringify(oNode.getExits()) + "";
  }
  return "empty";
}

function printTarget(oTarget) {
  if (oTarget && oTarget instanceof Target) {
    return "{id:\"" + oTarget.getId() + "\", info:" + printInfo(oTarget.getInfo()) + "}";
  }
  return "empty";
}

function printObject(object) {
  var str = "{";
  var i = 0;
  for (var variable in object) {
    if (object.hasOwnProperty(variable)) {
      if (i !== 0) {
        str += ", ";
      }
      str += variable + '="' + object[variable] + '"';
      i++;
    }
  }
  str += "}";
  return str;
}

function printSource(oSource) {
  var str = "{";
  str += 'node.info.name:""' + oSource.node.getInfo().getName() + '", ';
  str += 'exit:"' + oSource.exit + '"';
  str += "}";
  return str;
}

function printDestination(oDestination) {
  try {
    return '{isExit:"' + oDestination.getFlowEnd() + '", target:"' + oDestination.getTarget() + '"}';;
  } catch (e) {

  } finally {

  }
  return printObject(oDestination);
}

//
// serializable
//

//
// FileSystem rules:
// root of mvcflow fs, homedir/.mvcflow
// mvcflowRoot/.
//

function nodeModelToJSONString(oNodeModel) {
  var oData = {
    "info": {
      "code": oNodeModel.getInfo().getCode(),
      "name": oNodeModel.getInfo().getName(),
      "remark": oNodeModel.getInfo().getRemark()
    },
    "inputs": oNodeModel.getInputs(),
    "ouputs": oNodeModel.getOuputs(),
    "exits": oNodeModel.getExits()
  };
  return JSON.stringify(oData);
}

function jsonStringToNodeModel(sJSONString) {
  var oData = JSON.parse(sJSONString);
  var oModel = new NodeModel();
  oModel.setInfo(new Info());
  oModel.getInfo().setCode(oData.info.code);
  oModel.getInfo().setName(oData.info.name);
  oModel.getInfo().setRemark(oData.info.remark);
  oModel.setInputs(oData.inputs);
  oModel.setOutputs(oData.outputs);
  oModel.setExits(oData.exits);
  return oModel;
}

function nodeToJSONString(oNode) {
  var oData = {
    "id": oNode.getId(),
    "info": {
      "code": oNode.getInfo().getCode(),
      "name": oNode.getInfo().getName(),
      "remark": oNode.getInfo().getRemark()
    },
    "exits": [],
    "type": ""
  };
  // exits
  oData.exits.length = oNode.getExits().length;
  for (var i = 0; i < oNode.getExits().length; i++) {
    var oDst = oNode.getExits()[i];
    oData.exits[i] = {
      "isExit": oDst.getFlowEnd(),
      "target": oDst.getTarget()
    };
  }
  // type
  if (oNode instanceof FlowNode) {
    oData.type = "flow";
  } else {
    oData.type = "node";
  }
  return JSON.stringify(oData);
}

function jsonStringToNode(sJSONString) {
  var oData = JSON.parse(sJSONString);
  var oNode = null;
  if (oData.type === "flow") {
    oNode = new FlowNode();
  } else {
    oNode = new Node();
  }
  oNode.setId(oData.id);
  oNode.setInfo(new Info());
  oNode.getInfo().setCode(oData.info.code)
  oNode.getInfo().setName(oData.info.name)
  oNode.getInfo().setRemark(oData.info.remark);
  var aDsts = [];
  aDsts.length = oData.exits.length;
  for (var i = 0; i < oData.exits.length; i++) {
    var oExitData = oData.exits[i];
    var oDst = new Destination();
    oDst.setFlowEnd(oExitData.isExit);
    oDst.setTarget(oExitData.target);
    aDsts[i] = oDst;
  }
  oNode.setExits(aDsts);
  return oNode;
}

function flowModelToJSONString(oFlowModel) {
  var oData = {
    "info": {
      "code": oFlowModel.getInfo().getCode(),
      "name": oFlowModel.getInfo().getName(),
      "remark": oFlowModel.getInfo().getRemark()
    },
    "inputs": oFlowModel.getInputs(),
    "outputs": oFlowModel.getOuputs(),
    "exits": oFlowModel.getExits(),
    "models": [],
    "nodes": [],
    "entry": oFlowModel.getEntry()
  };

  // for each models
  for (var i = 0; i < oFlowModel.getRegisteredModels().length; i++) {
    var oModel = oFlowModel.getRegisteredModels()[i];
    var oModelData = {
      "type": "",
      "data": ""
    };
    if (oModel instanceof FlowModel) {
      oModelData.type = "flow";
      oModelData.data = oModel.getInfo().getCode();
    } else {
      oModelData.type = "node";
      oModelData.data = oModel.getInfo().getCode();
    }
    oData.models.push(oModelData);
  }

  // for each nodes
  for (var j = 0; j < oFlowModel.getNodes().length; j++) {
    var oNode = oFlowModel.getNodes()[j];
    oData.nodes.push(nodeToJSONString(oNode));
  }
  return JSON.stringify(oData);
}

function jsonStringToFlowModel(sJSONString) {
  var oData = JSON.parse(sJSONString);
  var oModel = new FlowModel();
  oModel.setInfo(new Info());
  oModel.getInfo().setCode(oData.info.code);
  oModel.getInfo().setName(oData.info.name);
  oModel.getInfo().setRemark(oData.info.remark);
  oModel.setInputs(oData.inputs);
  oModel.setOutputs(oData.outputs);
  oModel.setExits(oData.exits);
  oModel.setEntry(oData.entry);

  // for each models - registered models
  for (var i = 0; i < oData.models.length; i++) {
    var oRegModelData = oData.models[i];
    var oRegModel = null;
    if (oRegModelData.type === "flow") {
      oRegModel = new FlowModel();
      oRegModel.setInfo(new Info());
      oRegModel.getInfo().setCode(oRegModelData.data);
    } else if (oRegModelData.type === "node") {
      oRegModel = new NodeModel();
      oRegModel.setInfo(new Info());
      oRegModel.getInfo().setCode(oRegModelData.data);
    }
    oModel.getRegisteredModels().push(oRegModel);
  }

  // for each nodes
  for (var j = 0; j < oData.nodes.length; j++) {
    var oNode = jsonStringToNode(oData.nodes[j]);
    oModel.getNodes().push(oNode);
  }

  return oModel;
}

//
// App run test
//

global.App = {
  run: function(global) {
    console.log("V3 mvcflow start");

    // start from create Node Model
    console.log("Test Class Target:");
    var oTarget = new Target();
    oTarget.setId(uuid.v1());
    oTarget.setInfo(new Info());
    oTarget.getInfo().setCode("a.b.c.D");
    oTarget.getInfo().setName("D 0");
    oTarget.getInfo().setRemark("this is a target");
    console.log("oTarget: " + printTarget(oTarget));
    console.log("");

    console.log("Test Class Scope:");
    var oScope = new Scope();
    oScope.registerTarget(oTarget);
    var oScopeTarget = oScope.getTarget(oTarget.getId());
    console.log("oScopeTarget is: " + printTarget(oScopeTarget));
    var oGenedInfo = generateMockInfo();
    var oGenedTarget = generateMockTarget();
    for (var i = 0; i < 10; i++) {
      var oGenedItemTaget = generateMockTarget();
      oScope.registerTarget(oGenedItemTaget);
    }
    var aProps = oScope.getAllTargetIds()
    console.log("scope all tIds are: " + aProps);
    console.log("");

    console.log("Test Class NodeModel, Node:");
    var oGuestNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Guest",
      "name": "Guest",
      "remark": "This is Guest node",
      "exits": ["logon", "exit"]
    });
    var oGuestNode = oGuestNodeModel.newInstance();
    var oLogonNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Logon",
      "name": "Logon",
      "remark": "This is Logon node",
      "exits": ["success", "error"]
    });
    var oLogonNode = oLogonNodeModel.newInstance();
    var oHomeNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Home",
      "name": "Home",
      "remark": "This is Home node",
      "exits": ["logout", "business"]
    });
    var oHomeNode = oHomeNodeModel.newInstance();
    var oBusinessNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Business",
      "name": "Business",
      "remark": "This is Business node",
      "exits": ["complete"]
    });
    var oBusinessNode = oBusinessNodeModel.newInstance();
    console.log("");

    console.log("Test Class FlowModel:");
    var oFlowModel = new FlowModel();
    oFlowModel.setInfo(new Info());
    oFlowModel.getInfo().setCode("mvcflow.sample.flows.Menu");
    oFlowModel.getInfo().setName("Menu");
    oFlowModel.getInfo().setRemark("Menu FM");
    oFlowModel.setExits(["flowend"]);

    oFlowModel.addNode(oGuestNode);
    oFlowModel.addNode(oLogonNode);
    oFlowModel.addNode(oHomeNode);
    oFlowModel.addNode(oBusinessNode);

    // Flow mappings
    // Guest.exit -> flow.flowend
    // Guest.logon -> logon
    // Logon.success -> Home
    // Logon.error -> Guest
    // Home.logout -> Guest
    // Home.business -> Business
    // Business.complete -> Home
    oFlowModel.setEntry(oGuestNode.getId());
    oFlowModel.addMapping(generateSource(oGuestNode, "logon"), generateDestination(false, oLogonNode));
    oFlowModel.addMapping(generateSource(oGuestNode, "exit"), generateDestination(true, "flowend"));
    oFlowModel.addMapping(generateSource(oLogonNode, "success"), generateDestination(false, oHomeNode));
    oFlowModel.addMapping(generateSource(oLogonNode, "error"), generateDestination(false, oGuestNode));
    oFlowModel.addMapping(generateSource(oHomeNode, "logout"), generateDestination(false, oGuestNode));
    oFlowModel.addMapping(generateSource(oHomeNode, "business"), generateDestination(false, oBusinessNode));
    oFlowModel.addMapping(generateSource(oBusinessNode, "complete"), generateDestination(false, oHomeNode));

    var oFlowEngine = new FlowEngine();
    oFlowEngine.setFlowModel(oFlowModel);
    oFlowEngine.start();
    oFlowEngine.goToNextNode("logon");
    oFlowEngine.goToNextNode("success");
    oFlowEngine.goToNextNode("business");
    oFlowEngine.goToNextNode("complete");
    oFlowEngine.goToNextNode("logout");
    oFlowEngine.goToNextNode("exit");
    console.log("");

    // Test subflow
    console.log("Test Sub Flow");
    // NodeModel & Nodes
    var oBusinessMasterNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.BusinessMaster",
      "name": "BusinessMaster",
      "remark": "This is Business Master node",
      "exits": ["detail", "exit"]
    });
    var oBusinessMasterNode = oBusinessMasterNodeModel.newInstance();
    var oBusinessDetailNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.BusinessDetail",
      "name": "BusinessDetail",
      "remark": "This is Business Detail node",
      "exits": ["master"]
    });
    var oBusinessDetailNode = oBusinessDetailNodeModel.newInstance();
    // FlowModel
    var oBusinessFlowModel = generateFlowModel({
      "code": "mvcflow.sample.flows.BusinessFlow",
      "name": "BusinessFlow",
      "remark": "Master Detail Business flow",
      "exits": ["complete"]
    });
    oBusinessFlowModel.registerModel(oBusinessMasterNodeModel);
    oBusinessFlowModel.registerModel(oBusinessDetailNodeModel);
    var oBusinessFlowNode = oBusinessFlowModel.newInstance();
    oBusinessFlowModel.addNode(oBusinessMasterNode);
    oBusinessFlowModel.addNode(oBusinessDetailNode);
    oBusinessFlowModel.setEntry(oBusinessMasterNode.getId());
    oBusinessFlowModel.addMapping(generateSource(oBusinessMasterNode, "detail"), generateDestination(false, oBusinessDetailNode));
    oBusinessFlowModel.addMapping(generateSource(oBusinessMasterNode, "exit"), generateDestination(true, "complete"));
    oBusinessFlowModel.addMapping(generateSource(oBusinessDetailNode, "master"), generateDestination(false, oBusinessMasterNode));
    // FlowEngine run
    var oBusinessFlowEngine = generateFlowEngine(oBusinessFlowModel);
    oBusinessFlowEngine.start();
    oBusinessFlowEngine.goToNextNode("detail");
    oBusinessFlowEngine.goToNextNode("master");
    oBusinessFlowEngine.goToNextNode("exit");
    console.log("");

    // Test App Flow (Embed with Sub Flow)
    console.log("Test App Flow");
    // FlowModel
    var oAppFlowModel = generateFlowModel({
      "code": "mvcflow.sample.flows.App",
      "name": "App",
      "remark": "This is App flow",
      "exits": ["flowend"]
    });
    // dependcies
    oAppFlowModel.registerModel(oGuestNodeModel);
    oAppFlowModel.registerModel(oLogonNodeModel);
    oAppFlowModel.registerModel(oHomeNodeModel);
    oAppFlowModel.registerModel(oBusinessFlowModel);
    // nodes
    oAppFlowModel.addNode(oGuestNode);
    oAppFlowModel.addNode(oLogonNode);
    oAppFlowModel.addNode(oHomeNode);
    oAppFlowModel.addNode(oBusinessFlowNode);
    // mappings
    oAppFlowModel.setEntry(oGuestNode.getId());
    oAppFlowModel.addMapping(generateSource(oGuestNode, "logon"), generateDestination(false, oLogonNode));
    oAppFlowModel.addMapping(generateSource(oGuestNode, "exit"), generateDestination(true, "flowend"));
    oAppFlowModel.addMapping(generateSource(oLogonNode, "success"), generateDestination(false, oHomeNode));
    oAppFlowModel.addMapping(generateSource(oLogonNode, "error"), generateDestination(false, oGuestNode));
    oAppFlowModel.addMapping(generateSource(oHomeNode, "logout"), generateDestination(false, oGuestNode));
    oAppFlowModel.addMapping(generateSource(oHomeNode, "business"), generateDestination(false, oBusinessFlowNode));
    oAppFlowModel.addMapping(generateSource(oBusinessFlowNode, "complete"), generateDestination(false, oHomeNode));
    // FlowEngine run
    var oAppFlowEngine = generateFlowEngine(oAppFlowModel);
    oAppFlowEngine.start();
    oAppFlowEngine.goToNextNode("logon");
    oAppFlowEngine.goToNextNode("success");
    oAppFlowEngine.goToNextNode("business");
    oAppFlowEngine.goToNextNode("detail");
    oAppFlowEngine.goToNextNode("master");
    oAppFlowEngine.goToNextNode("exit");
    oAppFlowEngine.goToNextNode("logout");
    oAppFlowEngine.goToNextNode("logon");
    oAppFlowEngine.goToNextNode("error");
    oAppFlowEngine.goToNextNode("exit");
    console.log("");

    console.log("Test FlowMaker");
    //FlowMaker.saveFlowModelToFile(oAppFlowModel);
    //FlowMaker.readFlowModelFromFile();
    // How to serialize FlowModel
    // Implements ways of NodeModel to string.
    // Implements ways of Node to string (without model), use code for reference
    // Implements ways of Mapping to string, use ID instead Node.
    // If depends on a FlowModel, load dependcies FlowModel first.
    var nodeModelJsonString = nodeModelToJSONString(oGuestNodeModel);
    console.log("nodeModelToJSONString: " + nodeModelJsonString);
    var nodeJsonString = nodeToJSONString(oGuestNode);
    console.log("nodeToJSONString: " + nodeJsonString);
    var flowModelJsonString = flowModelToJSONString(oBusinessFlowModel);
    console.log("flowModelToJSONString: " + flowModelJsonString);
    var subflowModelJsonStringWith = flowModelToJSONString(oAppFlowModel);
    console.log("subflowModelJsonStringWith: " + flowModelJsonString);
    FlowMaker.saveFlowModelToFile(oBusinessFlowModel);
    FlowMaker.saveFlowModelToFile(oAppFlowModel);
    var oReadBusinessFlowModel = FlowMaker.readFlowModelFromFile("mvcflow.sample.flows.BusinessFlow");
    console.log("readFM:" + printObject(oReadBusinessFlowModel));
    var oReadAppFlowModel = FlowMaker.readFlowModelFromFile("mvcflow.sample.flows.App");
    // FlowEngine run
    var oReadAppFlowEngine = generateFlowEngine(oReadAppFlowModel);
    oReadAppFlowEngine.start();
    oReadAppFlowEngine.goToNextNode("logon");
    oReadAppFlowEngine.goToNextNode("success");
    oReadAppFlowEngine.goToNextNode("business");
    oReadAppFlowEngine.goToNextNode("detail");
    oReadAppFlowEngine.goToNextNode("master");
    oReadAppFlowEngine.goToNextNode("exit");
    oReadAppFlowEngine.goToNextNode("logout");
    oReadAppFlowEngine.goToNextNode("logon");
    oReadAppFlowEngine.goToNextNode("error");
    oReadAppFlowEngine.goToNextNode("exit");
  }
};
global.App.run(global);
