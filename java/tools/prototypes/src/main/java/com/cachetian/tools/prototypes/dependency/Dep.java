package com.cachetian.tools.prototypes.dependency;

import java.util.List;

public class Dep {
	String id, code, name;
	List<String> depCodes;

	public List<String> getDepCodes() {
		return depCodes;
	}

	public void setDepCodes(List<String> depCodes) {
		this.depCodes = depCodes;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
