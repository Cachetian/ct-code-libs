package com.cachetian.tools.mapdb;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class MapDatabaseTest extends TestCase {
	/**
	 * Create the test case
	 *
	 * @param testName
	 *            name of the test case
	 */
	public MapDatabaseTest(String testName) {
		super(testName);
	}

	/**
	 * @return the suite of tests being tested
	 */
	public static Test suite() {
		return new TestSuite(MapDatabaseTest.class);
	}

	public void testRead() throws ClassNotFoundException, IOException {
		MapDatabase.getInstance().open();
		MapDatabase.getInstance().setValue("com.cachetian.tools.mapdb.param1", "hello");
		String value = MapDatabase.getInstance().getValue("com.cachetian.tools.mapdb.param1");
		MapDatabase.getInstance().close();
		assertEquals("hello", value);
	}

	public void testWrite() throws ClassNotFoundException, IOException {
		MapDatabase.getInstance().open();
		MapDatabase.getInstance().setValue("com.cachetian.tools.mapdb.param1", "hello");
		MapDatabase.getInstance().close();
		assertTrue(true);
	}
}
