////////////////////////////////////////////////////////////////////////////////
//
//  深圳紫金支点技术股份有限公司
//  Copyright 2010-2013 深圳紫金支点技术股份有限公司
//  All Rights Reserved.
//
////////////////////////////////////////////////////////////////////////////////
package core.logging
{
	
	import mx.core.mx_internal;
	import mx.logging.AbstractTarget;
	import mx.logging.ILogger;
	import mx.logging.LogEvent;
	
	use namespace mx_internal;
	
	/**
	 *  All logger target implementations that have a formatted line style output
	 *  should extend this class.
	 *  It provides default behavior for including date, time, category, and level
	 *  within the output.
	 *
	 *  
	 *  @langversion 3.0
	 *  @playerversion Flash 9
	 *  @playerversion AIR 1.1
	 *  @productversion Flex 3
	 */
	public class LineFormattedTarget extends AbstractTarget
	{
		//--------------------------------------------------------------------------
		//
		//  Constructor
		//
		//--------------------------------------------------------------------------
		
		/**
		 *  Constructor.
		 *
		 *  <p>Constructs an instance of a logger target that will format
		 *  the message data on a single line.</p>
		 *  
		 *  @langversion 3.0
		 *  @playerversion Flash 9
		 *  @playerversion AIR 1.1
		 *  @productversion Flex 3
		 */
		public function LineFormattedTarget()
		{
			super();
			
			includeTime = false;
			includeDate = false;
			includeCategory = false;
			includeLevel = false;
		}
		
		//--------------------------------------------------------------------------
		//
		//  Properties
		//
		//--------------------------------------------------------------------------
		
		//----------------------------------
		//  fieldSeparator
		//----------------------------------
		
		[Inspectable(category="General", defaultValue=" ")]
		
		/**
		 *  The separator string to use between fields (the default is " ")
		 *  
		 *  @langversion 3.0
		 *  @playerversion Flash 9
		 *  @playerversion AIR 1.1
		 *  @productversion Flex 3
		 */
		public var fieldSeparator:String = " ";
		
		//----------------------------------
		//  includeCategory
		//----------------------------------
		
		[Inspectable(category="General", defaultValue="false")]
		
		/**
		 *  Indicates if the category for this target should added to the trace.
		 *  
		 *  @langversion 3.0
		 *  @playerversion Flash 9
		 *  @playerversion AIR 1.1
		 *  @productversion Flex 3
		 */
		public var includeCategory:Boolean;
		
		//----------------------------------
		//  includeDate
		//----------------------------------
		
		[Inspectable(category="General", defaultValue="false")]
		
		/**
		 *  Indicates if the date should be added to the trace.
		 *  
		 *  @langversion 3.0
		 *  @playerversion Flash 9
		 *  @playerversion AIR 1.1
		 *  @productversion Flex 3
		 */
		public var includeDate:Boolean;
		
		//----------------------------------
		//  includeLevel
		//----------------------------------
		
		[Inspectable(category="General", defaultValue="false")]
		
		/**
		 *  Indicates if the level for the event should added to the trace.
		 *  
		 *  @langversion 3.0
		 *  @playerversion Flash 9
		 *  @playerversion AIR 1.1
		 *  @productversion Flex 3
		 */
		public var includeLevel:Boolean;
		
		//----------------------------------
		//  includeTime
		//----------------------------------
		
		[Inspectable(category="General", defaultValue="false")]
		
		/**
		 *  Indicates if the time should be added to the trace.
		 *  
		 *  @langversion 3.0
		 *  @playerversion Flash 9
		 *  @playerversion AIR 1.1
		 *  @productversion Flex 3
		 */
		public var includeTime:Boolean;
		
		//--------------------------------------------------------------------------
		//
		//  Overridden methods
		//
		//--------------------------------------------------------------------------
		
		override public function logEvent(event:LogEvent):void
		{
			var date:String = ""
			if (includeDate || includeTime)
			{
				var d:Date = new Date();
				if (includeDate)
				{
					date = Number(d.getMonth() + 1).toString() + "/" +
						d.getDate().toString() + "/" + 
						d.getFullYear() + fieldSeparator;
				}   
				if (includeTime)
				{
					date += padTime(d.getHours()) + ":" +
						padTime(d.getMinutes()) + ":" +
						padTime(d.getSeconds()) + "." +
						padTime(d.getMilliseconds(), true) + fieldSeparator;
				}
			}
			
			var level:String = "";
			if (includeLevel)
			{
				level = "[" + fillWithBlankAtEnd(LogEvent.getLevelString(event.level)) +
					"]" + fieldSeparator;
			}
			
			var category:String = includeCategory ?
				formatCategory(ILogger(event.target).category) + fieldSeparator :
				"";
			
			internalLog(date + level + category + event.message);
		}
		
		// Level对齐
		private function fillWithBlankAtEnd(input:String, len:int=5):String
		{
			var inputTmp:String = input;
			
			if (inputTmp.length > len)
			{
				return inputTmp.substr(0, len);
			}
			
			for (var i:int = input.length; i < len; i++)
			{
				inputTmp += ' ';
			}
			return inputTmp;
		}
		
		/**
		 * 目录信息简化，规则如下：<br/>
		 * <ul>
		 * <li>
		 * 去掉"com.zjft.atmcloud"</li>
		 * <li>
		 * start with "runtime" -> "r"</li>
		 * <li>
		 * start with "plugin" -> "p"</li>
		 * <li>
		 * 目录名采用缩写，并保留类名</li>
		 * <li>
		 * 路径名分类[PLAT] [APP ] [LIB]</li>
		 * </ul>
		 * 
		 */
		private function formatCategory(category:String):String
		{
			if (null == category || "" == category)
			{
				return category;
			}
			
			var categoryTmp:String = category;
			var newCategory:String = null;
			var categoryItems:Array = categoryTmp.split('.');
			// [PLAT]
			if (isPlat(categoryTmp))
			{
				if ("runtime" == categoryItems[3])
				{
					newCategory = "[" + fillWithBlankAtEnd("PLAT", 5) + "]";
					return newCategory;
				}
				
				if ("plugins" == categoryItems[3])
				{
					var plName:String = categoryItems[4];
					newCategory = "[" + fillWithBlankAtEnd(plName.toUpperCase(), 5) + "]";
					return newCategory;
				}
				
				
			}
			// [APP ]
			else if (isApp(categoryTmp))
			{
				// 应用名
				var appName:String = categoryItems[1];
				newCategory = '[' + fillWithBlankAtEnd(appName.toUpperCase(), 5) + '] ';// Max_app_name lenght 12
				// ACTION or PAGE
				if ("actions" == categoryItems[3])
				{
					newCategory += fillWithBlankAtEnd("ACTION", 6);// 6 + space lenght 1
				}
				else
				{
					newCategory += fillWithBlankAtEnd("PAGE", 6);// 6 + space lenght 1
				}
				// 包缩写
				var appPacks:String = " ";
				if (categoryItems.length >= 5)
				{
					for (var i:int = 4; i < categoryItems.length; i++) 
					{
						appPacks += categoryItems[i].charAt(0).toUpperCase();// 6 + space lenght 1 += fillWithBlankAtEnd("ACTION", 7);// 6 + space lenght 1 += categoryItems[i].charAt(0).toUpperCase();
					}
				}
				newCategory += fillWithBlankAtEnd(appPacks, 3);
				newCategory += " " + categoryItems[categoryItems.length - 1];
				return newCategory;
			}
			// [LIB ]
			else
			{
				newCategory = "[" + fillWithBlankAtEnd("LIB", 5) + "]";
			}
			
			newCategory += " " + categoryItems[categoryItems.length - 1];
			return newCategory;
		}
		
		/**
		[PLAT]
		com.zjft.atmcloud.runtime.*.
		com.zjft.atmcloud.plugins.*.
		com.zjft.atmlcoud.core.*.
		*/
		private function isPlat(category:String):Boolean
		{
			if (0 == category.indexOf('com.zjft.atmcloud.runtime.'))
			{
				return true;
			}
			
			if (0 == category.indexOf('com.zjft.atmcloud.plugins.'))
			{
				return true;
			}
			
			if (0 == category.indexOf('com.zjft.atmcloud.core.'))
			{
				return true;
			}
			
			return false;
		}
		
		
		/**
		[APP ]
		格式：“app.*.”，示例：com.app_customer.selfapp.actions.Hostflow.SystemInit
		*/
		private function isApp(category:String):Boolean
		{
			if (0 == category.indexOf('app.'))
			{
				return true;
			}
			
			return false;
		}
		
		//--------------------------------------------------------------------------
		//
		//  Methods
		//
		//--------------------------------------------------------------------------
		
		/**
		 *  @private
		 */
		private function padTime(num:Number, millis:Boolean = false):String
		{
			if (millis)
			{
				if (num < 10)
					return "00" + num.toString();
				else if (num < 100)
					return "0" + num.toString();
				else 
					return num.toString();
			}
			else
			{
				return num > 9 ? num.toString() : "0" + num.toString();
			}
		}
		
		/**
		 *  Descendants of this class should override this method to direct the 
		 *  specified message to the desired output.
		 *
		 *  @param  message String containing preprocessed log message which may
		 *              include time, date, category, etc. based on property settings,
		 *              such as <code>includeDate</code>, <code>includeCategory</code>,
		 *          etc.
		 *  
		 *  @langversion 3.0
		 *  @playerversion Flash 9
		 *  @playerversion AIR 1.1
		 *  @productversion Flex 3
		 */
		mx_internal function internalLog(message:String):void
		{
			// override this method to perform the redirection to the desired output
		}
	}
}

