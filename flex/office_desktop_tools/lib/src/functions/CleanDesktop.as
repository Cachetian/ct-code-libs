package functions
{
	import core.utils.LogUtil;
	
	import flash.events.NativeProcessExitEvent;
	import flash.events.ProgressEvent;
	
	import mx.controls.Alert;
	import mx.logging.ILogger;
	import mx.logging.Log;
	import templates.ifunction.CmdFunction;

	/**
	 * @author tianmu
	 *			Sep 11, 2014
	 */
	public class CleanDesktop extends CmdFunction
	{
		private static var log:ILogger = Log.getLogger(LogUtil.getCategory(CleanDesktop));
		
		public function CleanDesktop()
		{
			super();
		}
		
		private var count:Number = 0;
		
		override public function call():void
		{
			count = 0;
			executeBat("C:\\Users\\tianmu\\Desktop\\常用文件\\cleanDesktop.bat");
		}
		
		override protected function foreachCmdLine(cmdLine:String):void
		{
			if (cmdLine.indexOf("文件") == 0)
			{
				count++;
			}
		}
		
		override protected function onExit(event:NativeProcessExitEvent):void
		{
			log.debug("Cmd Process exited with ", event.exitCode);
			Alert.show("清理完成！已清理[" + (count) + "]个文件，返回码：[" + event.exitCode + "]");
			count = 0;
		}
	}
}