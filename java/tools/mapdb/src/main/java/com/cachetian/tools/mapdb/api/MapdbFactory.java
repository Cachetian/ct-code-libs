package com.cachetian.tools.mapdb.api;

import com.cachetian.tools.mapdb.MapDatabase;

public class MapdbFactory {
	private MapdbFactory() {

	}

	private static final MapdbFactory inst = new MapdbFactory();

	public static MapdbFactory getInstance() {
		return inst;
	}

	/**
	 * get Map Database instance
	 * 
	 * @return
	 */
	public Mapdb getDB() {
		return MapDatabase.getInstance();
	}
}
