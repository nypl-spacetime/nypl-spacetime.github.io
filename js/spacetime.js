var SP = {}; // the animation code

(function(){
  var main, s = Snap("#snap");
  var whichFrame = 0, frames = [], anistopped = false;

  SP.init = function() {
    s = Snap("#snap");
    var g;

    frames = [];


    var linkcolor = "#F85200";

    // markers
    var markers = [
      [307,97,"1827"],
      [215,245,"1830"],
      [210,295,"1865"],
      [235,324,"1836"],
      [232,338,"1856"],
      [201,350,"1837"],
      [160,325,"1876"]
    ];

    // var shadow = s.filter(Snap.filter.shadow(0, 0, 1, "#000", 0.5));

    var url = "img/delmonicos.svg";

    var letters, text, lettersnext, textnext, usatext, lettersexport
        , textexport, json, menu, news, photo, browser
        , nyc, markerrect, markertext, usa, usadots;

    var monofont = "'Input Sans', 'Lucida Console', 'Monaco', 'Courier New', 'Courier', monospace";

    var query = "delmonico's 1865";
    var querynext = "discover more";
    var queryexport = "export!";

    main = Snap.load(url, function (f) {
      g = f.select("g");

      browser = g.select("#browser");

      s.append(g);

      // select main elements
      json = g.select("#json");
      menu = g.select("#menu");
      news = g.select("#news");
      photo = g.select("#photo");
      nyc = g.select("#oldnyc");
      usa = g.select("#usa");
      usadots = g.select("#dots");
      usatext = g.select("#usa-text");

      browser.attr({opacity:0});
      json.attr({opacity:0});
      menu.attr({opacity:0});
      news.attr({opacity:0});
      photo.attr({opacity:0});
      nyc.attr({opacity:0});
      usa.attr({transform:"translate(275.000000, 200.000000) scale(0.0, 0.0)",opacity:0});
      usatext.attr({opacity:0});

      // text
      letters = query.split("");

      text = s.text(88, 68, letters);

      text.attr({
        "font-size": "24px"
        ,"font-family":monofont
      });

      text.selectAll("tspan").attr({
        "fill-opacity": 0
      });

      frames.push({el:browser, animation:{opacity:1}, dur:200});
      frames.push({el:nyc, animation:{opacity:1}, dur:500});

      // text search
      for (var i=0; i<12; i++) {
        var el = text.select("tspan:nth-child("+(i+1)+")");
        frames.push({el:el, animation: {"fill-opacity":1}, dur:75})
      }

      frames.push({delay:500});

      var nycframeout = {
        el: nyc,
        animation: {x:54, y:-27, width:434, height:414},
        dur: 2
      }

      frames.push(nycframeout);

      var nycframein = {
        el: nyc,
        animation: {x:-76, y:-805, width:1327, height:1265},
        dur: 200
      }

      frames.push(nycframein);

      frames.push({delay:500});

      // now add marker frames
      for (var i=0; i<markers.length; i++) {
        var m = markers[i];
        var c = s.circle(m[0], m[1], 0);
        m.push(c);
        c.attr({fill:linkcolor,opacity:0});
        var f = {el:c, animation: {opacity:1, r:8}, dur: 100};
        frames.push(f);
      }

      frames.push({delay:1000});

      // date search
      for (var i=12; i<letters.length; i++) {
        var el = text.select("tspan:nth-child("+(i+1)+")");
        frames.push({el:el, animation: {"fill-opacity":1}, dur:75})
      }

      var mainmarker;

      // now add marker frames
      for (var i=0; i<markers.length; i++) {
        var m = markers[i];
        var c = m[3];
        if (m[2]!="1865") {
          r = 0;
        } else {
          r = 32;
          mainmarker = m;
        }
        var f = {el:c, animation: {opacity:1, r:r}, dur: 100};
        frames.push(f);
      }

      markerrect = s.rect(mainmarker[0]-5, mainmarker[1]-30, 1, 1);
      markerrect.attr({
        opacity: 0
        ,fill: "#ffffff"
      });

      frames.push({el: markerrect, animation:{height:30, opacity:1}, dur:100});
      frames.push({el: markerrect, animation:{width:200}, dur:100});

      var markertext = s.text(mainmarker[0], mainmarker[1]-10, query);

      markertext.attr({
        "font-size": "18px"
        ,"font-family": monofont
        ,opacity: 0
      });

      // swap depths with overlays
      s.add(photo);
      s.add(news);
      s.add(menu);

      frames.push({el:markertext, animation:{opacity:1}, dur: 500});

      frames.push({delay:2000});

      // now hide url for new query
      frames.push({el:text, animation:{opacity:0}, dur:100});

      lettersnext = querynext.split("");

      textnext = s.text(88, 68, lettersnext);

      textnext.attr({
        "font-size": "24px"
        ,"font-family":monofont
      });

      textnext.selectAll("tspan").attr({
        "fill-opacity": 0
      });

      // next search
      for (var i=0; i<lettersnext.length; i++) {
        var el = textnext.select("tspan:nth-child("+(i+1)+")");
        frames.push({el:el, animation: {"fill-opacity":1}, dur:75})
      }

      frames.push({delay:500});

      frames.push({el:mainmarker[3], animation:{opacity:0}, dur:100});
      frames.push({el:markertext, animation:{opacity:0}, dur:100});
      frames.push({el:markerrect, animation:{opacity:0}, dur:100});

      // moar stuff appears
      frames.push({el:photo, animation:{opacity:1, y:parseInt(photo.attr("y")-20)}, dur: 100});

      // move news vertically + opacity
      var str = news.transform().string.split(",");
      var y = parseInt(str[1]);
      y -= 20;
      frames.push({el:news, animation:{opacity:1, transform:str[0] + "," + y}, dur: 100});

      // move menu vertically + opacity
      var str = menu.transform().string.split(",");
      var y = parseInt(str[1]);
      y -= 20;
      frames.push({el:menu, animation:{opacity:1, transform:str[0] + "," + y}, dur: 100});

      frames.push({delay:3000});

      // hide url for new query
      frames.push({el:textnext, animation:{opacity:0}, dur:100});

      lettersexport = queryexport.split("");

      textexport = s.text(88, 68, lettersexport);

      textexport.attr({
        "font-size": "24px"
        ,"font-family":monofont
      });

      textexport.selectAll("tspan").attr({
        "fill-opacity": 0
      });

      // export search
      for (var i=0; i<lettersexport.length; i++) {
        var el = textexport.select("tspan:nth-child("+(i+1)+")");
        frames.push({el:el, animation: {"fill-opacity":1}, dur:75})
      }

      frames.push({delay:1000});

      frames.push({el:news, animation:{opacity:0}, dur:100});
      frames.push({el:menu, animation:{opacity:0}, dur:100});
      frames.push({el:photo, animation:{opacity:0}, dur:100});
      frames.push({el:nyc, animation:{opacity:0}, dur:100});
      frames.push({el:json, animation:{opacity:1}, dur:300});

      frames.push({delay:3000});

      frames.push({el:textexport, animation:{opacity:0}, dur:100});
      frames.push({el:json, animation:{opacity:0}, dur:100});

      frames.push({el:browser, animation:{transform:"translate(275.000000, 200.000000) scale(0.0, 0.0)", opacity:0}, dur:300});

      frames.push({el:usa, animation:{transform:"translate(0, 0) scale(1.0, 1.0)",opacity:1}, dur:200});

      frames.push({delay:300});

      var dots = usadots.selectAll("circle");

      for(var i=0;i<dots.length;i++) {
        var el = dots[i];
        el.attr({opacity:0});
        frames.push({el:el, animation:{opacity:1}, dur:100});
      }

      frames.push({el:usatext, animation:{opacity:1}, dur:200});

      frames.push({delay:5000});

      frames.push({el:usadots, animation:{opacity:0}, dur:300});
      frames.push({el:usatext, animation:{opacity:0}, dur:300});
      frames.push({el:usa, animation:{opacity:0}, dur:500});

      setTimeout(SP.go, 500);
    });

  }


  SP.nextFrame = function ( frameArray ) {
    if (anistopped) return;
    if( whichFrame >= frameArray.length ) { end(); return; }
    var frame = frameArray[ whichFrame ];
    whichFrame++;
    el = frame.el;
    if (el==undefined) {
      setTimeout(function(){
        SP.nextFrame(frameArray);
      },frame.delay);
      return;
    }
    el.animate( frame.animation, frame.dur, mina.easein, SP.nextFrame.bind( null, frameArray  ) );
  }

  SP.end = function() {
    Snap.selectAll("g").remove();
    Snap.selectAll("text").remove();
    Snap.selectAll("circle").remove();
    Snap.selectAll("rect").remove();
    Snap.selectAll("image").remove();
    Snap.selectAll("filter").remove();
    SP.init();
  }

  SP.stop = function() {
    anistopped = true;
    Snap.selectAll("g").remove();
    Snap.selectAll("text").remove();
    Snap.selectAll("circle").remove();
    Snap.selectAll("rect").remove();
    Snap.selectAll("image").remove();
    Snap.selectAll("filter").remove();
    whichFrame = frames.length + 1;
  }

  SP.go = function() {
    whichFrame = 0;
    SP.nextFrame(frames);
  }
})();

// the document scroll/resize code

$( document ).ready(function() {
  var anistarted = false;
  var mobilewidth = 550;
  var responsivewidth = 667;
  var firstmap = false;
  var isdevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

  if (!firstmap) {
    firstmap = true;
    $(".map").first().remove();
  }


  gifWidth();
  orderMaps();
  mapBackground();

  function gifWidth() {
    var winw = $(window).width();
    if (winw >= mobilewidth) {
      $("#animation").show();
      return;
    }
    var ani = $("#animation");
    var ratio = 400/550;
    var neww = winw - 20;
    ani.width(neww);
    ani.height(neww*ratio);
  }

  function orderMaps() {
    if (!isdevice) return;
    var maps = $(".map");
    var map, l = maps.length;

    maps.css({
      boxShadow: "none"
      ,position: "absolute"
      ,backgroundAttachment: "scroll"
      ,backgroundSize: "cover"
      ,opacity: 1
      ,top: 0
    });

    for (var i=0;i<l;i++) {
      map = $(maps[i]);
      map.css({zIndex:l-i});
    }
  }

  function mapBackground() {
    if (!isdevice) return;
    var wintop = $(window).scrollTop();
    var winw = $(window).width();
    var winh = $(window).height();
    var bodyh = $("body").height();
    var main = $("#maps");
    var maps = $(".map");

    var ratio = winw/460; // from the img size
    main.width(winw);
    main.height(winh);
    main.css({
      position: "fixed"
    });
    maps.width(winw);
    maps.height(930*ratio);

    var position = wintop / bodyh;

    var map, l = maps.length;

    var shown = l * position;

    var mapshown = Math.floor(shown);

    var opacity = 1 - parseFloat("." + shown.toFixed(2).split(".")[1]);

    if (mapshown<0) mapshown = 0;
    if (mapshown>=l) mapshown = l-1;

    for (var i=0;i<l;i++) {
      map = $(maps[i]);
      if (i == mapshown) {
        map.css({opacity:opacity});
      } else if (i == mapshown+1) {
        map.css({opacity:1});
      } else {
        map.css({opacity:0});
      }
    }
  }

  $(window).resize( function (e) {
    gifWidth();
    // mapBackground();
  });

  $(window).scroll( function (e) {
    mapBackground();
    var margin = 20;
    var wintop = $(window).scrollTop();
    var winw = $(window).width();
    var winh = $(window).height();
    var parttop = $("#part3").offset().top;
    var deltatop = wintop - parttop + margin;
    var ani = $("#animation");
    var h = ani.height();
    var nexttop = $("h2.part4").offset().top - margin; // minus a small margin
    if (wintop+winh*.5 >= parttop) {
      if (winw < mobilewidth) {
        anistopped = true;
        anistarted = false;
        return;
      }
      if (!anistarted) {
        if (winw >= responsivewidth) ani.fadeIn();
        anistarted = true;
        SP.end();
      }
      ani.width(550);
      ani.height(400);
      if (winw <= responsivewidth) {
        ani.css("top", 0);
        return;
      }
      if (deltatop <= 0) deltatop = 0;
      if (wintop+h+margin >= nexttop) deltatop = nexttop-h-parttop;
      ani.css("top", deltatop);
    }
  });

});
