package functions
{
	import core.utils.FileUtil;
	import core.utils.LogUtil;
	
	import flash.events.Event;
	import flash.net.FileReference;
	
	import mx.logging.ILogger;
	import mx.logging.Log;

	/**
	 * @author tianmu
	 *			Sep 15, 2014
	 */
	public class SVNLogToModifyRecord
	{
		private static var log:ILogger = Log.getLogger(LogUtil.getCategory(SVNLogToModifyRecord));
		
		public function SVNLogToModifyRecord()
		{
		}
		
		public function call():void
		{
			var contentStr:String = FileUtil.readFileToString('new1.txt');
			/*var fileRef:FileReference = new FileReference();
			fileRef.browse();
			fileRef.addEventListener(Event.SELECT, onFileSelect);*/
			var data:String = getMessageProcess(contentStr);
			FileUtil.writeStringToFile("modifyRecord.txt", data);
		}
		
		protected function onFileSelect(e:Event):void
		{
			log.info("onFileSelect");
			var fname:String = e.target.name;
			fname = 'new1.txt';
			log.info("file name is:[{0}]", fname);
			var contentStr:String = FileUtil.readFileToString(fname);
		}
		
		protected function getMessageProcess(contentData:String):String
		{
			var lines:Array = contentData.split(/\n|\r/);
			var blockStart:Boolean = false;
			var blockEnd:Boolean = true;
			var records:Array = [];
			var linesMap:Object = {};
			for each (var line:String in lines) 
			{
				// 去掉注释和空行
				if ((line as String).charAt(0) == '#' || (line as String).charAt(0) == "")
				{
					continue;
				}
				
				if ((0 == line.indexOf("Message:")) && blockEnd)
				{
					blockStart = true;
					blockEnd = false;
					continue;
				}
				
				if (blockStart && (0 == line.indexOf("----")))
				{
					blockEnd = true;
					blockStart = false;
					continue;
				}
					
				if (blockStart && !blockEnd)
				{
					var fline:String = seqFilter(line);

					// 重复项
					if (null == fline || linesMap[fline] == true)
					{
						continue;
					}
					records.push(fline);
					linesMap[fline] = true;
				}
			}
			return records.join("\n");
		}
		
		private static var reg_dot:RegExp = /^\d+\.[\S\s]*$/;
		private static var reg_1:RegExp = /^\d[\S\s]*$/;
		private static var reg_11:RegExp = /^\d\d[\S\s]*$/;
		
		protected function seqFilter(line:String):String
		{
			if (0 == line.search(reg_dot))
			{
				var idx:int = line.indexOf(".");
				return line.substr(idx + 1);
			}
			else if (0 == line.search(reg_1))
			{
				return line.substr(1);
			}
			else if (0 == line.search(reg_1))
			{
				return line.substr(2);
			}
			return null;
		}
		
	}
}