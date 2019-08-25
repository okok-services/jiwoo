
	var canvas = []
	var ctx = []

	var canvas_overlay;
	var ctx_overlay;

	var has_loaded_once = false;
	var first_load = true;


	document.fonts.onloadingdone = function (fontFaceSetEvent) {
		console.log('ran')
		// alert('onloadingdone we have ' + fontFaceSetEvent.fontfaces.length + ' font faces loaded');
		// all fonts loaded, hide preloaded
		$('.preloader').fadeOut();
	};
	
	var images = []

	////////////////
	for (var i = 0; i < data.length; i++) {
		
		var content_to_append = (i+1)+' '+data[i].title+' '+data[i].date+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' 
		// content_to_append = content_to_append.substr(0, 0)+ str.substr(index);

		// count number of spaces
		var space_length = (content_to_append.split(" ").length - 1);
		// console.log(space_length)


		// replace random space in each line with image
		var search = ' ';
		var n = Math.floor(Math.random()*space_length+1) ;
		var to_replace = "<div class='img_wrap'>\
						  <img id='img_"+i+"' src='img/"+(i+1)+"/1.jpg'+>\
						  <canvas id='canvas"+i+"' data-id="+i+" class='image_canvas'></canvas>\
						  </div>"
		content_to_append = content_to_append.replace(RegExp("^(?:.*? ){" + n + "}"), function(x){return x.replace(RegExp(search + "$"), to_replace)})


		$('.rtl').append('<li data-index="'+i+'" class="li_'+i+'"><div class="spacer_top"></div>'+content_to_append+'</li>')


		if ( i == data.length - 1 ) {
			check_image_loaded('.rtl');
		}


		// populate list

		$('.overlay_menu ul').append('\
			<li data-index="'+i+'">\
				<span class="project_date">'+data[i].date+'</span><span class="project_title">'+data[i].title+'</span>\
			</li>\
		')
	};

	////////////////
	function check_image_loaded(div) {
		$(div).imagesLoaded()
		  .always( function( instance ) {
		    console.log('all images loaded');
		  })
		  .done( function( instance ) {
		    console.log('all images successfully loaded');

		    // console.log(div)
		    if (div == '.rtl') {
				$('.image_canvas').mousemove(function(e) {
					var canvas_id = $(this).attr('data-id');
				    var canvasOffset = $(canvas[canvas_id]).offset();
				    var canvasX = Math.floor(e.pageX-canvasOffset.left);
				    var canvasY = Math.floor(e.pageY-canvasOffset.top);

				    var imageData = ctx[canvas_id].getImageData(0, 0, canvas[canvas_id].width, canvas[canvas_id].height);
				    var pixels = imageData.data;
				    var pixelRedIndex = ((canvasY - 1) * (imageData.width * 4)) + ((canvasX - 1) * 4);
				    var pixelcolor = "rgba("+pixels[pixelRedIndex]+", "+pixels[pixelRedIndex+1]+", "+pixels[pixelRedIndex+2]+", "+pixels[pixelRedIndex+3]+")";

				    // $("body").css("backgroundColor", pixelcolor);
				    TweenMax.to('.bg_color', 0.2, {background:'radial-gradient('+pixelcolor+' 0%, rgba(255,255,255,1) 60%', ease: Power1.easeInOut})
				});
				$('.image_canvas').mouseleave(function(e) {
					TweenMax.to('.bg_color', 0.2, {background:'radial-gradient(rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%',  ease: Power1.easeInOut})
				});  	

				if (first_load) {
					first_load = false;
					

				}
		    } else {
		    	if (!has_loaded_once) {
		    		
		    		has_loaded_once = true;

					$('#canvas_overlay').mousemove(function(e) {
					    var canvasOffset_o = $(canvas_overlay).offset();
					    var canvasX_o = Math.floor(e.pageX-canvasOffset_o.left);
					    var canvasY_o = Math.floor(e.pageY-canvasOffset_o.top);

					    var imageData_o = ctx_overlay.getImageData(0, 0, canvas_overlay.width, canvas_overlay.height);
					    var pixels_o = imageData_o.data;
					    var pixelRedIndex_o = ((canvasY_o - 1) * (imageData_o.width * 4)) + ((canvasX_o - 1) * 4);
					    var pixelcolor_o = "rgba("+pixels_o[pixelRedIndex_o]+", "+pixels_o[pixelRedIndex_o+1]+", "+pixels_o[pixelRedIndex_o+2]+", "+pixels_o[pixelRedIndex_o+3]+")";

					    // $("body").css("backgroundColor", pixelcolor);
					    TweenMax.to('.bg_color_content', 0.2, {background:'radial-gradient('+pixelcolor_o+' 40%, rgba(255,255,255,1) 70%', ease: Power1.easeInOut})
					});

		    	}

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

			    console.log(img_width, img_height)

		         canvas[canvas_id] = $(canvas_elem).get(0);
		         ctx[canvas_id] = canvas[canvas_id].getContext("2d");
		         ctx[canvas_id].canvas.width = image.img.width;
		         ctx[canvas_id].canvas.height = image.img.height;
		         var image_to_use = $('.li_'+canvas_id+' img')[0];
		         // console.log(image_to_use)
		         ctx[canvas_id].drawImage(image_to_use, 0, 0, img_width, img_height);

	     	} else {
	     		console.log('hey2')

	     		canvas_overlay = $('#canvas_overlay').get(0);
	     		ctx_overlay = canvas_overlay.getContext("2d");
	     		ctx_overlay.canvas.width = image.img.width;
	     		ctx_overlay.canvas.height = image.img.height;
	     		var image_to_use = $('.overlay_content img')[0];
	     		ctx_overlay.drawImage(image_to_use, 0, 0, img_width, img_height);
	     	}
		  });
	}


	////////////////
	$(document).mousemove(function(event){

		if ( !$('body').hasClass('show_content') ) {
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

	var slider_index = 1;
	var project_index = 0;

	$(document).on('click','.rtl li, .overlay_menu li',function(){
		project_index = parseInt($(this).attr('data-index'));
		slider_index = 1;
		$('body').addClass('show_content');
		$('.overlay_content').show()
		$('.overlay_content img').attr('src', 'img/'+(project_index+1)+'/'+slider_index+'.jpg');
		$('.pagination').html('1 – '+data[project_index].images.length);

		check_image_loaded('.overlay_content');

	});

	$(document).on('click','#canvas_overlay',function(){

		// console.log(slider_index,  data[project_index].images.length)
		if (slider_index !=  data[project_index].images.length ) {
			slider_index++;
		} else {
			slider_index = 1;
		}
		$('.pagination').html(slider_index+' – '+data[project_index].images.length);

		$('.overlay_content img').attr('src', 'img/'+(project_index+1)+'/'+slider_index+'.jpg');
		check_image_loaded('.overlay_content');
	});

	$('.close').click(function() {
		$('.overlay_content').hide();	
		$('body').removeClass('show_content');
	})

	$(document).on('click','.menu_trigger',function(){
		$('body').toggleClass('show_menu');
		$('body').removeClass('show_about');
	});
	$(document).on('click','.logo',function(){
		$('body').toggleClass('show_about');
		$('body').removeClass('show_menu');
	});


	// alert('Roboto loaded? ' + document.fonts.check('1em Roboto'));  // false

	// document.fonts.ready.then(function () {
	//   // alert('All fonts in use by visible text have loaded.');
	//    // alert('Roboto loaded? ' + document.fonts.check('1em Roboto'));  // true
	// });
