$( document ).ready(function() {
  $(".more").click( function (e) {
    e.preventDefault();
    d = $(this).data("more");
    // TODO: add item to history to support back button?
    if (d) {
      id = "#" + d;
      $("body").scrollTo(id, 500, {easing:'easeOutCubic',offset: {top:-20}});
    }
  }
  );
});
