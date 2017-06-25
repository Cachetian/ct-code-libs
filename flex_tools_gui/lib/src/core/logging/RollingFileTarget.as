////////////////////////////////////////////////////////////////////////////////
//
//  深圳紫金支点技术股份有限公司
//  Copyright 2010-2013 深圳紫金支点技术股份有限公司
//  All Rights Reserved.
//
////////////////////////////////////////////////////////////////////////////////
/*
* 文件名称：RollingFileTarger.as
* 文件作者：tianmu
* 文件描述：分片文件日志Target
* 创建日期：2013-08-22
* 最后修改日期：2013-12-06
* 版本号：1.0.1
* 修改记录：
* 1.0.1 2013-12-06 tianmu
*	1.修改分片文件名日期格式为：yyyyMMdd
*	2.修改日期格式正则表达式中'\d'为'\\d'
*/
package core.logging
{
	import flash.filesystem.File;
	
	import spark.formatters.DateTimeFormatter;
	
	/**
	 * 分片文件日志Target，按照指定（默认5MB）分片大小记录日志文件，分片文件命名规则为：log_file_name_yyyyMMdd.log.number，例如：app_20130703.log.1
	 * @author tianmu
	 * 	2013-07-03
	 */
	public class RollingFileTarget extends FileTarget
	{
		//--------------------------------------------------------------------------
		//
		//  Constructor
		//
		//--------------------------------------------------------------------------
		
		/**
		 * 分片文件日志Target
		 * @param logFile 记录日志的文件
		 * 
		 */
		public function RollingFileTarget(filePrefix:String="tools")
		{
			// 加载日志配置项
			logSlicedFileDir = "C:\\logs";
			logBackupFileDir = "C:\\logs\\backup";
			logMaxFileSize = 5 * 1024 * 1024 * 1024;
			// 默认前缀+下划线+8位日期数字格式
			logBackupFileNameRegex = new RegExp(filePrefix + '_\\d{8}.log.\\d', "i");
			
			var logFileTmp:File = null;
			if(filePrefix != null)
			{
				logFileTmp = new File(logSlicedFileDir + File.separator + filePrefix + '.log');
			}
			super(logFileTmp);
			this._filePrefix = filePrefix;
			this._df = new DateTimeFormatter();
			this._df.dateTimePattern = 'yyyyMMdd';
			if ( null == _dateStr || "" == _dateStr)
			{
				if (logFile.exists)
				{	
					_dateStr = _df.format(logFile.modificationDate);
				}
				else
				{
					_dateStr = _df.format(new Date());
				}
			}
		}
		
		//--------------------------------------------------------------------------
		//
		//  Properties
		//
		//--------------------------------------------------------------------------
		
		// 文件前缀
		protected var _filePrefix:String;
		
		// 日期formatter
		protected var _df:DateTimeFormatter;
		
		// 当天日期
		protected var _dateStr:String;
		
		// Limit file size. 文件分片大小 
		protected var logMaxFileSize:uint = 5242880;// 5MB
		
		// Backup file directory
		protected var logSlicedFileDir:String = File.applicationDirectory.nativePath + File.separator + 'logs' ;
		
		// Backup file directory
		protected var logBackupFileDir:String = File.applicationDirectory.nativePath + File.separator + 'logs' + File.separator + 'backup' ;
		
		// Backup file name regular expression
		protected var logBackupFileNameRegex:RegExp = null;
		
		//--------------------------------------------------------------------------
		//
		//  Functions
		//
		//--------------------------------------------------------------------------
		
		override protected function write(msg:String):void
		{
			// 按大小分片
			
			// 判断日志是否需要分片（超过MaxFileSize）
			if (logFile != null && !logFile.isDirectory && 
				logFile.exists && logFile.size >= logMaxFileSize)
			{
				// 创建文件分片
				fileSlice();
			}
			
			super.write(msg);
		}
		
		// 对比文件分片数nums，和最大文件分片文件名max_index
		// 如果nums > max_index 返回nums
		// 如果max_index > nums 返回max_index
		private function getSlicedFileNums(dir:File):int
		{
			if (dir == null || !dir.isDirectory || !dir.exists)
			{
				return 0;
			}
			
			try
			{
				var nums:int = 0;// 文件总数
				var lastFilename:String = null;// 最大索引文件名
				var fileArr:Array = dir.getDirectoryListing();// 目录下文件列表
				for (var i:int = 0; i < fileArr.length; i++) 
				{
					var file:File = fileArr[i];
					if (-1 != file.name.search(logBackupFileNameRegex))
					{
						nums ++;
						lastFilename = file.name;
					}
				}
				var lastDotIndex:int = lastFilename.lastIndexOf(".");
				var maxIndex:int = Number(lastFilename.substr(lastDotIndex + 1));
				return nums > maxIndex ? nums : maxIndex;
			} 
			catch(error:Error) 
			{
				trace('[LOG\t\t] 获取分片文件数量错误numsex=' + nums + '>,<lastFilename=' + lastFilename + '>');
				trace(error.getStackTrace());
			}
			return 0;
		}
		
		// 备份文件分片
		// 文件分片处理逻辑：
		// 从最大index分片开始+1，一直循环遍历到，带分片文件。
		// 注：分片从1开始
		private function fileSlice():void
		{
			try
			{
				// 保存原日志文件名
				var originLogFilePath:String = logFile.nativePath;
				
				// 获取文件个数
				var maxFileIndex:int = getSlicedFileNums(new File(logSlicedFileDir)) + 1;
				
				// 移动备份分片
				for (var i:int = maxFileIndex; i > 0; i--) 
				{
					var slicedFilePath:String = logSlicedFileDir +File.separator + _filePrefix + '_' + _dateStr + '.log.' + i;
					var slicedFile:File = new File(slicedFilePath);
					if (slicedFile.exists)
					{
						slicedFile.moveTo(new File(logSlicedFileDir +File.separator + _filePrefix + '_' + _dateStr + '.log.' + (i+1)), true);
					}
				}
				
				// 备份最新分片
				var firstSlicedFilePath:String = logSlicedFileDir + File.separator + _filePrefix + '_' + _dateStr + '.log.1';
				logFile.moveTo(new File(firstSlicedFilePath), true);
				
				// 创建日志文件
				logFile = new File(originLogFilePath);
			} 
			catch(error:Error) 
			{
				trace('[LOG\t\t] 日志分片发生错误！<maxFileIndex=' + maxFileIndex + '>');
				trace(error.getStackTrace());
			}
		}
	}
}

