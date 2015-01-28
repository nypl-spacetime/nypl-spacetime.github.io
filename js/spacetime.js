$( document ).ready(function() {

  var anistarted = false;

  var main, s = Snap("#snap");
  var frames = [];

  $(".more").click( function (e) {
    e.preventDefault();
    var d = $(this).data("more");
    // TODO: add item to history to support back button?
    if (d) {
      var id = "#" + d;
      $("body").scrollTo(id, 500, {easing:'easeOutCubic',offset: {top:-20}});
    }
  });

  $(window).scroll( function (e) {
    var margin = 20;
    var wintop = $(window).scrollTop();
    var winh = $(window).height();
    var parttop = $("#part3").offset().top;
    var deltatop = wintop - parttop + margin;
    var ani = $("#animation");
    var h = ani.height();
    var nexttop = $(".next.part4").offset().top-margin; // minus a small margin
    if (wintop+winh*.5 >= parttop) {
      if (!anistarted) {
        anistarted = true;
        ani.fadeIn();
        end();
      }
      if (deltatop <= 0) deltatop = 0;
      if (wintop+h+margin >= nexttop) deltatop = nexttop-h-parttop;
      ani.css("top", deltatop);
    }
  });

  function init() {
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

      browser = g.select("#browser")
      // browser.attr({
      //   filter: shadow
      // })

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

      setTimeout(go, 500);
    });

  }


  function nextFrame ( frameArray,  whichFrame ) {
    if( whichFrame >= frameArray.length ) { end(); return; }
    el = frameArray[whichFrame].el;
    if (el==undefined) {
      setTimeout(function(){
        nextFrame(frameArray, whichFrame + 1);
      },frameArray[whichFrame].delay);
      return;
    }
    el.animate( frameArray[ whichFrame ].animation, frameArray[ whichFrame ].dur, mina.easein, nextFrame.bind( null, frameArray, whichFrame + 1 ) );
  }

  function end() {
    Snap.selectAll("g").remove();
    Snap.selectAll("text").remove();
    Snap.selectAll("circle").remove();
    Snap.selectAll("rect").remove();
    Snap.selectAll("image").remove();
    Snap.selectAll("filter").remove();
    init();
  }

  function go() {
    nextFrame(frames, 0);
  }

});
