package com.cachetian.tools.mapdb.api;

/**
 * Map Database
 * 
 * @author ct
 *
 */
public interface Mapdb {
	/**
	 * @param key key of data
	 * @return
	 */
	String getValue(String key);

	/**
	 * @param key key of data
	 * @param value value of data
	 */
	void setValue(String key, String value);
}
