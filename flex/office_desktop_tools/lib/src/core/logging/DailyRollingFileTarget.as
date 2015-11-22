////////////////////////////////////////////////////////////////////////////////
//
//  深圳紫金支点技术股份有限公司
//  Copyright 2010-2013 深圳紫金支点技术股份有限公司
//  All Rights Reserved.
//
////////////////////////////////////////////////////////////////////////////////
package core.logging
{
	import core.zip.ZipEntry;
	import core.zip.ZipOutput;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.utils.ByteArray;
	
	import mx.collections.ArrayCollection;
	import mx.core.mx_internal;
	
	use namespace mx_internal;
	
	/**
	 * 按天备份分片文件日志Target。
	 * @author tianmu
	 * 	2013-07-03
	 */
	public class DailyRollingFileTarget extends RollingFileTarget
	{
		//--------------------------------------------------------------------------
		//
		//  Constructor
		//
		//--------------------------------------------------------------------------
		
		/**
		 * 日期分片文件日志Target
		 * @param logFile 记录日志的文件
		 * 
		 */
		public function DailyRollingFileTarget(filePrefix:String="tools")
		{
			super(filePrefix);
		}
		
		//--------------------------------------------------------------------------
		//
		//  Properties
		//
		//--------------------------------------------------------------------------
		
		//--------------------------------------------------------------------------
		//
		//  Functions
		//
		//--------------------------------------------------------------------------
		
		override protected function write(msg:String):void
		{
			// 按每天备份
			
			// 获取当天日期
			var nowDate:Date = new Date();
			var nowDateStr:String = _df.format(nowDate);
			
			// 判断是否应该备份日志
			if (_dateStr != nowDateStr)
			{
				fileBackup();
				_dateStr = nowDateStr;
			}
			
			super.write(msg);
		}
		
		/**
		 *  @private
		 */
		private function fileBackup():void
		{
			// 压缩备份文件列表添加到压缩包
			try
			{
				var srcDir:File = new File(logSlicedFileDir);
				var destDir:File = new File(logBackupFileDir);
				
				// 备份目录是否存在
				if (!destDir.exists)
				{
					destDir.createDirectory();
				}
				
				// 目录是否创建成功
				if(!destDir.exists)
				{
					return;
				}
				
				// 搜集备份文件列表
				var backupFileAc:ArrayCollection = new ArrayCollection(srcDir.getDirectoryListing());
				backupFileAc.filterFunction = function(item:Object):Boolean
				{
					return -1 != item.name.search(logBackupFileNameRegex);
				};
				backupFileAc.refresh();
				
				// 备份文件列表是否为空
				if (0 == backupFileAc.length)
				{
					return;
				}
			
				// 生成压缩数据
				var zipOut:ZipOutput = new ZipOutput();
				for (var i:int = 0; i < backupFileAc.length; i++)
				{
					var toZipFile:File = backupFileAc.getItemAt(i) as File;
					var fileStream:FileStream = new FileStream();
					var buffer:ByteArray = new ByteArray();
					fileStream.open(toZipFile, FileMode.READ);
					fileStream.readBytes(buffer);
					fileStream.close();
					var ze:ZipEntry = new ZipEntry(toZipFile.name);
					zipOut.putNextEntry(ze);
					zipOut.write(buffer);
				}
				zipOut.closeEntry();
				zipOut.finish();
				
				// 保存到压缩文件
				var backupZipFile:File = new File(destDir.nativePath + File.separator + this._filePrefix +'_' + _dateStr + '.zip');
				var writer:FileStream = new FileStream();
				writer.open(backupZipFile, FileMode.WRITE);
				writer.writeBytes(zipOut.byteArray);
				writer.close();
				
				// 删除备份文件
				for (var j:int = 0; j < backupFileAc.length; j++)
				{
					var toDelfile:File = backupFileAc.getItemAt(j) as File;
					toDelfile.deleteFile();
				}
			}
			catch(error:Error) 
			{
				trace('[LOG\t\t] 备份日志发生错误！');
				trace(error.getStackTrace());
			}
		}
	}
}