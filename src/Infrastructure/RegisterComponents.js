export function registerComponent({
  name,
  folder,
  module: moduleFilename,
  template: templateFilename,
}) {
  if (ko.components.isRegistered(name)) {
    return;
  }
  ko.components.register(name, {
    template: {
      fromPath: `/components/${folder}/${templateFilename}.html`,
    },
    viewModel: {
      viaLoader: `/components/${folder}/${moduleFilename}.js`,
    },
  });
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
