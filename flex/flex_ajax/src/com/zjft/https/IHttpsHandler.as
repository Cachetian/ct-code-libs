package com.zjft.https
{
	public interface IHttpsHandler
	{
		function Http_onSendError():void;
		
		function Http_onRecieveError():void;
		
		function Http_onRequestRecieved():void;
	}
}