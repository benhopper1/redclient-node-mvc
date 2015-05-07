//model----------------
var path = require('path');
var basePath = path.dirname(require.main.filename);
var extend = require(basePath + '/node_modules/node.extend');
var fs = require('fs');
//var RedClient = require(basePath + '/library/redclient/redclient.js');

var Model = function(){
	var _this = this;
	var redClient = global.redClient;

	//==================================================================
	//--  NO RETURN COMM  ----------------------------------------------
	//==================================================================
	redClient.subscribe(global.SEVER_NAME, function(inMessage){
		global.reportNotify('INFORMATION MODEL ' + global.SEVER_NAME, 
			{
				message:inMessage,
			}, 0
		);

		var options = 
			{
				command:false,
				params:false,
				data:false,
			}
		options = extend(options, inMessage);


		var ExecutionObject = 
			{
					
					//==================================================================
					//--  STORE CIP SERVER DATA  ---------------------------------------
					//==================================================================
					//used in controller for redirection url builds
					storeCipServerData:function(params, data){
						global.reportNotify('STORE CIP SERVER DATA', data, 0);
						global.cipServerData = data;
					},
					//==================================================================
					//--  KILL THIS SERVER  --------------------------------------------
					//==================================================================
					killServer:function(params, data){
						global.reportNotify('killServer', data, 0);
						process.exit();
					},

			}

		if(Object.keys(ExecutionObject).indexOf(options.command) != -1){
			ExecutionObject[options.command](options.params, options.data);
		}else{
			global.reportError('INFORMATION MODEL ' + global.SEVER_NAME,
				{
						command:options.command,
						error:'command does not exist',
						message:inMessage,
				}, 0
			);
			return;
		}



	});


/*
	redClient.subscribeTransaction(global.SEVER_NAME, function(inMessage, done){
		if(!(inMessage.command)){done({});}
		

		if(inMessage.command == 'getUserInformation'){
			var userDataArray = global.userId_hashOfArray.getArrayFromHash(inMessage.userId);
			done(
				{
					userDataArray:userDataArray,
				}
			);
			return;
		}

		done({});
	});
*/
	//==================================================================
	//--  QUERY COMM  --------------------------------------------------
	//==================================================================
	redClient.subscribeTransaction(global.SEVER_NAME + '_query', function(inMessage, done){
		if(!(inMessage.command)){done({});}
		var options = 
			{
				command:false,
				params:false,
				data:false,
			}
		options = extend(options, inMessage);


		var QueryObject = 
			{
				commands:function(params, data){
					var commandsArray = Object.keys(QueryObject);
					done(
						{
							commandsArray:commandsArray,
						}
					);
				},
				test:function(params, data){
					done(
						{
							'testkey':'testValue',
						}
					);
				},

			}

		if(Object.keys(QueryObject).indexOf(options.command) != -1){
			QueryObject[options.command](options.params, options.data);
		}else{
			done(
				{
					error:'no command by that name',
					commands:Object.keys(QueryObject),
				}
			);
			return;
		}


	});



}

module.exports = Model;
