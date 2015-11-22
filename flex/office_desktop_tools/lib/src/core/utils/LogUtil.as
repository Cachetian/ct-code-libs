package core.utils
{
	import flash.utils.getQualifiedClassName;
	
	/**
	 * @author tianmu
	 *			Jul 23, 2012
	 */
	public class LogUtil
	{
		public function LogUtil()
		{
		}
		
		public static function getCategory(classobject:*):String
		{
			var _className:String = flash.utils.getQualifiedClassName(classobject);
			var _category:String = _className.replace('::','.');
			return _category;
		}
	}
}