package com.zjft.https
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IEventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	
	/**
	 * dispatched when request is not sent to server.
	 * */
	[Event(name="sendError", type="com.zjft.https.HttpsEvent")]
	
	/**
	 * dispatched when request is sent to server, but server errors. 
	 * */
	[Event(name="recievedError", type="com.zjft.https.HttpsEvent")]
	
	/**
	 * dispatched when response recieved.
	 * */
	[Event(name="reponseRecieved", type="com.zjft.https.HttpsEvent")]
	
	/**
	 * JSON-Based-Http-Interface, for AIR, actionScript
	 * 
	 * @author tianmu
	 * 
	 */
	public class Https extends EventDispatcher implements IHttps
	{
		//----------------------------------------------------------------------
		//
		// Static function apis
		//
		//----------------------------------------------------------------------
		
		/**
		 * 
		 * @param param 
		 * 
		 */
		public static function ajax(param:Object):void
		{
			if (null == param)
			{
				return;
			}
			
			doAjax(param);
		}
		
		/**
		 * 发送http get请求
		 * @param url
		 * @param data
		 * @param success success(response,status,xhr)
		 * @param dataType
		 * 
		 */
		public static function get(url:String, data:Object=null, success:Function=null, dataType:String=null, error:Function=null):void
		{
			doAjax({"url":url, "data":data, "success":success, "dataType":dataType, "type":URLRequestMethod.GET, "error":error});
		}
		
		/**
		 * 发送http post请求
		 * @param url
		 * @param data
		 * @param success success(response,status,xhr)
		 * @param dataType
		 * 
		 */
		public static function post(url:String, data:Object=null, success:Function=null, dataType:String=null, error:Function=null):void
		{
			doAjax({"url":url, "data":data, "success":success, "dataType":dataType, "type":URLRequestMethod.POST, "error":error});
		}
		
		/**
		 * create a https object.
		 * 
		 */
		public static function createHttps(handler:IHttpsHandler=null):IHttps
		{
			var https:IHttps = new Https();
			if (null != handler)
			{
				https.addHandler(handler);
			}
			return https;
		}
		
		/**
		 * ajax内部实现方法
		 * @param param
		 * @private
		 */
		private static function doAjax(param:Object):void
		{
			// 定义一个urlRequest
			var urlRequset:URLRequest = new URLRequest();
			urlRequset.url = param.url;
			urlRequset.data = param.data;
			urlRequset.method = param.type;
			urlRequset.contentType = param.dataType
			
			// 使用urlLoader来发送
			var urlLoader:URLLoader = new URLLoader();
			var successcb:Function = function(e:Event):void{
				e.target.removeEventListener(Event.COMPLETE, successcb);
				if (null != param.success){
					param.success(urlLoader.data);
				}
			};
			urlLoader.addEventListener(Event.COMPLETE, successcb);
			var errorcb:Function = function(e:IOErrorEvent):void{
				e.target.removeEventListener(Event.COMPLETE, errorcb);
				if (null != param.error)
				{
					param.error(e.text);
				}
			};
			urlLoader.addEventListener(IOErrorEvent.IO_ERROR, errorcb);
			urlLoader.load(urlRequset);
		}
		
		//----------------------------------------------------------------------
		//
		// Object-oriented apis
		//
		//----------------------------------------------------------------------
		
		/**
		 * Create a Https Object
		 * @param target
		 * 
		 */
		public function Https(target:IEventDispatcher=null)
		{
			super(target);
			this.urlLoader.addEventListener(Event.COMPLETE, onComptete);
			this.urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onError);
			this.urlLoader.addEventListener(IOErrorEvent.IO_ERROR, onError);
		}
		
		private var _httpMehtod:String;
		
		/**
		 * http method of this http object
		 * */
		public function get httpMethod():String
		{
			return _httpMehtod;
		}
		
		/**
		 * @private
		 */
		public function set httpMethod(value:String):void
		{
			_httpMehtod = value;
		}
		
		private var urlLoader:URLLoader = new URLLoader();
		
		/**
		 * add a handler of this https object.
		 * @param handler
		 * 
		 */
		public function addHandler(handler:IHttpsHandler):void
		{
			this.addEventListener("requestRecieved", handler.Http_onRequestRecieved);
			this.addEventListener("recievedError", handler.Http_onRecieveError);
			this.addEventListener("sendError", handler.Http_onSendError);
		}
		
		/**
		 * Send a http get request.
		 * @param url
		 * @param param
		 * @param successCallback
		 * @param failedCallback
		 * 
		 */
		public function httpGet(url:String, param:Object=null, successCallback:Function=null, failedCallback:Function=null):void
		{
			httpRequest(url, param, successCallback, failedCallback, URLRequestMethod.GET);
		}
		
		/**
		 * Send a http post request.
		 * @param url
		 * @param param
		 * @param successCallback
		 * @param failedCallback
		 * 
		 */
		public function httpPost(url:String, param:Object=null, successCallback:Function=null, failedCallback:Function=null):void
		{
			httpRequest(url, param, successCallback, failedCallback, URLRequestMethod.POST);
		}
		
		/**
		 * Send a http request.
		 * @param url
		 * @param data
		 * @param method
		 * 
		 */
		public function sendHttpRenquest(url:String, data:Object=null, method:String="get"):void
		{
			// 定义一个urlRequest
			var urlRequset:URLRequest = new URLRequest();
			urlRequset.url = url;
			urlRequset.data = data;
			urlRequset.method = method;
			
			// 使用urlLoader来发送
			urlLoader.load(urlRequset);
		}
		
		//
		// ---- Private Utils Functions
		//
		
		private function httpRequest(url:String, param:Object=null, successCallback:Function=null, failedCallback:Function=null, type:String="get"):void
		{
			var completeOnce:Function = function(e:Event):void{
				e.target.removeEventListener(Event.COMPLETE, completeOnce);
				if (null != successCallback){
					successCallback(urlLoader.data);
				}
			};
			var ioErrorOnce:Function = function(e:IOErrorEvent):void{
				e.target.removeEventListener(Event.COMPLETE, ioErrorOnce);
				if (null != failedCallback){
					failedCallback(e.text);
				}
			};
			var secErrorOnce:Function = function(e:SecurityErrorEvent):void{
				e.target.removeEventListener(Event.COMPLETE, secErrorOnce);
				if (null != failedCallback){
					failedCallback(e.text);
				}
			};
			urlLoader.addEventListener(Event.COMPLETE, completeOnce);
			urlLoader.addEventListener(IOErrorEvent.IO_ERROR, ioErrorOnce);
			urlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, secErrorOnce);
			sendHttpRenquest(url, param, type);		
		}
		
		/**
		 * handle complete events.
		 * @private
		 * */
		protected function onComptete(e:Event):void
		{
			dispatchEvent(new HttpsEvent("requestRecieved", urlLoader.data));
		}
		
		/**
		 * handle error events.
		 * @private
		 * */
		protected function onError(e:Event):void
		{
			if (e is SecurityErrorEvent)
			{
				dispatchEvent(new HttpsEvent("sendError", {"message":(e as SecurityErrorEvent).text}));
			} 
			else
			{
				dispatchEvent(new HttpsEvent("sendError", {"message":(e as IOErrorEvent).text}));
			}
		}
	}
}