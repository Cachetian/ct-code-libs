package com.zjft.https
{
	import flash.events.IEventDispatcher;

	/**
	 * Object-oriented Http API.
	 * 
	 * @author ct 
	 * 		2015/03/04
	 */
	public interface IHttps extends IEventDispatcher
	{
		//
		// ---- Utils functions 
		//
		
		/**
		 * Add a IHttpsHandler
		 * @param handler an IHttpsHandler
		 * 
		 */
		function addHandler(handler:IHttpsHandler):void;
		
		//
		// ---- Properties
		//
		
		/**
		 * set http method of all http request by default.
		 */
		
		function get httpMethod():String;
		
		/**
		 * @private
		 */
		function set httpMethod(value:String):void;
		
		//
		// ---- Methods
		//
		
		/**
		 * Send http request
		 * @param url
		 * @param data
		 * @param method
		 * @return 
		 * 
		 */
		function sendHttpRenquest(url:String, data:Object=null, method:String="get"):void;
		
		/**
		 * Send http get
		 * @param url
		 * @param param
		 * @param callback
		 * @return 
		 * 
		 */
		function httpGet(url:String, param:Object=null, successCalback:Function=null, failedCallback:Function=null):void;
		
		/**
		 * Send http post
		 * @param url
		 * @param param
		 * @param callback
		 * @return 
		 * 
		 */
		function httpPost(url:String, param:Object=null, successCallback:Function=null, failedCallback:Function=null):void;
		
	}
}