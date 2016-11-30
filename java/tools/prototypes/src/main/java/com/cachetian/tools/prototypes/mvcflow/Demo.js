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

console.log("mvcflow sample");

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

//
// Flow class, indicate an created flow instance.
//
function Flow () {
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

function Node () {
    this.data = {};
}

Node.prototype.addMapping = function(oNode, sTarget) {

};

function Target () {
    this._info = null;
    this._ID = "";
    this._scope = null;
}

Target.prototype.getID = function() {
  return this._ID;
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
				var oNode = oFlow.getNode("guest");// default by name
				var oNodeByIndex = oFlow.getNodeByIndex("0");
				var oNodeByName = oFlow.getNodeByName("0");// get a inner node by path, by path you can access any node from static view
				oNode.addMapping("exit");//add a mapping inside node scope
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

//
// V3 OO based mvcflow
//

global.App = {
    run: function(global) {
        console.log("V3 mvcflow start");

        // start from create Node Model
        

    }
};
global.App.run(global);
