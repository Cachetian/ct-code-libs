package model
{
	/**
	 * @author tianmu
	 *			Sep 10, 2014
	 */
	public class ButtonDataModel
	{
		public function ButtonDataModel()
		{
		}
		
		private var _id:String;

		/**
		 * 
		 */
		public function get id():String
		{
			return _id;
		}

		/**
		 * @private
		 */
		public function set id(value:String):void
		{
			_id = value;
		}

		
		private var _label:String;

		/**
		 * 
		 */
		public function get label():String
		{
			return _label;
		}

		/**
		 * @private
		 */
		public function set label(value:String):void
		{
			_label = value;
		}

		
		private var _ifunction:String;

		/**
		 * 
		 */
		public function get ifunction():String
		{
			return _ifunction;
		}

		/**
		 * @private
		 */
		public function set ifunction(value:String):void
		{
			_ifunction = value;
		}

	}
}