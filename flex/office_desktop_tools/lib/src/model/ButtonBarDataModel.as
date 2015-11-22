package model
{
	/**
	 * 
	 * @author tianmu
	 *			Aug 29, 2014
	 */
	public class ButtonBarDataModel
	{
		public function ButtonBarDataModel()
		{
		}
		
		private var _buttons:Array = new Array();

		public function get buttons():Array
		{
			return _buttons;
		}

		public function set buttons(value:Array):void
		{
			_buttons = value;
		}
	}
}