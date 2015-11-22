package com.zjft.https
{
	import flash.events.Event;
	
	public class HttpsEvent extends Event
	{
		public function HttpsEvent(type:String, data:Object=null, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(type, bubbles, cancelable);
		}
		
		private var data:Object;
	}
}