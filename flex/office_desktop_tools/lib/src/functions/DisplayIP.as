package functions
{
	import core.utils.LogUtil;
	
	import flash.net.InterfaceAddress;
	import flash.net.NetworkInfo;
	import flash.net.NetworkInterface;
	
	import mx.controls.Alert;
	import mx.logging.ILogger;
	import mx.logging.Log;

	/**
	 * @author tianmu
	 *			Sep 16, 2014
	 */
	public class DisplayIP
	{
		private static var log:ILogger = Log.getLogger(LogUtil.getCategory(DisplayIP));
		
		public function DisplayIP()
		{
		}
		
		public function call():void
		{
			var networkInfo:NetworkInfo = NetworkInfo.networkInfo; 
			var interfaces:Vector.<NetworkInterface> = networkInfo.findInterfaces(); 
			
			if( interfaces != null ) 
			{ 
				var result:String = "";
				log.info( "Interface count: " + interfaces.length ); 
				for each ( var interfaceObj:NetworkInterface in interfaces ) 
				{ 
					log.info( "\nname: "             + interfaceObj.name ); 
					log.info( "display name: "     + interfaceObj.displayName ); 
					log.info( "mtu: "                 + interfaceObj.mtu ); 
					log.info( "active?: "             + interfaceObj.active ); 
					log.info( "parent interface: " + interfaceObj.parent ); 
					log.info( "hardware address: " + interfaceObj.hardwareAddress ); 
					if( interfaceObj.subInterfaces != null ) 
					{ 
						log.info( "# subinterfaces: " + interfaceObj.subInterfaces.length ); 
					} 
					log.info("# addresses: "     + interfaceObj.addresses.length ); 
					
					for each ( var address:InterfaceAddress in interfaceObj.addresses ) 
					{ 
						log.info( "  type: "           + address.ipVersion ); 
						log.info( "  address: "         + address.address ); 
						log.info( "  broadcast: "         + address.broadcast ); 
						log.info( "  prefix length: "     + address.prefixLength ); 
						result += "type:[" + address.ipVersion + "], address:[ " + address.address + " ]\n";
					} 
				}   
				Alert.show(result);
			}
		}
	}
}