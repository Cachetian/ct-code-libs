package com.cachetian.tools.prototypes.dependency;

import java.util.List;

public class Arti {
	Dep dep;

	public Dep getDep() {
		return dep;
	}

	public void setDep(Dep dep) {
		this.dep = dep;
	}

	List<Arti> children;

	public List<Arti> getChildren() {
		return children;
	}

	public void setChildren(List<Arti> children) {
		this.children = children;
	}

	public Arti getParent() {
		return parent;
	}

	public void setParent(Arti parent) {
		this.parent = parent;
	}

	Arti parent;

	public void print() {
		if (getDep() != null) {
			System.out.println("code:" + getDep().getCode());
		}

		for (Arti arti : children) {
			arti.print();
		}
	}
}
