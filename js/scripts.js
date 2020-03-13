
	var canvas = []
	var ctx = []

	var canvas_overlay;
	var ctx_overlay;

	var has_loaded_once = false;
	var first_load = true;

	var load_safecheck = 0;

	let fontFaceSet = document.fonts;

	var color_to_use = "rgba(0,0,255,1)"
	var color_to_use_t = "rgba(0,0,255,0)"


	document.fonts.onloadingdone = function (fontFaceSetEvent) {
		console.log('font loaded', fontFaceSetEvent)
		// alert('onloadingdone we have ' + fontFaceSetEvent.fontfaces.length + ' font faces loaded');
		// all fonts loaded, hide preloaded

	};

	document.fonts.ready.then(function() {
		console.log('fonts ready')
	  // Any operation that needs to be done only after all the fonts
	  // have finished loading can go here.
		
		load_safecheck++;
		if (load_safecheck == 2) {
			$('.preloader').fadeOut();	
			console.log('fade out fired')
		}
	});
	
	var images = []

	//////////////// populate content at start
	for (var i = 0; i < data.length; i++) {
		
		var content_to_append = data[i].title+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' 
		// content_to_append = content_to_append.substr(0, 0)+ str.substr(index);

		// count number of spaces
		var space_length = (content_to_append.split(" ").length - 1);
		// console.log(space_length)


		// replace random space in each line with image
		var search = ' ';
		var n = Math.floor(Math.random()*space_length+1) ;
		var to_replace = "<div class='img_wrap'>\
						  <img id='img_"+i+"' src='img/"+(i+1)+"/thumb/0.jpg'+>\
						  <canvas id='canvas"+i+"' data-id="+i+" class='image_canvas'></canvas>\
						  </div>"
		content_to_append = content_to_append.replace(RegExp("^(?:.*? ){" + n + "}"), function(x){return x.replace(RegExp(search + "$"), to_replace)})


		$('.rtl').append('<li data-index="'+i+'" class="li_'+i+'"><div class="spacer_top"></div>'+content_to_append+'</li>')

		if ( i == data.length - 1 ) {
			check_image_loaded('.rtl');
		}

		if (i < data.length) {
			// populate list
			$('.overlay_menu ul').append('\
				<li data-index="'+i+'">\
					<span class="project_date">'+( i+1 < 10 ? '0'+(i+1) : i )+'</span><span class="project_title">'+data[i].title+'</span>\
				</li>\
			')			
		}

	};

	////////////////
	function check_image_loaded(div) {
		$(div).imagesLoaded()
		  .always( function( instance ) {
		    // console.log('all images loaded');
		  })
		  .done( function( instance ) {
		    console.log('all images successfully loaded');

		    // console.log(div)
		    // when images on rtl firsts loads, add mousemove event for rtl canvas
		    if (div == '.rtl') {
		    	console.log('case 1');		    	

				$('.image_canvas').mousemove(function(e) {
					// if (window.innerWidth > 1024) {
						var canvas_id = $(this).attr('data-id');
					    var canvasOffset = $(canvas[canvas_id]).offset();
					    var canvasX = Math.floor(e.pageX-canvasOffset.left);
					    var canvasY = Math.floor(e.pageY-canvasOffset.top);

					    var imageData = ctx[canvas_id].getImageData(0, 0, canvas[canvas_id].width, canvas[canvas_id].height);
					    var pixels = imageData.data;
					    var pixelRedIndex = ((canvasY - 1) * (imageData.width * 4)) + ((canvasX - 1) * 4);
					    var pixelcolor = "rgba("+pixels[pixelRedIndex]+", "+pixels[pixelRedIndex+1]+", "+pixels[pixelRedIndex+2]+", "+pixels[pixelRedIndex+3]+")";
					    var pixelcolor_t = "rgba("+pixels[pixelRedIndex]+", "+pixels[pixelRedIndex+1]+", "+pixels[pixelRedIndex+2]+", 0)";
					    color_to_use = pixelcolor;
					    // with alpha0 
					    color_to_use_t = pixelcolor_t;

					    TweenMax.to('.bg_color', 0.3, {background:'radial-gradient('+pixelcolor+' 0%, rgba(255,255,255,1) 60%', ease: Power1.easeInOut})
					    TweenMax.to('.menu_trigger', 0.3, {background:'radial-gradient(20.00px at 50% 50%, '+pixelcolor+' 0%, rgba(196, 196, 196, 0) 100%)', ease: Power1.easeInOut})
					    

				    // } 	
				});
				$('.image_canvas').mouseleave(function(e) {
					if (window.innerWidth > 1024) {
						TweenMax.to('.bg_color', 0.3, {background:'radial-gradient(rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%',  ease: Power1.easeInOut})
						TweenMax.to('.menu_trigger', 0.3, {background:'radial-gradient(20.00px at 50% 50%, #000000 0%, rgba(196, 196, 196, 0) 100%)', ease: Power1.easeInOut})
						color_to_use = "rgb(0, 0, 255, 1)";
						color_to_use_t = "rgb(0, 0, 255, 0)";
						// console.log(color_to_use, "leave")
					}
				}); 
				

				if (first_load) {
					first_load = false;	
				}
				load_safecheck++;
				if (load_safecheck == 2) {
					$('.preloader').fadeOut();	
					console.log('fade out fired')
				}
		    } 
		    // when image overlay loads, add mousemove event for overlay canvas
		    else {
		    	if (!has_loaded_once) {
		    		
		    		has_loaded_once = true;
		    		console.log('case 2');

					$('#canvas_overlay').mousemove(function(e) {
					    var canvasOffset_o = $(canvas_overlay).offset();
					    var canvasX_o = Math.floor(e.pageX-canvasOffset_o.left);
					    var canvasY_o = Math.floor(e.pageY-canvasOffset_o.top);

					    var imageData_o = ctx_overlay.getImageData(0, 0, canvas_overlay.width, canvas_overlay.height);
					    var pixels_o = imageData_o.data;
					    var pixelRedIndex_o = ((canvasY_o - 1) * (imageData_o.width * 4)) + ((canvasX_o - 1) * 4);
					    var pixelcolor_o = "rgba("+pixels_o[pixelRedIndex_o]+", "+pixels_o[pixelRedIndex_o+1]+", "+pixels_o[pixelRedIndex_o+2]+", "+pixels_o[pixelRedIndex_o+3]+")";
					    var pixelcolor_o_t = "rgba("+pixels_o[pixelRedIndex_o]+", "+pixels_o[pixelRedIndex_o+1]+", "+pixels_o[pixelRedIndex_o+2]+", 0)";
					    color_to_use = pixelcolor_o;
					    color_to_use_t = pixelcolor_o_t;


					    // $("body").css("backgroundColor", pixelcolor);
					    if (window.innerWidth > 570) {
					    	TweenMax.to('.bg_color_content', 0.3, {background:'radial-gradient('+pixelcolor_o+' 40%, rgba(255,255,255,1) 70%', ease: Power1.easeInOut})
					    } else {
					    	TweenMax.to('.bg_color_content', 0.3, {background:'radial-gradient('+pixelcolor_o+' 20%, rgba(255,255,255,1) 70%', ease: Power1.easeInOut})	
					    }
					    
					});
		    	}

				// when overlay images are all loading, fade in images and hide loading
				$('.overlay_content').addClass('loaded');
		    }

		  })
		  .fail( function() {
		    console.log('all images loaded, at least one is broken');
		  })
		  .progress( function( instance, image ) {
		    var result = image.isLoaded ? 'loaded' : 'broken';
		    // console.log( 'image is ' + result + ' for ' + image.img.src );
		    var img_width = image.img.width;
		    var img_height = image.img.height;

		    if (div == '.rtl') {

			    var canvas_elem = image.img.nextElementSibling;
			    var canvas_id = $(canvas_elem).attr('data-id');
			    // $(canvas_elem).width(img_width); 
			    // $(canvas_elem).height(img_height);

				console.log('loaded: rtl images', img_width, img_height)

				canvas[canvas_id] = $(canvas_elem).get(0);
				ctx[canvas_id] = canvas[canvas_id].getContext("2d");
				ctx[canvas_id].canvas.width = image.img.width;
				ctx[canvas_id].canvas.height = image.img.height;
				var image_to_use = $('.li_'+canvas_id+' img')[0];
				// console.log(image_to_use)
				ctx[canvas_id].drawImage(image_to_use, 0, 0, img_width, img_height);

	     	} else {
	     		console.log('loaded: overlay img', img_width, img_height);
	     		canvas_overlay = $('#canvas_overlay').get(0);
	     		ctx_overlay = canvas_overlay.getContext("2d");
	     		ctx_overlay.canvas.width = image.img.width;
	     		ctx_overlay.canvas.height = image.img.height;
	     		var image_to_use = $('.overlay_content img')[0];
	     		ctx_overlay.drawImage(image_to_use, 0, 0, img_width, img_height);
	     	}
		  });
	}


	//////////////// hover 
	$(document).mousemove(function(event){

		// only if not showing detail overlay
		if ( !$('body').hasClass('show_content') &&  window.innerWidth > 1024) {
			// console.log(event);

			var scroll_excess_x = $('.rtl')[0].scrollWidth - window.innerWidth

			// invert mouse x pos
			var scroll_pos_x = ( (window.innerWidth - event.pageX )  / window.innerWidth) * scroll_excess_x

			// $('.rtl').css({
			// 	'transform': "translateX("+scroll_pos_x+"px)",
			// });
			TweenMax.to(".rtl", 1, {x:scroll_pos_x});

			if (event.target.classList[0] != undefined) {
				if (event.target.classList[0].indexOf('li_') !== -1) {
					var hovered_class = event.target.classList[0];
					var scroll_excess_y = $('.'+hovered_class)[0].scrollHeight - window.innerHeight;
					var scroll_pos_y = - (( event.pageY  / window.innerHeight) * scroll_excess_y) 
					
					// console.log(scroll_pos_y);

					// $('.'+hovered_class).css({
					// 	'transform': "translateY(-"+scroll_pos_y+"px)",
					// });
					TweenMax.to("."+hovered_class, 1, {y: scroll_pos_y});			
				}
			}
		}

	}); /* end mousemove. */

	var slider_index = 0;
	var project_index = 0;

	$(document).on('click','.rtl li, .overlay_menu li',function(){
		project_index = parseInt($(this).attr('data-index'));
		slider_index = 0;
		$('body').addClass('show_content');
		$('.loading_icon').addClass('show');

		$('.overlay_content ul').empty();
		$('.overlay_content li').removeClass('show');

		$('.overlay_content').fadeIn(200);
		
		for (var i = 0; i < data[project_index].images.length; i++) {
			$('.overlay_content ul').append('\
				<li class="li_'+i+'"><img src="'+'img/'+(project_index+1)+'/'+i+'.jpg'+'"></li>\
			')
		};
		$('.overlay_content .li_0').addClass('show')

		// $('.overlay_content img').attr('src', 'img/'+(project_index+1)+'/'+slider_index+'.jpg');
		$('.pagination').html('1 – '+data[project_index].images.length);

		check_image_loaded('.overlay_content ul');
	});


	$(document).on('click','#canvas_overlay, .pagination',function(){
		next_image()
	});

	function next_image() {
		// console.log(slider_index,  data[project_index].images.length)
		if (slider_index !=  data[project_index].images.length-1) {
			slider_index++;
		} else {
			slider_index = 0;
		}
		$('.pagination').html((slider_index+1)+' – '+data[project_index].images.length);

		$('.overlay_content li').removeClass('show');
		$('.overlay_content .li_'+slider_index).addClass('show');

		// $('.overlay_content img').attr('src', 'img/'+(project_index+1)+'/'+slider_index+'.jpg');
		// check_image_loaded('.overlay_content');

 		redraw_overlay_canvas()
	}
	function prev_image() {
		// console.log(slider_index,  data[project_index].images.length)
		if (slider_index !=  0) {
			slider_index--;
		} else {
			slider_index = data[project_index].images.length-1;
		}
		$('.pagination').html((slider_index+1)+' – '+data[project_index].images.length);

		$('.overlay_content li').removeClass('show');
		$('.overlay_content .li_'+slider_index).addClass('show');

		// $('.overlay_content img').attr('src', 'img/'+(project_index+1)+'/'+slider_index+'.jpg');
		// check_image_loaded('.overlay_content');

 		redraw_overlay_canvas()
	}

	function redraw_overlay_canvas() {
 		canvas_overlay = $('#canvas_overlay').get(0);
 		ctx_overlay = canvas_overlay.getContext("2d");
 		ctx_overlay.canvas.width = $('.overlay_content .li_'+slider_index+' img').width();
 		ctx_overlay.canvas.height = $('.overlay_content .li_'+slider_index+' img').height();
 		var image_to_use = $('.overlay_content .li_'+slider_index+' img')[0];
 		ctx_overlay.drawImage(image_to_use, 0, 0, ctx_overlay.canvas.width, ctx_overlay.canvas.height);
	}

	$('.close').click(function() {
		close_overlay()
	})

	function close_overlay() {
		$('.overlay_content').fadeOut(200);	
		$('body').removeClass('show_content');
		$('.overlay_content').removeClass('loaded');
	}

	$(document).on('click','.menu_trigger',function(){
		$('body').toggleClass('show_menu');
		$('body').removeClass('show_about');

		if ( $('body').hasClass('show_menu') ) {
			$('.overlay_menu').scrollTop(0);
			console.log('fired xx')
		}
		
	});
	$(document).on('click','.logo',function(){
		$('body').toggleClass('show_about');
		$('body').removeClass('show_menu');
	});

	$(document).on('mouseover','.logo',function(){
		if (window.innerWidth > 1024) {
			TweenMax.to(".li_0", 1, {y: 0});
		}	
	});

	


	//////////////// resize event

    window.addEventListener("resize", resize_event, false);

    function resize_event() {
    	if ( $('body').hasClass('show_content') ) {
    		$('#canvas_overlay').css({
    			width: $('.overlay_content img').width(),
    			height: $('.overlay_content img').height()
    		})
	 		
	 		redraw_overlay_canvas()
    	} 

    	$('.rtl li').each(function(index) {
    		var width_to_use = $('.rtl .li_'+index+' img').width();
    		var height_to_use = $('.rtl .li_'+index+' img').height();

    		$('#canvas'+index).css({
    			width: width_to_use,
    			height: height_to_use
    		})

			canvas[index] = $('#canvas'+index).get(0);
			ctx[index] = canvas[index].getContext("2d");
			ctx[index].canvas.width = width_to_use;
			ctx[index].canvas.height = height_to_use;
			var image_to_use_rtl = $('.li_'+index+' img')[0];
			// console.log(image_to_use)
			ctx[index].drawImage(image_to_use_rtl, 0, 0, width_to_use, height_to_use);
    	})
    };


    ///////////// keyboard shortcuts for closing panels and image navigation
	$( "body" ).keyup(function(e) {
		console.log(e.keyCode)
		if ( $('body').hasClass('show_content') ) {
			if (e.keyCode == 27) {
				close_overlay()
			} else if(e.keyCode == 37) {
				prev_image()
			}
			 else if(e.keyCode == 39) {
				next_image()
			}
		} 
		else if($('body').hasClass('show_about')) {
			if (e.keyCode == 27) {
				$('body').removeClass('show_about')
			} 
		}
		else if($('body').hasClass('show_menu')) {
			if (e.keyCode == 27) {
				$('body').removeClass('show_menu')
			} 
		}
	});






	////////// favicon

	var head = document.head || document.getElementsByTagName('head')[0];

	function changeFavicon(src) {
	  var link = document.createElement('link');
	  var oldLink = document.querySelector('link[rel="shortcut icon"]');
	  link.rel = 'shortcut icon';
	  link.href = src;
	  if (oldLink) {
	    head.removeChild(oldLink);
	  }
	  head.appendChild(link);
	}


	function initFavicon() {
	  var loadedDataSrcs = {};
	  var currentFavicon = 0;
	  var fav_loaded = 0;
	  var fav_count = 1;
	  var canvas_fav = document.createElement('canvas');
	  var ctx_fav = canvas_fav.getContext('2d');


	  function fav_loop() {
	    // console.log(currentFavicon)
	    // currentFavicon++;
	    // if (currentFavicon >= fav_count) currentFavicon = 0;

		var grd = ctx_fav.createRadialGradient(16, 16, 0.1, 16, 16, 16);
		// console.log(color_to_use)
		if( color_to_use == 'rgba(undefined, undefined, undefined, undefined)' ) {
			grd.addColorStop(0, "rgba(0,0,255,1)" );	
			console.log('hit')
		}else {
			grd.addColorStop(0, color_to_use);
		}
		
		if( color_to_use_t == 'rgba(undefined, undefined, undefined, undefined)' || 
			color_to_use_t == 'rgba(undefined, undefined, undefined, 0)') {
			grd.addColorStop(1, "rgba(0,0,255,0)");
			console.log('hit 2')
		} else {
			grd.addColorStop(1, color_to_use_t);
		}

		// Fill with gradient
		ctx_fav.fillStyle = grd;
		ctx_fav.clearRect(0, 0, canvas_fav.width, canvas_fav.height);
		ctx_fav.fillRect(0, 0, canvas_fav.width, canvas_fav.height);
		var color_data = canvas_fav.toDataURL('image/png')
	    changeFavicon(color_data);
	    setTimeout(function() {requestAnimationFrame(fav_loop)}, 100);
	  }

	  function getData() {
	  	console.log('get data')
	    var loadImage = new Image();
	    loadImage.src = 'img/favicon/frames/c' + fav_loaded +'.png';
	    loadImage.onload = function() {
	      canvas_fav.width = this.naturalWidth;
	      canvas_fav.height = this.naturalHeight;
	      // ctx_fav.drawImage(this, 0, 0);

	      var grd = ctx_fav.createRadialGradient(16, 16, 0.1, 16, 16, 16);
	      grd.addColorStop(0, color_to_use);
	      grd.addColorStop(1, color_to_use_t);

	      ctx_fav.fillStyle = grd;
	      ctx_fav.clearRect(0, 0, canvas_fav.width, canvas_fav.height);
		  ctx_fav.fillRect(0, 0, canvas_fav.width, canvas_fav.height);
	      // console.log(color_to_use)
		  var color_data = canvas_fav.toDataURL('image/png')
		  changeFavicon(color_data);

	      fav_loaded++;
	      if (fav_loaded === fav_count) {
	        requestAnimationFrame(fav_loop);
	      } else {
	        getData();
	      }
	    }
	  }

	  getData()

	};

	initFavicon()