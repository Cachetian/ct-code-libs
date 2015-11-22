package templates.ifunction
{
	import core.utils.ErrorHandler;
	import core.utils.LogUtil;
	
	import flash.desktop.NativeProcess;
	import flash.desktop.NativeProcessStartupInfo;
	import flash.events.IOErrorEvent;
	import flash.events.NativeProcessExitEvent;
	import flash.events.ProgressEvent;
	import flash.filesystem.File;
	
	import mx.controls.Alert;
	import mx.logging.ILogger;
	import mx.logging.Log;

	/**
	 * @author tianmu
	 *			Sep 11, 2014
	 */
	public class CmdFunction
	{
		private static var log:ILogger = Log.getLogger(LogUtil.getCategory(CmdFunction));
		
		public function CmdFunction()
		{
		}
		
		private var _process:NativeProcess;

		/**
		 * cmd.exe
		 */
		public function get process():NativeProcess
		{
			return _process;
		}

		/**
		 * @private
		 */
		public function set process(value:NativeProcess):void
		{
			_process = value;
		}
		
		public function call():void
		{
			
		}
		
		/**
		 * 执行批处理.bat文件
		 * @param batFilePath 批处理文件路径，需要传入绝对路径，如果传入相对路径，
		 * 则会相对于ZJAppService路径
		 * 路劲 batFilePath 可以这么写
		 * 绝对路径：
		 * 	"C:\\Users\\xuzhimin\\Desktop\\test.bat" 或者 "C:/Users/xuzhimin/Desktop/test.bat");
		 *相对路径：
		 * 	"fscommand/test.bat"
		 */
		protected function executeBat(batFilePath:String):void
		{
			log.info("executeBat(<{0}>)", batFilePath);
			try
			{
				var cmdFile:File=new File();  
				cmdFile = cmdFile.resolvePath("C:/WINDOWS/system32/cmd.exe"); 
				
				var npsinfo:NativeProcessStartupInfo = new NativeProcessStartupInfo();  
				npsinfo.executable = cmdFile;
				
				var processArgs:Vector.<String> = new Vector.<String>();
				var realBatFilePath:String = File.applicationDirectory.resolvePath(batFilePath).nativePath;
				processArgs[0] = "/c ";
				processArgs[1] = realBatFilePath;
				npsinfo.arguments=processArgs; 
				
				process = new NativeProcess();  
				process.addEventListener(ProgressEvent.STANDARD_OUTPUT_DATA, onOutputData);
				process.addEventListener(ProgressEvent.STANDARD_ERROR_DATA, onErrorData);
				process.addEventListener(NativeProcessExitEvent.EXIT, onExit);
				process.addEventListener(IOErrorEvent.STANDARD_OUTPUT_IO_ERROR, onIOError);
				process.addEventListener(IOErrorEvent.STANDARD_ERROR_IO_ERROR, onIOError);
				process.start(npsinfo);
			}
			catch (error:Error)
			{
				ErrorHandler.printErrorHandler(log, error, "executeBat");
			}
		}
		
		protected function onOutputData(event:ProgressEvent):void
		{
			var outputStr:String = event.target.standardOutput.readMultiByte(
				event.target.standardOutput.bytesAvailable, "gbk");
			outputStr = outputStr.split("\r").join("");// replace all '\r'
			var lines:Array = outputStr.split('\n');
			for each (var line:String in lines) 
			{	
				log.debug("Cmd Line -> {0}", line);
				foreachCmdLine(line);
			}
		}
		
		protected function foreachCmdLine(cmdLine:String):void
		{
			
		}
		
		protected function onErrorData(event:ProgressEvent):void
		{
			var outputStr:String = event.target.standardError.readMultiByte(event.target.standardError.bytesAvailable, "gbk");
			log.warn("STANDARD_OUTPUT_IO_ERROR <{0}>", outputStr);
			event.target.standardInput.writeMultiByte("echo %errorlevel%\n", "gbk");
		}
		
		protected function onExit(event:NativeProcessExitEvent):void
		{
			log.debug("Cmd Process exited with ", event.exitCode);
			Alert.show("执行成功！，返回码：[" + event.exitCode + "]");
		}
		
		protected function onIOError(event:IOErrorEvent):void
		{
			log.error("STANDARD_ERROR_IO_ERROR <0>", event.toString());
			Alert.show("执行错误！，错误码：[" + event.toString() + "]");
		}
	}
}