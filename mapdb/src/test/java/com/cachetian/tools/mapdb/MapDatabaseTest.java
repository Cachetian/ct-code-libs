package com.cachetian.tools.mapdb;

import java.io.IOException;

import com.cachetian.tools.mapdb.api.MapdbFactory;

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
		
		MapDatabase.getInstance().open();
		String username = MapdbFactory.getInstance().getDB().getValue("com.cachetian.tools.mapdb.username");
		if (username == null || username.equals("")){
			MapdbFactory.getInstance().getDB().setValue("com.cachetian.tools.mapdb.username", "cachetian");
		}
		username = MapdbFactory.getInstance().getDB().getValue("com.cachetian.tools.mapdb.username");
		System.out.println(username);
		MapDatabase.getInstance().close();
		assertEquals("cachetian", username);
	}

	public void testWrite() throws ClassNotFoundException, IOException {
		MapDatabase.getInstance().open();
		MapDatabase.getInstance().setValue("com.cachetian.tools.mapdb.param1", "hello");
		MapDatabase.getInstance().close();
		assertTrue(true);
		
		MapdbFactory.getInstance().getDB().setValue("com.cachetian.tools.mapdb.username", "cachetian");
		assertTrue(true);
	}
}
