!function(t){function e(){$("h1, h2").each(function(){var t=$(this),e=t.nextUntil("h1, h2");h.add({id:t.prop("id"),title:t.text(),body:e.text()})})}function i(){a=$(".content"),r=$(".dark-box"),l=$(".search-results"),$("#input-search").on("keyup",s)}function s(t){if(o(),l.addClass("visible"),27===t.keyCode&&(this.value=""),this.value){var e=h.search(this.value).filter(function(t){return t.score>1e-4});e.length?(l.empty(),$.each(e,function(t,e){l.append("<li><a href='#"+e.ref+"'>"+$("#"+e.ref).text()+"</a></li>")}),n.call(this)):(l.html("<li></li>"),$(".search-results li").text('No Results Found for "'+this.value+'"'))}else o(),l.removeClass("visible")}function n(){this.value&&a.highlight(this.value,c)}function o(){a.unhighlight(c)}var a,r,l,c=($(t),{element:"span",className:"search-highlight"}),h=new lunr.Index;h.ref("id"),h.field("title",{boost:10}),h.field("body"),h.pipeline.add(lunr.trimmer,lunr.stopWordFilter),$(e),$(i)}(window);