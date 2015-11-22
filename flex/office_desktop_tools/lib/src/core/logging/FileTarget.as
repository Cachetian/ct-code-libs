////////////////////////////////////////////////////////////////////////////////
//
//  深圳紫金支点技术股份有限公司
//  Copyright 2010-2013 深圳紫金支点技术股份有限公司
//  All Rights Reserved.
//
////////////////////////////////////////////////////////////////////////////////
package core.logging
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	import mx.core.mx_internal;
	
	use namespace mx_internal;
	
	/**
	 * An Adobe AIR only class that provides a log target for the Flex logging
	 * framework, that logs files to a file on the user's system.
	 * 
	 * This class will only work when running within Adobe AIR>
	 */
	public class FileTarget extends LineFormattedTarget
	{
		//--------------------------------------------------------------------------
		//
		//  Const
		//
		//--------------------------------------------------------------------------
		
		// 默认日志路径
		private const DEFAULT_LOG_FILE_NAME:String = "log.log";
		
		//--------------------------------------------------------------------------
		//
		//  Constructor
		//
		//--------------------------------------------------------------------------
		/**
		 * 
		 * @param logFile target log file
		 * 
		 */
		public function FileTarget(logFile:File = null)
		{
			if(logFile != null)
			{
				this.logFile = logFile;
			}
			else
			{
				this.logFile = new File(File.applicationStorageDirectory.nativePath + File.separator + DEFAULT_LOG_FILE_NAME);
			}
			
			this.logFs = new FileStream();
		}
		
		//--------------------------------------------------------------------------
		//
		//  Properties
		//
		//--------------------------------------------------------------------------
		
		// Target log file.
		protected var logFile:File;
		
		// FileStream of target log file.
		protected var logFs:FileStream;
		
		
		public function get logURI():String
		{
			return logFile.url;
		}
		
		public function clear():void
		{
			var fs:FileStream = new FileStream();
			fs.open(logFile, FileMode.WRITE);
			fs.writeUTFBytes("");
			fs.close();			
		}
		
		mx_internal override function internalLog(message:String):void
		{
			write(message);
		}		
		
		protected function write(msg:String):void
		{
			// 记录文件日志
			if (logFile != null && !logFile.isDirectory)
			{
				logFs.open(logFile, FileMode.APPEND);
				logFs.writeUTFBytes(msg + File.lineEnding);
				logFs.close();
			}
		}	
	}
}