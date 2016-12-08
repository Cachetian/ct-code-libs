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

function v1() {
  function Node() {
    this.data = {};
  }
  //
  // Flow class, indicate an created flow instance.
  //
  function Flow() {
    this.data = {};
  }

  Flow.prototype.getNode = function(sName) {
    return new Node();
  };
  Flow.prototype.getNodeByIndex = function(idx) {
    return new Node();
  };
  Flow.prototype.getNodeByName = function(sName) {
    return new Node();
  };
  Flow.prototype.addNode = function(oData) {

  };
  Flow.prototype.addMapping = function(oNode, sTarget) {

  };

  //
  // Singleton objects
  //

  global.NodeFacotryV1 = function() {
    var NodeDef = {
      "clazz": "",
      "remark": "",
      "results": []
    }
    return {
      createNode: function(clazz, sRemark, aResults) {
        var instance = NodeDef.clone();
        if (clazz instanceof String) {
          instance.clazz = clazz;
          instance.remark = sRemark;
          instance.results = aResults;
        } else if (clazz instanceof Object) {
          instance.clazz = clazz.clazz;
          instance.remark = clazz.remark;
          instance.results = clazz.results;
        }
        return instance;
      }
    };
  }();


  global.NodeFacotry = function() {
    var NodeDef = {
      "clazz": "",
      "remark": "",
      "results": []
    }
    return {
      createNode: function(clazz, sRemark, aResults) {
        var instance = NodeDef.clone();
        if (clazz instanceof String) {
          instance.clazz = clazz;
          instance.remark = sRemark;
          instance.results = aResults;
        } else if (clazz instanceof Object) {

          instance.clazz = clazz.clazz;
          instance.remark = clazz.remark;
          instance.results = clazz.results;
        }
        return instance;
      }
    };
  }();

  global.NodeRepoV1 = function() {

    /**
     * Name index map, key is node clazz, value is internal index in nodeArray.
     * @type {Object}
     */
    var nameIndexMap = {};

    /**
     * Node def instance array.
     * @type {Array}
     */
    var nodeArray = [];

    return {
      getNode: function(sName) {
        if (sName) {
          return nodeArray[nameIndexMap[sName]];
        }
      },

      /**
       * Add node to repo
       * @param {com.cachetian.mvcflow.NodeDef} oNode node template defination type
       */
      addNode: function(oNode) {
        if (!oNode) {
          throw new Error("AddNodeEmptyError");
        }
        // register name in nameIndexMap
        nameIndexMap[oNode.clazz] = nodeArray.length;

        // add to nodeArray
        nodeArray.push({
          "clazz": oNode.clazz,
          "remark": oNode.remark,
          "results": oNode.results
        });
        return this;
      }
    }
  }();

  global.NodeRepo = function() {

    /**
     * Name index map, key is node clazz, value is internal index in nodeArray.
     * @type {Object}
     */
    var nameIndexMap = {};

    var nameIndexMapExample = {
      "node://xxx.xxx.xxx.XxxXxx": 0,
      "flow://xxx.xxx.xxx.XxxXxx": 0,
    };

    /**
     * Node def instance array. This is an array, index are their ID, value are their intance
     * @type {Array}
     */
    var nodeArray = [];
    var nodeArrayExample = [{
      "clazz": "node://xxx.xxx.xxx.XxxXxx"
    }, {
      "clazz": "flow://xxx.xxx.xxx.XxxXxx"
    }];

    return {
      getNode: function(sName) {
        if (sName) {
          return nodeArray[nameIndexMap[sName]];
        }
      },

      /**
       * Add node to repo
       * @param {com.cachetian.mvcflow.NodeDef} oNode node define, clazz is "node://xxx", "flow://xxx" or "xxx" (indicate node)
       */
      addNode: function(oNode) {
        if (!oNode) {
          throw new Error("AddNodeEmptyError");
        }
        if (oNode.clazz === undefined || oNode.clazz === null || oNode.clazz === "") {
          throw new Error("AddNodeClazzEmptyError");
        }
        if (oNode.results === undefined || oNode.results === null || !(oNode.results instanceof Array)) {
          throw new Error("AddNodeResultsFormatError");
        }

        if (oNode.clazz.indexOf("node://") === 0) {

        } else if (oNode.clazz.indexOf("flow://") === 0) {
          // validate flow structure

          // validate all depending node are in repo

        } else {
          oNode.clazz = "node://" + oNode.clazz
        }

        // register name in nameIndexMap
        nameIndexMap[oNode.clazz] = nodeArray.length;

        // add to nodeArray
        nodeArray.push(oNode);
        return this;
      }
    }
  }();

  global.FlowMaker = function() {
    var globalRef = null;
    var flowDef = {
      "nodes": {},
      "entry": "",
      "remark": "",
      "results": []
    };
    var flowData = null;
    return {
      setDomain: function(oDomain) {
        globalRef = oDomain;
        return this;
      },

      /**
       * Create flow
       * @param  {String} clazz   Entry node class
       * @param  {String} remark  flow remark
       * @param  {Array} 	results results
       */
      createFlow: function(clazz, remark, results) {
        flowData = flowDef.clone();
        flowData.entry = clazz;
        flowData.remark = remark;
        flowData.results = results;
        return new Flow();
      },

      // add result to node
      // since we cannot gurantee any step update result will be closed well
      // runnable flow. so that this input should be extened.
      addNode: function(oFlow, oNode) {

      },

      // add node result to flow result
      addMapping: function(oFlow, sFrom, sTo) {

      }
    };
  }();

  global.FlowEngineV1 = function() {
    var flowData = null;

    var iCurrentNodeIndex = -1;

    var bFlowEnd = false;

    function getIndex(sResult) {
      var index = 0;
      if (sResult.indexOf("node") === 0) {
        index = sResult.substr(5);
      } else if (sResult.indexOf("result") === 0) {
        index = sResult.substr(7);
        bFlowEnd = true;
      }
      return index;
    }

    return {

      setFlowData: function(oFlowData) {
        iCurrentNodeIndex = -1;
        bFlowEnd = false;
        flowData = oFlowData;
      },

      startFlow: function() {
        try {
          if (flowData == null) {
            throw new Error("StartFlowDataEmptyError");
          }
          if (flowData.entry === undefined || flowData.entry === null || flowData.entry === "") {
            throw new Error("StartFlowEntryEmptyError");
          }
          var sResult = flowData.entry;
          iCurrentNodeIndex = getIndex(sResult);
        } catch (e) {
          throw new Error("startFlow error for errorCode, " + e.message);
        }
      },

      runFlow: function(sResult) {
        var mMappings = flowData.nodes[iCurrentNodeIndex].mappings;
        var sResult = mMappings[sResult];
        iCurrentNodeIndex = getIndex(sResult);
      },

      print: function() {
        if (!bFlowEnd) {
          if (iCurrentNodeIndex === -1) {
            console.log(flowData.remark);
          } else {
            console.log(flowData.nodes[iCurrentNodeIndex].remark);
          }
        } else {
          console.log(flowData.results[iCurrentNodeIndex]);
        }

      }
    };
  }();

  global.FlowEngine = function() {
    var domain = null;
    var flowData = null;
    var iCurrentNodeIndex = -1;
    var bFlowEnd = false;

    function getIndex(sResult) {
      var index = 0;
      if (sResult.indexOf("node") === 0) {
        index = sResult.substr(5);
      } else if (sResult.indexOf("result") === 0) {
        index = sResult.substr(7);
        bFlowEnd = true;
      }
      return index;
    }

    return {
      setDomain: function(oDomain) {
        domain = oDomain;
        return this;
      },

      setFlowData: function(oFlowData) {
        iCurrentNodeIndex = -1;
        bFlowEnd = false;
        flowData = oFlowData;
      },

      startFlow: function() {
        try {
          if (flowData == null) {
            throw new Error("StartFlowDataEmptyError");
          }
          if (flowData.entry === undefined || flowData.entry === null || flowData.entry === "") {
            throw new Error("StartFlowEntryEmptyError");
          }
          var sResultValue = flowData.entry;
          iCurrentNodeIndex = getIndex(sResultValue);
        } catch (e) {
          throw new Error("startFlow error for errorCode, " + e.message);
        }
      },

      runFlow: function(sChosenResult) {
        var oNodeInstance = flowData.nodes[iCurrentNodeIndex];
        var aMappings = flowData.nodes[iCurrentNodeIndex].mappings;
        // get result index in repo
        var oNodeDefine = global.NodeRepo.getNode(oNodeInstance.clazz);
        var iChosenIndex = oNodeDefine.results.indexOf(sChosenResult);
        var sResultValue = aMappings[iChosenIndex];
        iCurrentNodeIndex = getIndex(sResultValue);
      },

      print: function() {
        if (!bFlowEnd) {
          if (iCurrentNodeIndex === -1) {
            console.log(flowData.remark);
          } else {
            console.log(flowData.nodes[iCurrentNodeIndex].remark);
          }
        } else {
          console.log(flowData.results[iCurrentNodeIndex]);
        }

      }
    };
  }();



  // mock data

  // node defs
  var guestNode = {
    "clazz": "com.cachetian.flow.sample.nodes.Guest",
    "remark": "This is Guest node",
    "results": ["logon", "exit"]
  };

  var logonNode = {
    "clazz": "com.cachetian.flow.sample.nodes.Logon",
    "remark": "This is Logon node",
    "results": ["success", "error"]
  };

  var homeNode = {
    "clazz": "com.cachetian.flow.sample.nodes.Home",
    "remark": "This is Home node",
    "results": ["logout", "business"]
  };

  var businessNode = {
    "clazz": "com.cachetian.flow.sample.nodes.Business",
    "remark": "This is Business node",
    "results": ["complete"]
  };

  var flowV1 = {
    "nodes": [{
      "remark": "Guest Node 1",
      "mappings": {
        "logon": "node-1",
        "exit": "result-0"
      }
    }, {
      "remark": "Logon Node 2",
      "mappings": {
        "success": "node-2",
        "error": "node-0"
      }
    }, {
      "remark": "Home Node 3",
      "mappings": {
        "logout": "node-0",
        "business": "node-3"
      }
    }, {
      "remark": "Business Node 4",
      "mappings": {
        "complete": "node-2"
      }
    }],
    "entry": "node-0",
    "remark": "sample flow",
    "results": ["flowEnd"]
  };

  global.AppV1 = {
    run: function(global) {
      console.log("global.AppV1.run() - start");
      // inti repo
      global.NodeRepoV1.addNode(guestNode).addNode(logonNode).addNode(homeNode).addNode(businessNode);

      // make flow
      global.FlowMaker.setDomain(global);
      global.FlowMaker.createFlow("com.cachetian.flow.sample.nodes.Guest", "sample flow", ["flowend"]);
      global.FlowMaker.addNode("logon", "com.cachetian.flow.sample.nodes.Logon");
      global.FlowMaker.addMapping("exit", 0);

      // run engine
      global.FlowEngineV1.setFlowData(flowV1);
      global.FlowEngineV1.print();
      global.FlowEngineV1.startFlow();
      global.FlowEngineV1.print();
      global.FlowEngineV1.runFlow("logon");
      global.FlowEngineV1.print();
      global.FlowEngineV1.runFlow("success");
      global.FlowEngineV1.print();
      global.FlowEngineV1.runFlow("business");
      global.FlowEngineV1.print();
      global.FlowEngineV1.runFlow("complete");
      global.FlowEngineV1.print();
      global.FlowEngineV1.runFlow("logout");
      global.FlowEngineV1.print();
      global.FlowEngineV1.runFlow("exit");
      global.FlowEngineV1.print();
    }
  }

  //global.AppV1.run(global);

  var flowData = {
    "nodes": [{
      "clazz": "node://com.cachetian.flow.sample.nodes.Guest",
      "remark": "Guest Node 1",
      "mappings": ["node-1", "result-0"]
    }, {
      "clazz": "node://com.cachetian.flow.sample.nodes.Logon",
      "remark": "Logon Node 2",
      "mappings": ["node-2", "node-0"]
    }, {
      "clazz": "node://com.cachetian.flow.sample.nodes.Home",
      "remark": "Home Node 3",
      "mappings": ["node-0", "node-3"]
    }, {
      "clazz": "node://com.cachetian.flow.sample.nodes.Business",
      "remark": "Business Node 4",
      "mappings": ["node-2"]
    }],
    "entry": "node-0",
    "remark": "sample flow",
    "results": ["flowEnd"]
  };

  var businessMasterNode = {
    "clazz": "com.cachetian.flow.sample.nodes.BusinessMaster",
    "remark": "This is Business Master node",
    "results": ["detail", "exit"]
  };

  var businessDetailNode = {
    "clazz": "com.cachetian.flow.sample.nodes.BusinessDetail",
    "remark": "This is Business Detail node",
    "results": ["master"]
  };

  var businessMdFlow = {
    "nodes": [{
      "clazz": "node://com.cachetian.flow.sample.nodes.BusinessMaster",
      "remark": "Business Master Node 0",
      "mappings": ["node-1", "result-0"]
    }, {
      "clazz": "node://com.cachetian.flow.sample.nodes.BusinessDetail",
      "remark": "Business Detail Node 1",
      "mappings": ["node-0"]
    }],
    "entry": "node-0",
    "clazz": "flow://com.cachetian.flow.sample.flows.BusinessMdFlow",
    "remark": "Master Detail Business flow",
    "results": ["flowEnd"]
  };

  var appflow = {
    "nodes": [{
      "clazz": "node://com.cachetian.flow.sample.nodes.Guest",
      "remark": "Guest Node 1",
      "mappings": ["node-1", "result-0"]
    }, {
      "clazz": "node://com.cachetian.flow.sample.nodes.Logon",
      "remark": "Logon Node 2",
      "mappings": ["node-2", "node-0"]
    }, {
      "clazz": "node://com.cachetian.flow.sample.nodes.Home",
      "remark": "Home Node 3",
      "mappings": ["node-0", "node-3"]
    }, {
      "clazz": "node://com.cachetian.flow.sample.nodes.Business",
      "remark": "Business Node 4",
      "mappings": ["node-2"]
    }, {
      "clazz": "flow://com.cachetian.flow.sample.nodes.Business",
      "remark": "Business Node 4",
      "mappings": ["node-2"]
    }],
    "entry": "node-0",
    "remark": "sample flow",
    "results": ["flowEnd"]
  };

  var flow = {
    /**
     *  add node trigger mappings adds
     * @param {[type]} sClazz [description]
     */
    addNode: function(sClazz) {},
    getNode: function(sId) {},
    getAllNodes: function() {},
    /**
     * add mapping
     * @param {[type]} sId     sId of a node or flowNode
     * @param {[type]} sResult [description]
     * @param {String} sTarget target can be node(node-sId) or flow result (result-sId)
     */
    addMapping: function(sId, sResult, sTarget) {

    }
  };

  var flowData0 = {
    "nodes": [],
    "entry": "",
    "remark": "sample flow 0",
    "results": ["flowEnd"]
  };

  // global, means any resource, nodes, functions, objects, mvcflow

  // test case
  global.AppV2 = {
    run: function(global) {
      console.log("global.App.run() - start");
      // inti repo
      global.NodeRepo.addNode(guestNode).addNode(logonNode).addNode(homeNode).addNode(businessNode).addNode(businessDetailNode).addNode(businessMasterNode).addNode(businessMdFlow);

      // make flow
      global.FlowMaker.setDomain(global);
      var oFlow = global.FlowMaker.createFlow("com.cachetian.flow.sample.nodes.Guest", "sample flow", ["flowend"]);
      oFlow.addNode("guest", "com.cachetian.flow.sample.nodes.Guest");
      oFlow.addMapping("exit", 0);
      var oNode = oFlow.getNode("guest"); // default by name
      var oNodeByIndex = oFlow.getNodeByIndex("0");
      var oNodeByName = oFlow.getNodeByName("0"); // get a inner node by path, by path you can access any node from static view
      oNode.addMapping("exit"); //add a mapping inside node scope
      oFlow.addMapping("entry", "node://0");

      //global.FlowMaker.addNode("logon", "com.cachetian.flow.sample.nodes.Logon");
      //global.FlowMaker.addMapping("exit", 0);

      // run engine
      global.FlowEngine.setDomain(global);
      global.FlowEngine.setFlowData(flowData);
      global.FlowEngine.print();
      global.FlowEngine.startFlow();
      global.FlowEngine.print();
      global.FlowEngine.runFlow("logon");
      global.FlowEngine.print();
      global.FlowEngine.runFlow("success");
      global.FlowEngine.print();
      global.FlowEngine.runFlow("business");
      global.FlowEngine.print();
      global.FlowEngine.runFlow("complete");
      global.FlowEngine.print();
      global.FlowEngine.runFlow("logout");
      global.FlowEngine.print();
      global.FlowEngine.runFlow("exit");
      global.FlowEngine.print();

      global.FlowEngine.setDomain(global);
      global.FlowEngine.setFlowData(businessMdFlow);
      global.FlowEngine.print();
      global.FlowEngine.startFlow();
      global.FlowEngine.print();
      global.FlowEngine.runFlow("detail");
      global.FlowEngine.print();
      global.FlowEngine.runFlow("master");
      global.FlowEngine.print();
      global.FlowEngine.runFlow("exit");
      global.FlowEngine.print();
    }
  };

  var flowData1 = {
    "nodes": [{
      "remark": "Guest Node 1",
      "mappings": {
        "logon": "",
        "exit": ""
      }
    }],
    "entry": "node-0",
    "remark": "sample flow",
    "results": ["flowEnd"]
  };

  var flowData2 = {
    "nodes": [{
      "remark": "Guest Node 1",
      "mappings": {
        "logon": "node-1",
        "exit": "result-0"
      }
    }, {
      "remark": "Logon Node 2",
      "mappings": {
        "success": "node-2",
        "error": "node-0"
      }
    }, {
      "remark": "Home Node 3",
      "mappings": {
        "logout": "node-0",
        "business": "node-3"
      }
    }, {
      "remark": "Business Node 4",
      "mappings": {
        "complete": "node-2"
      }
    }],
    "entry": "node-0",
    "remark": "sample flow",
    "results": ["flowEnd"]
  };
}

////////////////////////////////////////////////////////////////////////////////
//
// V3 OO based mvcflow
//
// Version 3.0 code start from here!
//
////////////////////////////////////////////////////////////////////////////////

var util = require('util');
var fs = require('fs');

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
  this._Id;
  this._info = new Info();
  this._scope;
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
  return this._info;
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
  //return this._targets.keys();
}

function ExitDestination() {
  this._flowEnd = false;
  this._target = null;
}
ExitDestination.prototype.isFlowEnd = function() {
  return this._flowEnd;
}
ExitDestination.prototype.getFlowEnd = function() {
  return this._flowEnd;
}
ExitDestination.prototype.setFlowEnd = function(bFlowEnd) {
  this._flowEnd = bFlowEnd;
}
ExitDestination.prototype.getTarget = function() {
  return this._target;
}
ExitDestination.prototype.setTarget = function(oTarget) {
  this._target = oTarget;
}

function NodeModel() {
  this._info = new Info();
  this._inputs = [];
  this._outputs = [];
  this._exits = [];
  this._exitName2Index = {};
  this._instances = [];
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
NodeModel.prototype.getOuputs = function() {
  return this._outputs;
}
NodeModel.prototype.getExits = function() {
  return this._exits;
}
NodeModel.prototype.setExits = function(aExits) {
  console.log("NodeModel.setExits(<aExits=[" + aExits + "]>)");
  for (var i = 0; i < aExits.length; i++) {
    this._exitName2Index[aExits[i]] = i;
  }
  this._exits = aExits;
}
NodeModel.prototype.registerIntance = function(oNode) {
  console.log("NodeModel.registerIntance(<oNode=[" + oNode + "]>)");
  // generate and set sequence number
  var seq = this._instances.length;
  oNode.getInfo().setCode(this.getInfo().getCode());
  oNode.getInfo().setName(this.getInfo().getName() + " " + seq);
  oNode.getInfo().setRemark(this.getInfo().getRemark() + " " + seq);
  oNode.setModel(this);
  this._instances.push(oNode);
}

NodeModel.prototype.getExitIndexByName = function(sName) {
  //var index = this.getExits().indexOf(sName);
  var index = this._exitName2Index[sName];
  //console.log("NodeModel.getExitIndexByName() exitName2Index:" + printObject(this._exitName2Index));
  //console.log("NodeModel.getExitIndexByName(<sName=[" + sName + "]>) return [" + index + "]");
  return this._exits.indexOf(sName);
}

function FlowModel() {
  this._info = new Info();
  this._inputs = [];
  this._outputs = [];
  this._exits = [];
  this._exitName2Index = {};
  this._scope = new Scope();
  this._entry = null;
  this._instances = [];
  this._nodeModelCode2Inst = {};
  this._nodeModels = [];
}
util.inherits(FlowModel, NodeModel);

FlowModel.prototype.addNode = function(oNode) {
  this._instances.push(oNode);
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
FlowModel.prototype.setEntry = function(oNode) {
  try {
    // NOTE:
    // oNode must be one added oNodes
    this._entry = oNode;
  } catch (e) {
    throw new Error("FlowModel.setEntry error, message: " + e.message + ", traceStack is: ");
  } finally {

  }
}
FlowModel.prototype.getNodeModelByCode = function(sCode) {
  return this._nodeModelCode2Inst[sCode];
}
FlowModel.prototype.registerNodeModel = function(oNodeModel) {
  this._nodeModels.push(oNodeModel);
  return this._nodeModelCode2Inst[oNodeModel.getInfo().getCode()] = oNodeModel;
}
FlowModel.prototype.getNodeModels = function() {
  return this._nodeModels;
}
FlowModel.prototype.getInstances = function(){
  return this._instances;
}

function Node() {
  this._model = null;
  this._modelCode = "";
  this._exits = [];
  this._info = new Info();
}
util.inherits(Node, Target);
Node.prototype.getModel = function() {
  return this._model;
}
Node.prototype.setModel = function(oModel) {
  this._model = oModel;
  this._exits.length = oModel.getExits().length;
}
Node.prototype.getModelCode = function() {
  return this._modelCode;
}
Node.prototype.setModelCode = function(sModelCode) {
  this._modelCode = sModelCode;
}
Node.prototype.getExits = function() {
  return this._exits;
}
Node.prototype.setExit = function(iExit, oExitDestination) {
  console.log("Node.setExit(<iExit=[" + iExit + "]>, <oExitDestination=[" + printDestination(oExitDestination) + "]>)");
  this._exits[iExit] = oExitDestination;
}

function FlowEngine() {
  this._flowModel = null;
  this._currentNode = null;
  this._flowExit = "";
  this._stack = [];
}
FlowEngine.prototype.start = function() {
  this._currentNode = this._flowModel.getEntry();
}
FlowEngine.prototype.getCurrentFlowModel = function() {
  return this._currentNode.getScope();
}

FlowEngine.prototype.goToNextNode = function(sResult) {
  //console.log("FlowEngine.goToNextNode(<sResult=[" + sResult + "]>)");
  var iExit = this.getCurrentNode().getModel().getExitIndexByName(sResult);
  //console.log("FlowEngine.goToNextNode() iExit is:" + iExit);
  var oExitDestination = this.getCurrentNode().getExits()[iExit];
  //console.log("FlowEngine.goToNextNode() oExitDestination is:" + printDestination(oExitDestination));
  console.log("FlowEngine.goToNextNode(<sResult=[" + sResult + "]>) found oExitDestination is:" + printDestination(oExitDestination));
  if (oExitDestination.isFlowEnd()) {
    this._flowExit = oExitDestination.getTarget();
    // out stack
    if (this._stack.length === 0) {
      console.log("FlowEngine.goToNextNode() Flow end with exit [" + this._flowExit + "]!");
      this._currentNode = null;
    } else {
      console.log("FlowEngine.goToNextNode() out stack");
      this._currentNode = this._stack.pop();
      this.goToNextNode(this._flowExit);
    }
  } else {
    this._currentNode = oExitDestination.getTarget();
    // enter stack
    if (this.getCurrentNode() instanceof FlowNode) {
      console.log("FlowEngine.goToNextNode() enter stack");
      this._stack.push(this.getCurrentNode());
      this._currentNode = this._currentNode.getModel().getEntry();
    }
  }
}
FlowEngine.prototype.getCurrentNode = function(sResult) {
  return this._currentNode;
}
FlowEngine.prototype.setFlowModel = function(oFlowModel) {
  this._flowModel = oFlowModel;
}

function FlowNode() {
  this._model = null;
  this._modelCode = "";
  this._exits = [];
  this._info = new Info();
}
util.inherits(FlowNode, Target);

FlowNode.prototype.getModel = function() {
  return this._model;
}
FlowNode.prototype.setModel = function(oModel) {
  this._model = oModel;
  this._exits.length = oModel.getExits().length;
}
FlowNode.prototype.getModelCode = function() {
  return this._modelCode;
}
FlowNode.prototype.setModelCode = function(sModelCode) {
  this._modelCode = sModelCode;
}
FlowNode.prototype.getExits = function() {
  return this._exits;
}
FlowNode.prototype.setExit = function(iExit, oExitDestination) {
  console.log("FlowNode.setExit(<iExit=[" + iExit + "]>, <oExitDestination=[" + printDestination(oExitDestination) + "]>)");
  this._exits[iExit] = oExitDestination;
}

var FlowMaker = (function() {
  return {
    saveFlowModelToFile: function(oFlowModel) {
      // oFlowModel to String

      // All NodeModels


      // All FlowModels

      // All Nodes

      // All Mappings



      fs.writeFile('flowModel.json', 'Hello Node.js', function(err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    },
    readFlowModelFromFile: function() {
      fs.readFile('flowModel.json', {
        encoding: 'utf-8'
      }, function(err, data) {
        if (err) throw err;
        console.log(data);
      });
    }
  };
})();

var idSequenceNumber = 0;
var randomSequenceNumber = 0;
var uuid = require('node-uuid');

function generateTarget() {
  var seq = idSequenceNumber++;
  var oTarget = new Target();
  oTarget.setId(uuid.v1());
  oTarget.setInfo(generateInfo());
  return oTarget;
}

function generateInfo() {
  var seq = randomSequenceNumber++;
  var oInfo = new Info();
  oInfo.setCode("code" + seq);
  oInfo.setName("name" + seq);
  oInfo.setRemark("This is info of seq" + seq);
  return oInfo;
}

function generateNodeModel(oData) {
  var oNodeModel = new NodeModel();
  oNodeModel.getInfo().setCode(oData.code);
  oNodeModel.getInfo().setName(oData.name);
  oNodeModel.getInfo().setRemark(oData.remark);
  oNodeModel.setExits(oData.exits);
  return oNodeModel;
}

function generateNode(oModel) {
  var oNode = new Node();
  oNode.setId(uuid.v1());
  console.log("generateNode() oModel.info: " + printInfo(oModel.getInfo()));
  oModel.registerIntance(oNode);
  console.log("generateNode() oNode.info: " + printInfo(oNode.getInfo()));
  return oNode;
}

function generateSource(oNode, sExit) {
  var oSource = {
    "node": oNode,
    "exit": sExit
  }
  return oSource;
}

function generateDestination(bFlowEnd, oValue) {
  var oDestination = new ExitDestination();
  oDestination.setTarget(oValue);
  oDestination.setFlowEnd(bFlowEnd);
  return oDestination;
}

function generateFlowModel(oData) {
  console.log("generateFlowModel(<oData=[" + printObject(oData) + "]>)");
  var oFlowModel = new FlowModel();
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

function generateFlowNode(oFlowModel) {
  var oFlowNode = new FlowNode();
  oFlowNode.setId(uuid.v1());
  console.log("generateFlow() oFlowModel.info: " + printInfo(oFlowModel.getInfo()));
  oFlowModel.registerIntance(oFlowNode);
  console.log("generateFlow() oFlowNode.info: " + printInfo(oFlowNode.getInfo()));
  return oFlowNode;
}

function printInfo(oInfo) {
  if (oInfo && oInfo instanceof Info) {
    return "{code:\"" + oInfo.getCode() + "\", name:\"" + oInfo.getName() + "\", remark:\"" + oInfo.getRemark() + "\"}";
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
  var str = "{";
  str += 'flowEnd:""' + oDestination.getFlowEnd() + '", ';
  str += 'targer:"' + (oDestination.isFlowEnd() ? oDestination.getTarget() : oDestination.getTarget().getInfo().getName()) + '"';
  str += "}";
  return str;
}

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

function nodeToJSONString(oNode) {
  var oData = {
    "id": oNode.getId(),
    "exits": [],
    "info": {
      "code": oNode.getInfo().getCode(),
      "name": oNode.getInfo().getName(),
      "remark": oNode.getInfo().getRemark()
    }
  };
  // process exits
  for (var i = 0; i < oNode.getExits().length; i++) {
    var oExtDst = oNode.getExits()[i];
    oData.exits[i] = {
      "flowEnd": oExtDst.getFlowEnd(),
      "target": ""
    };
    if (oExtDst.isFlowEnd()) {
      oData.exits[i].target = oExtDst.getTarget();
    } else {
      oData.exits[i].target = oExtDst.getTarget().getId();
    }
  }
  return JSON.stringify(oData);
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
    "nodeModels": [],
    "nodes": [],
    "entry": ""
  };

  if (oFlowModel.getEntry()){
    oData.entry = oFlowModel.getEntry().getId();
  }

  // for each node models
  for (var i = 0; i < oFlowModel.getNodeModels().length; i++) {
    var oModel = oFlowModel.getNodeModels()[i];
    oData.nodeModels.push(nodeModelToJSONString(oModel));
  }

  // for each nodes
  for (var j = 0; j < oFlowModel.getInstances().length; j++) {
    array[j]
  }
  return JSON.stringify(oData);
}

// FileSystem rules:
// root of mvcflow fs, homedir/.mvcflow
// mvcflowRoot/.

var os = require("os");

global.App = {
  run: function(global) {
    console.log("V3 mvcflow start");

    // start from create Node Model
    console.log("Test Class Target:");
    var oTarget = new Target();
    oTarget.setId("001");
    oTarget.setInfo(new Info());
    oTarget.getInfo().setCode("c001");
    oTarget.getInfo().setName("n001");
    oTarget.getInfo().setRemark("this is target");
    console.log("target.id is: " + oTarget.getId());
    console.log("target.info is: " + printInfo(oTarget.getInfo()));
    console.log("");

    console.log("Test Class Scope:");
    var oScope = new Scope();
    oScope.registerTarget(oTarget);
    var oScopeTarget = oScope.getTarget("001");
    console.log("scoped target.id is: " + oScopeTarget.getId());
    console.log("scoped target.info is: " + printInfo(oScopeTarget.getInfo()));
    oScope.getAllTargetIds();
    var oGenedInfo = generateInfo();
    console.log("gened info is: " + printInfo(oGenedInfo));
    var oGenedTarget = generateTarget();
    console.log("gened taget.info is: " + printInfo(oGenedTarget.getInfo()));
    for (var i = 0; i < 10; i++) {
      var oGenedItemTaget = generateTarget();
      console.log("gened item[" + i + "]taget.info is: " + printInfo(oGenedItemTaget.getInfo()));
      oScope.registerTarget(oGenedItemTaget);
    }
    var aProps = oScope.getAllTargetIds()
    console.log("scope all tIds are: " + aProps);
    console.log("scoped target.info.name is: " + oScope.getTarget(aProps[0]).getInfo().getName());
    console.log("");

    console.log("Test Class NodeModel, Node:");
    // Create a class - Node model
    var oNewNodeModel = new NodeModel();
    oNewNodeModel.getInfo().setCode("mvcflow.sample.nodes.New");
    oNewNodeModel.getInfo().setRemark("New NM");
    console.log("newNodeModel.info is: " + printInfo(oNewNodeModel.getInfo()));
    oNewNodeModel.setExits(["e001", "e002"]);
    console.log("newNodeModel eixts:" + oNewNodeModel.getExits());

    // Instanciate a instace
    var oNewNode = new Node();
    oNewNode.setModel(oNewNodeModel);
    console.log("newNode.model.info :" + printInfo(oNewNode.getModel().getInfo()));

    var oGenNewNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.GenNew",
      "name": "GenNew",
      "remark": "This is GenNew node",
      "exits": ["e001", "e002"]
    });
    console.log("oGenNewNodeModel.info: " + printInfo(oGenNewNodeModel.getInfo()));
    var oGenNewNode = generateNode(oGenNewNodeModel);
    console.log("oGenNewNode.info: " + printInfo(oGenNewNode.getInfo()));
    console.log("");

    console.log("Test Class FlowModel:");
    var oFlowModel = new FlowModel();
    console.log("flowModle inst.info: " + oFlowModel.getInfo());
    oFlowModel.getInfo().setCode("mvcflow.sample.flows.Menu");
    oFlowModel.getInfo().setRemark("Menu FM");
    oFlowModel.setExits(["flowend"]);
    console.log("flowModel.info.remark is :" + oFlowModel.getInfo().getRemark());
    oFlowModel.setEntry(oNewNode);
    console.log("flowModel.entry.info: " + printInfo(oFlowModel.getEntry().getInfo()));

    var oGuestNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Guest",
      "name": "Guest",
      "remark": "This is Guest node",
      "exits": ["logon", "exit"]
    });
    console.log("oGuestNodeModel.info: " + printInfo(oGuestNodeModel.getInfo()));
    var oGuestNode = generateNode(oGuestNodeModel);
    console.log("oGuestNode.info: " + printInfo(oGuestNode.getInfo()));
    oFlowModel.addNode(oGuestNode);

    var oLogonNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Logon",
      "name": "Logon",
      "remark": "This is Logon node",
      "exits": ["success", "error"]
    });
    var oLogonNode = generateNode(oLogonNodeModel);
    oFlowModel.addNode(oLogonNode);

    var oHomeNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Home",
      "name": "Home",
      "remark": "This is Home node",
      "exits": ["logout", "business"]
    });
    var oHomeNode = generateNode(oHomeNodeModel);
    oFlowModel.addNode(oHomeNode);

    var oBusinessNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.Business",
      "name": "Business",
      "remark": "This is Business node",
      "exits": ["complete"]
    });
    var oBusinessNode = generateNode(oBusinessNodeModel);
    oFlowModel.addNode(oBusinessNode);

    // Flow
    // Guest.exit -> flow.flowend
    // Guest.logon -> logon
    // Logon.success -> Home
    // Logon.error -> Guest
    // Home.logout -> Guest
    // Home.business -> Business
    // Business.complete -> Home
    oFlowModel.setEntry(oGuestNode);
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
    var oCurrentNode = oFlowEngine.getCurrentNode();
    console.log("flowEngine.currentNode.info: " + printInfo(oCurrentNode.getInfo()));
    oFlowEngine.goToNextNode("logon");
    console.log("flowEngine.currentNode.info: " + printInfo(oFlowEngine.getCurrentNode().getInfo()));
    oFlowEngine.goToNextNode("success");
    console.log("flowEngine.currentNode.info: " + printInfo(oFlowEngine.getCurrentNode().getInfo()));
    oFlowEngine.goToNextNode("business");
    console.log("flowEngine.currentNode.info: " + printInfo(oFlowEngine.getCurrentNode().getInfo()));
    oFlowEngine.goToNextNode("complete");
    console.log("flowEngine.currentNode.info: " + printInfo(oFlowEngine.getCurrentNode().getInfo()));
    oFlowEngine.goToNextNode("logout");
    console.log("flowEngine.currentNode.info: " + printInfo(oFlowEngine.getCurrentNode().getInfo()));
    oFlowEngine.goToNextNode("exit");
    console.log("");

    // Test subflow
    console.log("Test Sub Flow");
    var oBusinessFlowModel = generateFlowModel({
      "code": "mvcflow.sample.flows.BusinessFlow",
      "name": "BusinessFlow",
      "remark": "Master Detail Business flow",
      "exits": ["complete"]
    });

    var oBusinessMasterNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.BusinessMaster",
      "name": "BusinessMaster",
      "remark": "This is Business Master node",
      "exits": ["detail", "exit"]
    });
    var oBusinessMasterNode = generateNode(oBusinessMasterNodeModel)
    oBusinessFlowModel.addNode(oBusinessMasterNode);

    var oBusinessDetailNodeModel = generateNodeModel({
      "code": "mvcflow.sample.nodes.BusinessDetail",
      "name": "BusinessDetail",
      "remark": "This is Business Detail node",
      "exits": ["master"]
    });
    var oBusinessDetailNode = generateNode(oBusinessDetailNodeModel);
    oBusinessFlowModel.addNode(oBusinessDetailNode);

    oBusinessFlowModel.setEntry(oBusinessMasterNode);
    oBusinessFlowModel.addMapping(generateSource(oBusinessMasterNode, "detail"), generateDestination(false, oBusinessDetailNode));
    oBusinessFlowModel.addMapping(generateSource(oBusinessMasterNode, "exit"), generateDestination(true, "complete"));
    oBusinessFlowModel.addMapping(generateSource(oBusinessDetailNode, "master"), generateDestination(false, oBusinessMasterNode));

    var oBusinessFlowEngine = generateFlowEngine(oBusinessFlowModel);
    oBusinessFlowEngine.start();
    console.log("oBusinessFlowEngine.currentNode.info: " + printInfo(oBusinessFlowEngine.getCurrentNode().getInfo()));
    oBusinessFlowEngine.goToNextNode("detail");
    console.log("oBusinessFlowEngine.currentNode.info: " + printInfo(oBusinessFlowEngine.getCurrentNode().getInfo()));
    oBusinessFlowEngine.goToNextNode("master");
    console.log("oBusinessFlowEngine.currentNode.info: " + printInfo(oBusinessFlowEngine.getCurrentNode().getInfo()));
    oBusinessFlowEngine.goToNextNode("exit");
    console.log("");

    // Test App Flow (Embed with Sub Flow)
    console.log("Test App Flow");
    var oAppFlowModel = generateFlowModel({
      "code": "mvcflow.sample.flows.App",
      "name": "App",
      "remark": "This is App flow",
      "exits": ["flowend"]
    });

    oAppFlowModel.addNode(oGuestNode);
    oAppFlowModel.addNode(oLogonNode);
    oAppFlowModel.addNode(oHomeNode);

    var oBusinessFlowNode = generateFlowNode(oBusinessFlowModel);
    oAppFlowModel.addNode(oBusinessFlowNode);

    oAppFlowModel.setEntry(oGuestNode);
    oAppFlowModel.addMapping(generateSource(oGuestNode, "logon"), generateDestination(false, oLogonNode));
    oAppFlowModel.addMapping(generateSource(oGuestNode, "exit"), generateDestination(true, "flowend"));
    oAppFlowModel.addMapping(generateSource(oLogonNode, "success"), generateDestination(false, oHomeNode));
    oAppFlowModel.addMapping(generateSource(oLogonNode, "error"), generateDestination(false, oGuestNode));
    oAppFlowModel.addMapping(generateSource(oHomeNode, "logout"), generateDestination(false, oGuestNode));
    oAppFlowModel.addMapping(generateSource(oHomeNode, "business"), generateDestination(false, oBusinessFlowNode));
    oAppFlowModel.addMapping(generateSource(oBusinessFlowNode, "complete"), generateDestination(false, oHomeNode));

    var oAppFlowEngine = generateFlowEngine(oAppFlowModel);
    oAppFlowEngine.start();
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("logon");
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("success");
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("business");
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("detail");
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("master");
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("exit");
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("logout");
    //console.log("oAppFlowEngine.currentNode.info: " + printInfo(oAppFlowEngine.getCurrentNode().getInfo()));
    oAppFlowEngine.goToNextNode("exit");
    console.log("");

    console.log("Test FlowModel registerNodeModel");
    var oRegFlowModel = generateFlowModel({
      "code": "mvcflow.sample.flows.Reg",
      "name": "Reg",
      "remark": "This is Reg flow",
      "exits": ["flowend"]
    });
    oRegFlowModel.registerNodeModel(oGuestNodeModel);
    oRegFlowModel.registerNodeModel(oLogonNodeModel);
    oRegFlowModel.registerNodeModel(oHomeNodeModel);
    oRegFlowModel.registerNodeModel(oBusinessNodeModel);
    console.log("flowModel.nodeModels: " + printObject(oRegFlowModel.getNodeModels()));
    console.log("");

    console.log("Test FlowMaker");
    //FlowMaker.saveFlowModelToFile(oAppFlowModel);
    //FlowMaker.readFlowModelFromFile();

    // How to serialize FlowModel
    // Implements ways of NodeModel to string.
    // Implements ways of Node to string (without model), use code for reference
    // Implements ways of Mapping to string, use ID instead Node.
    // If depends on a FlowModel, load dependcies FlowModel first.

    console.log("os.homedir: " + os.homedir());
    console.log("");

    console.log("Test serialize");
    var oSerFlowModel = generateFlowModel({
      "code": "mvcflow.sample.flows.Ser",
      "name": "Ser",
      "remark": "This is Ser flow",
      "exits": ["flowend"]
    });
    oSerFlowModel.registerNodeModel(oGuestNodeModel);
    oSerFlowModel.registerNodeModel(oLogonNodeModel);
    oSerFlowModel.registerNodeModel(oHomeNodeModel);
    oSerFlowModel.registerNodeModel(oBusinessNodeModel);
    oSerFlowModel.addNode(oGuestNode);
    oSerFlowModel.addNode(oLogonNode);
    oSerFlowModel.addNode(oHomeNode);
    oSerFlowModel.addNode(oBusinessFlowNode);
    var nodeModelJsonString = nodeModelToJSONString(oGuestNodeModel);
    console.log("nodeModelJsonString: " + nodeModelJsonString);
    var nodeJsonString = nodeToJSONString(oGuestNode);
    console.log("nodeJsonString: " + nodeJsonString);
    var flownNodeJsonString = flowModelToJSONString(oRegFlowModel);
    console.log("flownNodeJsonString: " + flownNodeJsonString);
  }
};
global.App.run(global);
