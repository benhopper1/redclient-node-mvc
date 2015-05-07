
var path = require('path');
var fs = require('fs');
var basePath = path.dirname(require.main.filename);
var moment = require(basePath + '/node_modules/moment');

var MaintenanceObject = require(basePath + '/libs/maintenance/maintenanceobject.js');
var DebugObject = require(basePath + '/libs/debug/debugobject.js');

var util = require('util');
var HashOfArray = require(basePath + '/libs/hashofarrayobject.js');
var extend = require(basePath + '/node_modules/node.extend');
var RedClient = require(basePath + '/libs/redclient/redclient.js');

//==================================================================
//--  GLOBAL REDCLIENT INSTANCE  -----------------------------------
//==================================================================
global.redClient = new RedClient();



//==========================================================
// REPORT ERROR --------------------------------------------
//==========================================================
var genErrorLog = new DebugObject(
	{
		label:'general',
		filePath:basePath + '/generror.log'
	}
);
global.reportError = function(inCaption, inData, inClass){
	console.log('===============  REPORT ERROR  =====================================');
	console.log('CAPTION:' + inCaption + '        CLASS:' + inClass);
	console.log('--------------------------------------------------------------------');
	console.log(util.inspect(inData, false, 7, true));
	console.log('====================================================================');
	genErrorLog.reportError(inCaption, inData);
}
//==========================================================
// REPORT NOTIFICATION -------------------------------------
//==========================================================
var genNotifyLog = new DebugObject(
	{
		label:'general',
		filePath:basePath + '/gennotify.log'
	}
);
global.reportNotify = function(inCaption, inData, inClass){
	//console.log(util.inspect({"FFFFFFFFFFF":'sss',ddd:888}, false, 2, true));
	console.log(util.inspect('===============  REPORT NOTIFY  =====================================', false, 2, true));
	console.log(util.inspect('CAPTION:' + inCaption + '        CLASS:' + inClass, false, 1, true));
	console.log('---------------------------------------------------------------------');
	console.log(util.inspect(inData, false, 7, true));
	console.log(util.inspect('=====================================================================', false, 2, true));
	genNotifyLog.reportError(inCaption, inData);
}

global.reportNotify('REDCLIENT NODEJS MVC', 'SERVER IS STARTING', 0);

console.log('process.argv-------------------');
console.dir(process.argv);

//----readin my secrets /git ignored conf file-----
var configData = fs.readFileSync('main.conf', 'utf8');
configData = JSON.parse(configData);

global.SEVER_NAME = configData.serverName;


var basePath = path.dirname(require.main.filename);
console.log('basePath:'+basePath);





/*
var Connection = require(__dirname + '/models/connection.js');
//---done statically here so connection will be prepared for future and share
var connection = Connection.getMaybeCreate(
	{
		instanceName:'arf',
		host:configData.mysqlServerConnection.host,
		user:configData.mysqlServerConnection.user,
		password:configData.mysqlServerConnection.password,
		database:configData.mysqlServerConnection.database

	}
);
\*/


//----------dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file){
	if(file.substr(-3) == '.js'){
		console.log(file);
		//route = require('./controllers/' + file);
		//route.controller(app);
	}
});


//========================================================================
// CLEAN UP AND EXIT FACILITY
//========================================================================
process.stdin.resume();//so the program will not close instantly
function exitHandler(options, err){
	if(options.cleanup){
		global.reportNotify('WSAPP', 'EXITING APP', 0);
		//close mysql connections
		//Connection.terminateAll();
	}
	if(err){
		console.log(err.stack);
	}
	if(options.exit){
		process.exit();
	}
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

//==================================================================
//--  INFORMATION MODEL  -------------------------------------------
//==================================================================
var InformationModel = require(basePath + '/models/informationmodel.js');
var informationModel = new InformationModel();

