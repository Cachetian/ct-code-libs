package com.cachetian.tools.mapdb;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class MapDatabase {

	private MapDatabase() {

	}

	private static MapDatabase instance = new MapDatabase();

	public static MapDatabase getInstance() {
		return instance;
	}

	private static Map<String, String> data;

	@SuppressWarnings("unchecked")
	public void open() throws IOException, ClassNotFoundException {
		// open file
		File file = new File(System.getProperty("user.home") + File.separator + "tools.mapdatabase.dat");
		if (!file.exists()) {
			file.createNewFile();
		}
		
		if (file.length() == 0) {
			data = Collections.synchronizedMap(new HashMap<String, String>());
		} else {
			ObjectInput ois = new ObjectInputStream(new FileInputStream(file));
			data = (Map<String, String>) ois.readObject();
			ois.close();
		}
	}

	public void setValue(String key, String value) {
		if (null != data) {
			data.put(key, value);
		}
	}

	public String getValue(String key) {
		if (null == data) {
			return "";
		}
		return data.get(key);
	}

	public void save() throws IOException {
		if (null != data) {
			File file = new File(System.getProperty("user.home") + File.separator + "tools.mapdatabase.dat");
			ObjectOutput oop = new ObjectOutputStream(new FileOutputStream(file));
			oop.writeObject(data);
			oop.close();
		}
	}

	public void close() throws IOException {
		if (null != data) {
			File file = new File(System.getProperty("user.home") + File.separator + "tools.mapdatabase.dat");
			ObjectOutput oop = new ObjectOutputStream(new FileOutputStream(file));
			oop.writeObject(data);
			oop.close();
		}
		data = null;
	}
}
