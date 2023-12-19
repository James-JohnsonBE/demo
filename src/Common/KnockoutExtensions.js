ko.bindingHandlers.downloadLink = {
  update: function (
    element,
    valueAccessor,
    allBindings,
    viewModel,
    bindingContext
  ) {
    var path = valueAccessor();
    var replaced = path.replace(/:([A-Za-z_]+)/g, function (_, token) {
      return ko.unwrap(viewModel[token]);
    });
    element.href = replaced;
    //alert( replaced );
  },
};

ko.bindingHandlers.toggleClick = {
  init: function (element, valueAccessor, allBindings) {
    var value = valueAccessor();

    ko.utils.registerEventHandler(element, "click", function () {
      var classToToggle = allBindings.get("toggleClass");
      var classContainer = allBindings.get("classContainer");
      var containerType = allBindings.get("containerType");

      if (containerType && containerType == "sibling") {
        $(element)
          .nextUntil(classContainer)
          .each(function () {
            $(this).toggleClass(classToToggle);
          });
      } else if (containerType && containerType == "doc") {
        var curIcon = $(element).attr("src");
        if (curIcon == "/_layouts/images/minus.gif")
          $(element).attr("src", "/_layouts/images/plus.gif");
        else $(element).attr("src", "/_layouts/images/minus.gif");

        if ($(element).parent() && $(element).parent().parent()) {
          $(element)
            .parent()
            .parent()
            .nextUntil(classContainer)
            .each(function () {
              $(this).toggleClass(classToToggle);
            });
        }
      } else if (containerType && containerType == "any") {
        if ($("." + classToToggle).is(":visible"))
          $("." + classToToggle).hide();
        else $("." + classToToggle).show();
      } else $(element).find(classContainer).toggleClass(classToToggle);
    });
  },
};
