package functions
{
	import components.Browser;
	
	import spark.components.Window;
	
	/**
	 * @author tianmu
	 *			Sep 12, 2014
	 */
	public class AutoLogonZijinOnlineOffice
	{
		public function AutoLogonZijinOnlineOffice()
		{
		}
		
		public function call():void
		{
			var win:Window = new Browser();
			win.open();
		}
	}
}