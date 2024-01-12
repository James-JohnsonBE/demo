export function registerComponent({
  name,
  folder,
  module = null,
  moduleFilename = null,
  template: templateFilename,
}) {
  if (ko.components.isRegistered(name)) {
    return;
  }
  if (moduleFilename || module) {
    ko.components.register(name, {
      template: {
        fromPath: `/components/${folder}/${templateFilename}.html`,
      },
      viewModel: module ?? {
        viaLoader: `/components/${folder}/${moduleFilename}.js`,
      },
    });
  } else {
    ko.components.register(name, {
      template: {
        fromPath: `/components/${folder}/${templateFilename}.html`,
      },
    });
  }
}

export function registerFieldComponent(name, components) {
  // register both our view and edit components

  Object.keys(components).map((view) => {
    const componentName = components[view];
    if (ko.components.isRegistered(componentName)) {
      return;
    }
    ko.components.register(componentName, {
      template: {
        fromPath: `/components/Fields/${name}/${name}${view}.html`,
      },
      viewModel: {
        viaLoader: `/components/Fields/${name}/${name}Module.js`,
      },
    });
  });
}
