package com.cachetian.tools.prototypes.dependency;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class App {

	Map<String, Dep> repo = null;

	public Map<String, Dep> getRepo() {
		return repo;
	}

	public void setRepo(Map<String, Dep> repo) {
		this.repo = repo;
	}

	public static void main(String[] args) {

		App ctx = new App();

		// test data
		final Dep car = new Dep();
		car.setCode("car");
		car.setId("001");
		car.setName("car dep");
		car.setDepCodes(new ArrayList<String>());
		car.getDepCodes().add("elements.engine");
		car.getDepCodes().add("elements.wheel");

		final Dep engine = new Dep();
		engine.setCode("elements.engine");
		engine.setId("004");
		engine.setName("engine of car dep");

		final Dep wheel = new Dep();
		wheel.setCode("elements.wheel");
		wheel.setId("002");
		wheel.setName("wheel dep");
		wheel.setDepCodes(new ArrayList<String>());
		wheel.getDepCodes().add("elements.tyre");

		final Dep tyre = new Dep();
		tyre.setCode("elements.tyre");
		tyre.setId("003");
		tyre.setName("tyre of wheel dep");

		final Map<String, Dep> repo = new HashMap<String, Dep>();
		repo.put(car.getCode(), car);
		repo.put(engine.getCode(), engine);
		repo.put(wheel.getCode(), wheel);
		repo.put(tyre.getCode(), tyre);

		ctx.setRepo(repo);

		// do test

		// build car
		Arti carArti = ctx.buildArti("car");
		carArti.print();
	}

	Arti buildArti(String depCode) {
		Dep dep = getRepo().get(depCode);
		Arti arti = new Arti();
		arti.setDep(dep);
		arti.setChildren(new ArrayList<Arti>());
		List<String> depCodes = dep.getDepCodes();
		if (depCodes != null) {
			// get deps
			for (String item : depCodes) {
				Arti element = buildArti(item);
				arti.getChildren().add(element);
				element.setParent(arti);
			}
		}
		return arti;
	}
}
