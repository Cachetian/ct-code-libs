////////////////////////////////////////////////////////////////////////////////
//
//  深圳资金支点技术股份有限公司
//  Copyright 2010-2013 深圳资金支点技术股份有限公司
//  All Rights Reserved.
//
////////////////////////////////////////////////////////////////////////////////
/*
* 文件名称：FileUtil.as
* 文件作者：tianmu
* 创建日期：2012-09-27
* 最后修改日期：2013-09-24
* 版本号：1.0.1
* 修改记录：
* 1.0.1 2013-09-24 tianmu
* 	1.增加获取文件编码格式接口
* 1.0.2 2013-09-24 zmxu
* 	1.修改获取文件编码格式接口
* 1.0.3 2013-10-15 zmxu
*   1.添加些XML文件接口
* 1.0.4 2013-10-29 zmxu
*	1.修改获取文件编码格式接口
*/

package core.utils
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.utils.ByteArray;
	
	public class FileUtil
	{
		/**
		 * 使用FileStream类加载本地XML文件<br/>
		 * @param filepath 文件路径
		 * @return 要加载的XML
		 * @throws Error
		 */
		public static function loadLocalXMLFile(filePath:String):XML
		{
			trace("loadXMLFile({0})", filePath);
			
			if (null == filePath || "" == filePath)
			{
				return null;
			}
			
			var tempFile:File = File.applicationDirectory.resolvePath(filePath);
			if (!tempFile.exists)
			{
				trace("loadXMLFile -->{0} not exist!", tempFile.nativePath);
				return null;
			}
			var ins:FileStream = new FileStream();
			try
			{
				trace("loadXMLFile -->{0} start load!", tempFile.nativePath);
				ins.open(tempFile, FileMode.READ);
				
				// 解析XML报文头
				var encodingPrefix:String = ins.readUTFBytes(2);
				var tempXml:XML;
				// 如果存在报文头
				if (encodingPrefix == "<?")
				{
					var readStr:String = encodingPrefix;
					while (readStr.substr(readStr.length - 2) != "?>" && ins.bytesAvailable > 0 )
					{
						readStr += ins.readUTFBytes(1);
					}
					// 判断encoding属性是否存在
					var find:int = readStr.search(" encoding=");
					var encoding:String = "UTF-8";
					if (find != -1)
					{
						var subStr:String = readStr.substr(find + 11);
						var len:int = subStr.search('"');
						encoding = subStr.substr(0, len);
					}
					tempXml = new XML(ins.readMultiByte(ins.bytesAvailable, encoding));
				}
				else
				{
					// 重新开始读取
					ins.position = 0;
					tempXml = new XML(ins.readUTFBytes(ins.bytesAvailable));
				}
				ins.close();
				trace("loadXMLFile -->{0} load complete!", tempFile.nativePath);
				return tempXml;
			}
			catch(e:Error)
			{
				trace("loadXMLFile -->{0} load error!", tempFile.nativePath);
				if (null != ins)
				{
					ins.close();
				}
				trace(e.message);
				trace(e.getStackTrace());
				throw e;
			}
			return null;
		}
		
		// modified by zmxu 2013-10-29 start 1.0.4
		// modified by zmxu 2013-09-24 start 1.0.2
		// added by tianmu 2013-09-24 start 1.0.1
		/**
		 * 注意：文件存在且能准确的判定为 UTF-8 编码时才返回UTF-8，其他情况均视为 GBK 编码。
		 * @param filepath 传入文件的路径
		 * @return 返回编码格式：<br/>
		 * 		utf-8 编码 - "utf-8"<br/>
		 * 		gbk编码 - "gbk"
		 *  判断文件编码类型
		 * windows下支持两种文字的字符集，一种是ANSI/ANSII，另一种是Unicode。
		 * 对于Unicode，windows支持它的三种编码格式，
		 * 一种是小端Unicode，一种是大端BigEndianUnicode，一种是UTF-8
		 * 编码规则
		 * ANSI：无格式定义
		 * Unicode 即 UTF-16：清零个字节为 FF FE
		 * Unicode big endian 即 UTF-16 big endian：前两个字节为 FE FF
		 * UTF-8：前两个字节 EF BB
		 */
		public static function getFileEncoding(filepath:String):String
		{
			var file:File = new File(File.applicationDirectory.resolvePath(filepath).nativePath);
			var encoding:String = "gbk";
			try
			{
				if (file.exists)
				{
					// 读取文件前2个字节
					var fs:FileStream = new FileStream();
					fs.open(file, FileMode.READ);
					if (fs.bytesAvailable >= 2)
					{
						var firstTwoByteArr:ByteArray = new ByteArray();
						firstTwoByteArr.writeByte(fs.readByte());
						firstTwoByteArr.writeByte(fs.readByte());
						if (firstTwoByteArr[0] == 0xEF && firstTwoByteArr[1] == 0xBB) // 因为我们用到的只有两种格式
						{
							encoding = "utf-8";
						}
					}
					fs.close();
				}
			} 
			catch(error:Error) 
			{
				trace("getFileEncoding --> 读取文件失败");
			}
			return encoding;
		}
		// added by tianmu 2013-09-24 end 1.0.1
		// modified by zmxu 2013-09-24 end 1.0.2
		// modified by zmxu 2013-10-29 end 1.0.4
		
		
		// added by zmxu 2013-10-15 start 1.0.3
		/**
		 * 将字符串写回文件：字符串要符合XML格式，内容包含XML文件头时我们直接写入内容，不包含XML文件头时我们先为你添加，然后再写入内容。<br/>
		 * 编码格式默认为utf-8，可以选择的有utf-8和gbk两种，不区分大小写。
		 */
		public static function writeContentToXMLFile(xmlFilePathAndName:String, content:String, encoding:String = null):Boolean
		{
			if (xmlFilePathAndName == null || xmlFilePathAndName == "" || content == null)
			{
				trace ("参数错误");
				return false;
			}
			
			encoding = encoding.toLocaleLowerCase();
			if (encoding == null || encoding == "" || encoding != "gbk")
			{
				encoding = "utf-8";
			}
			if (content.indexOf("<?xml ") == -1) // 没有xml头  // 其实xml需要很多合法性的判断，这里简约为一个
			{
				content = "<?xml version=\"1.0\"?>\r\n" + content;
			}
			try
			{
				var file:File = new File(File.applicationDirectory.resolvePath(xmlFilePathAndName).nativePath);
				var os:FileStream = new FileStream();
				os.open(file, FileMode.WRITE);
				os.writeMultiByte(content, encoding);
				os.close();
			}
			catch (error:Error)
			{
				trace("writeContentToXMLFile --> 失败");
				return false;
			}
			return true;
		}
		// added by zmxu 2013-10-15 end 1.0.3
		
		public static function readFileToString(filepath:String, encoding:String="utf-8"):String
		{
			if (filepath == null || filepath == "")
			{
				trace ("参数错误");
				return null;
			}
			
			var readContent:String = null;
			try
			{
				var file:File = new File(File.applicationDirectory.resolvePath(filepath).nativePath);
				var os:FileStream = new FileStream();
				os.open(file, FileMode.READ);
				readContent = os.readMultiByte(os.bytesAvailable, encoding)
				os.close();
			}
			catch (error:Error)
			{
				trace("readFileToString --> 读取文件失败");
			}
			return readContent;
		}
		
		public static function writeStringToFile(filepath:String, data:String, encoding:String="utf-8"):Boolean
		{
			if (filepath == null || filepath == "" || data == null)
			{
				trace ("参数错误");
				return false;
			}
			
			try
			{
				var file:File = new File(File.applicationDirectory.resolvePath(filepath).nativePath);
				var os:FileStream = new FileStream();
				os.open(file, FileMode.WRITE);
				os.writeMultiByte(data, encoding);
				os.close();
			}
			catch (error:Error)
			{
				trace("writeStringToFile --> 失败");
				return false;
			}
			return true;
		}
		
		public function FileUtil()
		{
		}
	}
}