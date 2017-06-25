package functions
{
	import core.utils.LogUtil;
	
	import flash.events.IOErrorEvent;
	import flash.events.NativeProcessExitEvent;
	
	import mx.controls.Alert;
	import mx.logging.ILogger;
	import mx.logging.Log;
	import templates.ifunction.CmdFunction;

	/**
	 * @author tianmu
	 *			Aug 29, 2014
	 */
	public class DelXfer extends CmdFunction
	{
		private static var log:ILogger = Log.getLogger(LogUtil.getCategory(DelXfer));
		
		public function DelXfer()
		{
		}
		
		private var count:Number = 0;
		private var begin:Boolean = false;
		
		override public function call():void
		{
			count = 0;
			begin = false;
			executeBat("C:\\Users\\tianmu\\Desktop\\常用文件\\delxfer.bat");
		}
		
		override protected function foreachCmdLine(cmdLine:String):void
		{
			if (cmdLine.indexOf("是否确认(Y/N)?") != -1)
			{
				process.standardInput.writeMultiByte("Y\n", "gbk");
				begin = true;
			}
			if (begin)
			{
				count++;
			}
		}
		
		override protected function onIOError(event:IOErrorEvent):void
		{
			log.error("STANDARD_ERROR_IO_ERROR <0>", event.toString());
			Alert.show("清理失败！，错误码：[" + event.toString() + "]");
			begin = false;
			count = 0;
		}
		
		override protected function onExit(event:NativeProcessExitEvent):void
		{
			log.debug("Cmd Process exited with ", event.exitCode);
			Alert.show("清理完成！已清理[" + (count-3) + "]个文件，返回码：[" + event.exitCode + "]");
			begin = false;
			count = 0;
		}
	}
}