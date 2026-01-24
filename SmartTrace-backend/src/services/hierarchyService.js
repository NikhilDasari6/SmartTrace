// In-memory hierarchy (DB later)
const hierarchyMap = new Map();

// Configurable aggregation rules
const rules = {
  PRIMARY: { parent: "SECONDARY", max: 10 },
  SECONDARY: { parent: "TERTIARY", max: 50 }
};

exports.linkChildToParent = (child, childLevel, parent, parentLevel) => {
  if (rules[childLevel]?.parent !== parentLevel) {
    throw new Error("Invalid hierarchy mapping");
  }

  if (hierarchyMap.has(child)) {
    throw new Error("Child already linked to a parent");
  }

  const count = [...hierarchyMap.values()].filter(p => p === parent).length;
  if (count >= rules[childLevel].max) {
    throw new Error("Parent capacity exceeded");
  }

  hierarchyMap.set(child, parent);
  return { child, parent };
};

exports.getHierarchyPath = (serial) => {
  const path = [];
  let current = serial;

  while (hierarchyMap.has(current)) {
    const parent = hierarchyMap.get(current);
    path.push({ child: current, parent });
    current = parent;
  }

  return path;
};

