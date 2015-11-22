package core.utils
{
	import mx.logging.ILogger;

	/**
	 * ErrorHandler用于进行统一的错误处理。
	 * @author tianmu
	 * 		2013-07-18
	 */	
	public class ErrorHandler
	{
		/**
		 * 打印方式错误处理。
		 * @param logger
		 * @param error
		 * @param funcname
		 * 
		 */
		public static function printErrorHandler(logger:ILogger, error:Error, funcname:String=null):void
		{
			if (null == logger || null == error)
			{
				return;
			}
			
			if (null != funcname && "" != funcname)
			{
				logger.error("函数<{0}>中发生错误！", funcname);
			}
			
			logger.error(error.getStackTrace());
		}
		
		public function ErrorHandler()
		{
		}
	}
}