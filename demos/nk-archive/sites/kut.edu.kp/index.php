<!DOCTYPE html>
<html lang="en">
<head>
	<title>Kim Chaek University of Technology</title>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Kim Chaek University of Technology, great leadership, brilliant leadership, education, research">
	<meta name="keyword" content="Kim Chaek University of Technology Site">
	<meta name="robots" content="all">
	<link rel="shortcut icon" type="image/png" href="/assets/img/favicon.png">
	<link rel="stylesheet" href="/assets/css/all.min.css">
	<link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="/assets/css/owl.carousel.css">
	<link rel="stylesheet" href="/assets/css/magnific-popup.css">
	<link rel="stylesheet" href="/assets/css/animate.css">
	<link rel="stylesheet" href="/assets/css/meanmenu.min.css">
	<link rel="stylesheet" href="/assets/css/responsive.css">
	<link rel="stylesheet" href="/assets/css/style.css">    
	<link rel="stylesheet" href="/assets/css/responsive.css">
	<link rel="stylesheet" href="/assets/css/custom.css">

	<link rel="stylesheet" href="/assets/css/base.en.css">
	<link rel="stylesheet" href="/assets/css/inner.en.css">
	<link rel="stylesheet" href="/assets/css/main.en.css">
	<link rel="stylesheet" href="/assets/css/modal.en.css">

	<link rel="stylesheet" href="/assets/css/responsiveslides.css">
</head>


<script src="/assets/js/jquery-1.11.3.min.js"></script>
<script src="/assets/bootstrap/js/bootstrap.min.js"></script>
<script src="/assets/js/jquery.countdown.js"></script>
<script src="/assets/js/jquery.isotope-3.0.6.min.js"></script>
<script src="/assets/js/waypoints.js"></script>
<script src="/assets/js/owl.carousel.min.js"></script>
<script src="/assets/js/jquery.magnific-popup.min.js"></script>
<script src="/assets/js/jquery.meanmenu.min.js"></script>
<script src="/assets/js/sticker.js"></script>
<script src="/assets/js/main.js"></script>
<script src="/assets/js/jquery.superslides.min.js"></script>

<script src="/assets/js/jq.js" type="text/javascript"></script>
<script src="/assets/js/slider.js" type="text/javascript"></script>

<script src="/assets/js/responsiveslides.min.js"></script>
<script>
	$(function () {
		$("#slider").responsiveSlides({
			auto: false,
			pager: true,
			speed: 500,
			timeout: 3000,
			maxwidth: 1000
		});
	});
	$(function () {
		$("#sliderW800").responsiveSlides({
			auto: false,
			pager: true,
			speed: 500,
			timeout: 3000,
			maxwidth: 800
		});
	});
	$(function(){
		$('#wrapper').bind('contextmenu', function(e){
		return false;
		});

		$('#Bimg').bind('contextmenu', function(e){
            return false;
         });
	});


	window.addEventListener("mousewheel",
	function(e) {
	if (e.ctrlKey == true || e.metaKey == true || e.ctrlKey == "true" || e.metaKey == "true")
	e.preventDefault();
	},
	{ capture: false, passive: false, once: false }
	);
	// mozilla
	window.addEventListener("DOMMouseScroll",
	function(e) {
	if (e.ctrlKey == true || e.metaKey == true || e.ctrlKey == "true" || e.metaKey == "true")
	e.preventDefault();
	},
	{ capture: false, passive: false, once: false }
	);
	// 기타
	window.addEventListener("onmousewheel",
	function(e) {
	if (e.ctrlKey == true || e.metaKey == true || e.ctrlKey == "true" || e.metaKey == "true")
	e.preventDefault();
	},
	{ capture: false, passive: false, once: false }
	);


	document.addEventListener("keydown",
	function(e) {
	if (
	e.keyCode == '25' ||
	e.keyCode == '61' ||
	e.keyCode == '229' ||
	e.keyCode == '173' ||
	e.keyCode == '17' ||
	e.keyCode == '187' ||
	e.keyCode == '189' ||
	e.keyCode == '109' ||
	e.keyCode == '107'
	) {
	e.preventDefault();
	return false;
	}
	});


	$(function(){
		$("#academicList li div a").click(function(){
				act1(this);
			}
		)
		function act1(actobj,act)
		{
			if(act){
				if(act=="slideDown"){$(actobj).parent().is(".focus")?"":$(actobj).parent().addClass("focus");
				}
				if(act=="slideUp"){$(actobj).parent().is(".focus")?$(actobj).parent().removeClass("focus"):"";
				}
				
				eval('$(actobj).parent().next("ul").'+act+"('fast')");
			}else
			{
				$(actobj).parent().is(".focus")?$(actobj).parent().removeClass("focus"):$(actobj).parent().addClass("focus");

				$(actobj).parent().next("ul").is(":visible")?$(actobj).parent().next("ul").slideUp("fast"):$(actobj).parent().next("ul").slideDown('fast');
			}
		}
	})
</script><header>
	<!--PreLoader-->
	<div class="loader">
	    <div class="loader-inner">
	        <div class="circle"></div>
	    </div>
	</div>
	
	<!--PreLoader Ends-->

	<!-- header -->
	<div class="top-header-area" id="sticker">
		<div class="container" style="max-width: 100% !important">
			<div class="row">
				<div class="col-lg-12 col-sm-12 text-center">
					<div class="main-menu-wrap">
						<!-- logo -->
						<div class="site-logo">
							<a href="/index.php">
								<img src="/assets/img/logo.png" alt="logo" />
							</a>
						</div>
						<!-- logo -->

						<!-- menu start -->
						<nav class="main-menu">
							<ul>
								<li class="current-list-item"><a href="/index.php">Home</a></li><li class="nav-item "><a href="/index.php/greatleadership?menu_id=2&page=1" style="display:inline">Great Leadership</a>
															</li><li class="nav-item dropdown "><a href="javascript:;" style="display:inline">About</a>
															<ul class="sub-menu"><li><a class="dropdown-item" href="/index.php/page?menu_id=3&submenu_id=3">Mission</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=3&submenu_id=4">Emblem</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=3&submenu_id=5">Structures</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=3&submenu_id=6">Campus</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=3&submenu_id=7">Apartment Houses for Teachers</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=3&submenu_id=8">Professors</a></li></ul></li><li class="nav-item dropdown "><a href="javascript:;" style="display:inline">Education</a>
															<ul class="sub-menu"><li><a class="dropdown-item" href="/index.php/page?menu_id=4&submenu_id=10">Undergraduate</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=4&submenu_id=11">Graduate School</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=4&submenu_id=12">School of Science and Engineering</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=4&submenu_id=13">Refresher Education</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=4&submenu_id=14">On-line Education</a></li></ul></li><li class="nav-item dropdown "><a href="javascript:;" style="display:inline">Research</a>
															<ul class="sub-menu"><li><a class="dropdown-item" href="/index.php/page?menu_id=5&submenu_id=15">Research Project</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=5&submenu_id=16">Intellectual Property</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=5&submenu_id=17">Forums and Public Presentations</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=5&submenu_id=25">Paper Publication to SCI Journals</a></li></ul></li><li class="nav-item dropdown "><a href="javascript:;" style="display:inline">Campus Life</a>
															<ul class="sub-menu"><li><a class="dropdown-item" href="/index.php/page?menu_id=6&submenu_id=18">Colourful Activities</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=6&submenu_id=19">Arts</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=6&submenu_id=20">Sports</a></li></ul></li><li class="nav-item dropdown "><a href="javascript:;" style="display:inline">International</a>
															<ul class="sub-menu"><li><a class="dropdown-item" href="/index.php/page?menu_id=7&submenu_id=21">Friendship</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=7&submenu_id=22">International Cooperation</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=7&submenu_id=23">International Competition</a></li><li><a class="dropdown-item" href="/index.php/page?menu_id=7&submenu_id=24">Contacts</a></li></ul></li>								<li><a href="javascript:;">English</a><ul class="sub-menu"><li><a href="javascript:set_lang('kp');" style="font-family: SelfChonRiMa !important;">조선어</a></li><li><a href="javascript:set_lang('cn');">汉语</a></li><li><a href="javascript:set_lang('ru');">Русский</a></li></ul></li>								<li>
									<div class="header-icons">
										<a class="mobile-hide search-bar-icon"><i class="fas fa-search"></i></a>
									</div>
								</li>
							</ul>
						</nav>
						<a class="mobile-show search-bar-icon"><i class="fas fa-search"></i></a>
							<div class="mobile-menu"></div>
						<!-- menu end -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- end header -->
</header>
<main style="display: unset">
	<div class="custom_modal" id="search_modal">
		<div class="modal-backdrop" onclick="javascript:$('#search_modal').css('display', 'none')" style="z-index:-1; opacity: 0.2"></div>
	    <div class="custom_modal_content" style="width:50%;">
	        <div class="custom_modal_body" id="" style="padding:10px;">                
	            <div class="row">
					<div class="col-lg-12">
						<span class="close-btn" onclick="javascript:$('#search_modal').css('display', 'none')"
							><i class="fas fa-window-close" style="font-size: 20px"></i>
						</span>
						<div class="search-bar" style="margin-top: 30px; margin-bottom: 10px; text-align: center">
							<div class="search-bar-tablecell">
								<h3 style="font-size: 20px; font-weight: bold">Search:</h3>
								<input type="text" id="search_keyword" placeholder="" onkeydown="if(event.key == '#' || event.key == '&'){ $('#search_keyword').css('background', 'red'); return false; } else { $('#search_keyword').css('background', 'none'); if(event.keyCode == 13) search();}" autocomplete="off" />
								<button type="submit" onclick="javascript: search();">Search <i class="fas fa-search"></i></button>
							</div>
						</div>
					</div>
				</div>
	        </div>
	    </div>
	</div>
	<!-- end search area -->
	<a id="scroll-to-top" class="hvr-radial-out" href="#" style="display: inline; z-index: 2">
		<i class="fa fa-angle-up"></i>
	</a>

	<a id="scroll-to-top" class="hvr-radial-out" onclick="javascript: window.open('http://www.dprkportal.kp', '_blank')" style="display: inline;width: 100px; border-radius: 0%;z-index: 2;left: 20px !important; line-height: 30px;">
		<img src="/assets/img/portal.jpg" alt="portal" style="height: 100%" />
	</a>

	<script type="text/javascript">
		function set_lang(lang_kind)
		{
			$.post("/index.php/first/set_lang",
			{
				lang_kind : lang_kind
			},
			function e(data, statue){
				if(statue==true || statue=='success')
					document.location.href = window.location.href;
			})
		}

		function search()
		{
			var search_keyword = $("#search_keyword").val();
			search_keyword = search_keyword.replace(/#/g, '');
			search_keyword = search_keyword.replace(/&/g, '');
			// 검색어에 대한 검사진행
			if(search_keyword == '') { $("#search_keyword").val(''); $("#search_keyword").foucs(); return;}
			// 공백단위로 분류
			var a = search_keyword.split(' ');

			var search_body = '';
			for (var i = 0; i < a.length; i++) {
				if(search_body == '')
					search_body += a[i];
				else
					search_body += '+'+a[i];
			}

			$("#search_modal").val('');
			$("#search_modal").css('display', 'none');

			window.open("/index.php/search?menu_id=3000&page=1&keyword="+search_body, "_self");
		}

		$(".search-bar-icon").click('on', function(){
			$("#search_modal").css('display', 'block');
		});
	</script>


<!-- slider -->
<div class="homepage-slider">
		<div itemscope class="single-homepage-slider homepage-bg-1" style="height: 100%; opacity: 0.7; background-color: #accbf1">
		<img itemprop="image" src="/assets/img/slider/Slider1.jpg" style="height: 100%; opacity: 0.5; background-color: #accbf1" />
	</div>
		<div itemscope class="single-homepage-slider homepage-bg-1" style="height: 100%; opacity: 0.7; background-color: #accbf1">
		<img itemprop="image" src="/assets/img/slider/Slider2.jpg" style="height: 100%; opacity: 0.5; background-color: #accbf1" />
	</div>
		<div itemscope class="single-homepage-slider homepage-bg-1" style="height: 100%; opacity: 0.7; background-color: #accbf1">
		<img itemprop="image" src="/assets/img/slider/Slider3.jpg" style="height: 100%; opacity: 0.5; background-color: #accbf1" />
	</div>
		<div itemscope class="single-homepage-slider homepage-bg-1" style="height: 100%; opacity: 0.7; background-color: #accbf1">
		<img itemprop="image" src="/assets/img/slider/Slider4.jpg" style="height: 100%; opacity: 0.5; background-color: #accbf1" />
	</div>
		<div itemscope class="single-homepage-slider homepage-bg-1" style="height: 100%; opacity: 0.7; background-color: #accbf1">
		<img itemprop="image" src="/assets/img/slider/Slider5.jpg " style="height: 100%; opacity: 0.5; background-color: #accbf1" />
	</div>
	</div>
<!-- end slider -->

<!-- leadership-section -->
<div class="leadership-section mt-80 pb-80">
	<div class="container">
		<div class="row">
			<div class="col-lg-8 offset-lg-2 text-center">
				<div class="section-title" itemscope>	
					<h3 itemprop="title"><span class="red-text">Brilliant LeaderShip</span> </h3>
					<p></p>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-10 offset-lg-1 text-left">
				<div class="testimonial-sliders">
										<div class="single-testimonial-slider">
						<div class="client-meta" itemscope>
							<h3 class=" text-center" itemprop="title">With Heart of Mother</h3>
							<p class="">
								With the holiday of February approaching, Chairman <nobr><b style='font-size: 115%; font-weight: bold;'>Kim Jong Il</b></nobr> happened to learn that the officials were racking their brains over his birthday spread, and flatly declined it.
A few days later when ...							</p>
							<div class="last-icon text-center">
								<a href="/index.php/leadership?menu_id=2000&leadership_id=209" class="boxed-btn">Detail</a>
							</div>
						</div>
					</div>
										<div class="single-testimonial-slider">
						<div class="client-meta" itemscope>
							<h3 class=" text-center" itemprop="title">Going Only with Roast Potatoes</h3>
							<p class="">
								Once Chairman <nobr><b style='font-size: 115%; font-weight: bold;'>Kim Jong Il</b></nobr> was on the field guidance to Taehongdan County.
Time passed a lot, so the Chairman happened to have lunch there. 
When he pulled up at a vacant lot ...							</p>
							<div class="last-icon text-center">
								<a href="/index.php/leadership?menu_id=2000&leadership_id=210" class="boxed-btn">Detail</a>
							</div>
						</div>
					</div>
										<div class="single-testimonial-slider">
						<div class="client-meta" itemscope>
							<h3 class=" text-center" itemprop="title">Cherished View of Arms</h3>
							<p class="">
								One day in June 1995, Chairman <nobr><b style='font-size: 115%; font-weight: bold;'>Kim Jong Il</b></nobr> said meaningful words about arms, sitting together with some commanding officers of the Korean People’s Army.
He said:
I value and love a pistol most. ...							</p>
							<div class="last-icon text-center">
								<a href="/index.php/leadership?menu_id=2000&leadership_id=211" class="boxed-btn">Detail</a>
							</div>
						</div>
					</div>
										<div class="single-testimonial-slider">
						<div class="client-meta" itemscope>
							<h3 class=" text-center" itemprop="title">Most Precise Prescription</h3>
							<p class="">
								One day in December 2016, the respected Comrade <nobr><b style='font-size: 115%; font-weight: bold;'>Kim Jong Un</b></nobr> visited December 6 Children’s Camp of Kangwon Province, which was magnificently built on the scenic seashore.
Noting that they produced finishing materials ...							</p>
							<div class="last-icon text-center">
								<a href="/index.php/leadership?menu_id=2000&leadership_id=208" class="boxed-btn">Detail</a>
							</div>
						</div>
					</div>
										<div class="single-testimonial-slider">
						<div class="client-meta" itemscope>
							<h3 class=" text-center" itemprop="title">Historic Event</h3>
							<p class="">
								It was when the liberated country was inundated with joy over the historic proclamation of the Law on Sex Equality.
One day President <nobr><b style='font-size: 115%; font-weight: bold;'>Kim Il Sung</b></nobr> heard from some women officials that the ...							</p>
							<div class="last-icon text-center">
								<a href="/index.php/leadership?menu_id=2000&leadership_id=206" class="boxed-btn">Detail</a>
							</div>
						</div>
					</div>
										<div class="single-testimonial-slider">
						<div class="client-meta" itemscope>
							<h3 class=" text-center" itemprop="title">Benevolence</h3>
							<p class="">
								One day in September 1961, President <nobr><b style='font-size: 115%; font-weight: bold;'>Kim Il Sung</b></nobr> paid a visit to Pyongyang Hotel (then) to meet the delegates to the historical 4th Congress of the Workers’ Party of Korea and ...							</p>
							<div class="last-icon text-center">
								<a href="/index.php/leadership?menu_id=2000&leadership_id=207" class="boxed-btn">Detail</a>
							</div>
						</div>
					</div>
									</div>
			</div>
		</div>
	</div>
</div>
<!-- end leadership-section -->

<!-- news -->
<div class="latest-news pt-80 mb-80">
	<div class="container">

		<div class="row">
			<div class="col-lg-8 offset-lg-2 text-center">
				<div class="section-title" itemscope>	
					<h3><span class="blue-text" itemprop="title">News</span> </h3>
					<p></p>
				</div>
			</div>
		</div>

		<div class="row">
							<div class="col-lg-4 col-md-6">
					<div class="single-latest-news" style="height: 500px">
						<a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1057"><div class="latest-news-bg news-bg-1"style="background-image: url(/assets/img/news/thumb1017.png)"></div></a>
						<div class="news-text-box">
							<div style="height: 80px;">
							<h3>
								<span class="label-danger">News</span>								<a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1057" style="font-weight: bold; font-size: 20px">Accuracy Improvement of Resonant Sensor in Measurem...</a></h3>
							</div>
							<div style="height: 40px">
							<p class="blog-meta">
								<span class="author"><i class="fas fa-user"></i> Jo </span>
								<span class="date"><i class="fas fa-calendar"></i> Dec 30, 2025</span>
															</p>
							</div>
							<div class="excerpt" style="height: 80px; overflow-y: hidden; font-size: 14px; line-height: 1.8">
							<p>Density and viscosity are important quantities which describe the physical properties of liquid, and density is the most important thermo-physical property of hybrid nanofluids.</p>
<p>Many methods were proposed for density measurement of density or viscosity alone. Resonant sensors can measure density and viscosity simultaneously, so it has many applications in the fields of physical or chemical sensing in liquid.</p>
<p>In the measurement of liquid density and viscosity, the change of resonance parameters due to the parasitic parallel capacitance of resonator affects measurement accuracy.</p>
<p>In order to improve accuracy, An Nam Chol, a section head at the Faculty of Electronics, proposed a method for compensating the parasitic parallel capacitance of resonator by adding an electrode. In addition, he modeled a resonant sensor with a compensation electrode and determined the structural parameters through simulations and experiments.</p>
<p>He conducted some experiments to examine the effect of this method. The experimental results show that this method is valuable for compensation of parasitic parallel capacitance of an immersed resonant sensor in liquid.</p>
<p>You can find the details in his paper <a class="jjh" href="https://doi.org/10.1108/SR-04-2024-0289">“Accuracy improvement of resonant sensor by an additional electrode in the measurement of liquid density and viscosity”</a> in “Sensor Review” (SCI).</p>
							</div>
							<p>...</p>
							<div>
							<a class="read-more-btn" href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1057">Detail <i class="fas fa-angle-right"></i></a>
							</div>
						</div>
					</div>
				</div>
							<div class="col-lg-4 col-md-6">
					<div class="single-latest-news" style="height: 500px">
						<a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1056"><div class="latest-news-bg news-bg-1"style="background-image: url(/assets/img/news/thumb1016.png)"></div></a>
						<div class="news-text-box">
							<div style="height: 80px;">
							<h3>
								<span class="label-danger">News</span>								<a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1056" style="font-weight: bold; font-size: 20px">Analysis of Degradation Mechanisms due to Hot Carri...</a></h3>
							</div>
							<div style="height: 40px">
							<p class="blog-meta">
								<span class="author"><i class="fas fa-user"></i> Jo </span>
								<span class="date"><i class="fas fa-calendar"></i> Dec 29, 2025</span>
															</p>
							</div>
							<div class="excerpt" style="height: 80px; overflow-y: hidden; font-size: 14px; line-height: 1.8">
							<p>IGBT is a high-voltage high-power integrated circuit device and has a wide range of high-power switching applications such as mobile driving, power supply, railway transportation, industry control, etc.</p>
<p>The NPT-IGBT is a composite device of MOSFET and BJT. Since NPT-IGBT usually operates at high voltage and strong current, hot-carrier-induced degradation will be generated inside the device. Hot carriers with high energy will damage the oxide region of the device and the interface between silicon and silicon-dioxide, and will increase the trap charge of the interface and the oxide region.</p>
<p>Many researchers have described the issues on hot carriers of IGBT device, However, there have been reported a little literature that dealt with the reliability of hot carriers of NPT-IGBT.</p>
<p>Kim Hak Bong, a section head at the Institute of Semiconductor, analyzed the degradation mechanisms due to the hot carrier effect in NPT-IGBT through the voltage stress measurement, TCAD simulation and charge pumping measurement.</p>
<p>The results of the voltage stress measurement, TCAD simulation and the charge pumping measurement were consistent with the theoretical analysis.</p>
<p>For more information, you can refer to his paper <a class="jjh" href="https://doi.org/10.1016/j.sse.2024.109002">“Analysis on Effect of Hot-Carrier-Induced Degradation of NPT-IGBT”</a> in “Solid-State Electronics” (SCI).</p>
							</div>
							<p>...</p>
							<div>
							<a class="read-more-btn" href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1056">Detail <i class="fas fa-angle-right"></i></a>
							</div>
						</div>
					</div>
				</div>
							<div class="col-lg-4 col-md-6">
					<div class="single-latest-news" style="height: 500px">
						<a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1055"><div class="latest-news-bg news-bg-1"style="background-image: url(/assets/img/news/thumb1015.png)"></div></a>
						<div class="news-text-box">
							<div style="height: 80px;">
							<h3>
																<a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1055" style="font-weight: bold; font-size: 20px">Estimation of Platform Motion at Lower Loading Stat...</a></h3>
							</div>
							<div style="height: 40px">
							<p class="blog-meta">
								<span class="author"><i class="fas fa-user"></i> Jo </span>
								<span class="date"><i class="fas fa-calendar"></i> Dec 28, 2025</span>
															</p>
							</div>
							<div class="excerpt" style="height: 80px; overflow-y: hidden; font-size: 14px; line-height: 1.8">
							<p>The Trucklift slope hoisting system is an innovative transport technology for open-pit mines, and it considerably accelerates and cheapens transport from mines.</p>
<p>When a truck drives onto or off the platform at the lower loading station in the Trucklift slope hoisting system with varying profile of track, the platform motion influences the operation of the Trucklift slope hoisting system, and the configuration of inclined ropes hitched to the platform is varied.</p>
<p>In order to estimate the movement of platform at the lower loading station when a truck drives off or onto the platform, the movement of the truck on the platform and the lower loading station and the effect of sagged inclined ropes hitched to the platform should be considered simultaneously. The platform motion is related to not only the profile of track and parameters of truck and platform, but also the parameters of sagged inclined ropes hitched to the platform.</p>
<p>Kim Kwang Hyok, a researcher at the Faculty of Mining Engineering, has investigated the platform motion with consideration of sagged inclined ropes when a truck drives off or onto a platform at the lower loading station in the Trucklift slope hoisting system with varying profile of track. He proposed a system of non-linear equations to furnish an explicit solution for extensible sagged inclined ropes with edges on the inclined track, simulated platform motion by using the ADAMS software, and modeled the sagged inclined ropes hitched to the platform as a flexible body with consideration of elasticity and bend.</p>
<p>The simulation result shows that the displacement of platform is not considerable in comparison with the diameter of a tire, and proper design of a lower loading station enables safe movement of trucks on the platform without arresters.</p>
<p>You can find the details in his paper <a class="jjh" href="https://doi.org/10.22044/jme.2023.12490.2267">“Platform Motion at Lower Loading Station in Trucklift Slope Hoisting System with Varying Profile of Track”</a> in “Journal of Mining and Environment” (SCI).</p>
							</div>
							<p>...</p>
							<div>
							<a class="read-more-btn" href="/index.php/news?menu_id=1000&submenu_id=100&news_id=1055">Detail <i class="fas fa-angle-right"></i></a>
							</div>
						</div>
					</div>
				</div>
					</div>
		<div class="row">
			<div class="col-lg-12 text-center">
				<a href="/index.php/news?menu_id=1000&amp;submenu_id=100&page=1" class="boxed-btn">Show more</a>
			</div>
		</div>
	</div>
</div>
<!-- end news -->

<!-- advertisement section -->
<div class="abt-section mb-80">
	<div class="container">
		<div class="row">
			<div class="col-lg-6 col-md-12">
				<video id="myVideo" autoplay loop style="border-radius: 10px;width: 100%">
				  <source id="mp4_src" src = "/assets/video/8.mp4" type="video/mp4">
				</video>
			</div>
			<div class="col-lg-6 col-md-12">
				<div class="abt-text" style="padding: 0px">
					<h2 style="font-size: 20px; font-weight: bold;text-align: center">“Aggregated Blood Cells Separating Lamina” cleaning the blood</h2>
					<p><p>The scientists and researchers of Kim Chaek University of Technology developed a simple medical instrument using “Aggregated blood cells separating lamina” which radiates far infrared rays capable good health by cleaning the human blood.</p></p>
					<p class="top-sub">Nov 15, 2024</p>
 				</div>
			</div>
		</div>
	</div>
</div>
</div>
</main>
<footer>
	<!-- logo carousel -->
	<div class="logo-carousel-section">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<div class="logo-carousel-inner">
						<div class="single-logo-item" title="New Discovery – Statistical Formalism of Quantum Mechanics" style="cursor: pointer"><a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=257"><img src="/assets/img/news/article226.jpg" alt="" /></div></a><div class="single-logo-item" title="Winning Streak in Codechef Challenges" style="cursor: pointer"><a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=290"><img src="/assets/img/news/article248.jpg" alt="" /></div></a><div class="single-logo-item" title="Scattering Property of Aqueous Solution of CdTe Quantum dots with Gold Nanoparticles" style="cursor: pointer"><a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=318"><img src="/assets/img/news/article277.jpg" alt="" /></div></a><div class="single-logo-item" title="Various Types of Energy Conservational Boilers" style="cursor: pointer"><a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=403"><img src="/assets/img/news/article350.jpg" alt="" /></div></a><div class="single-logo-item" title="Agglutinated Blood Cell Splitting Flake" style="cursor: pointer"><a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=410"><img src="/assets/img/news/article357.jpg" alt="" /></div></a><div class="single-logo-item" title="Monument to Mausoleum of King Kwanggaetho, Symbol of Spirit of Koguryo" style="cursor: pointer"><a href="/index.php/news?menu_id=1000&submenu_id=100&news_id=414"><img src="/assets/img/news/article361.jpg" alt="" /></div></a>					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- end logo carousel -->

	<!-- footer -->
	<div class="footer-area">
		<div class="container">
			<div class="row">
				<div class="col-lg-3 col-md-6"><div class="footer-box pages"><h2 class="widget-title">About</h2><ul><li><a href="/index.php/page?menu_id=3&submenu_id=4">Emblem</a></li><li><a href="/index.php/page?menu_id=3&submenu_id=5">Structures</a></li><li><a href="/index.php/page?menu_id=3&submenu_id=6">Campus</a></li></ul></div></div><div class="col-lg-3 col-md-6"><div class="footer-box pages"><h2 class="widget-title">Education</h2><ul><li><a href="/index.php/page?menu_id=4&submenu_id=10">Undergraduate</a></li><li><a href="/index.php/page?menu_id=4&submenu_id=11">Graduate School</a></li><li><a href="/index.php/page?menu_id=4&submenu_id=12">School of Science and Engineering</a></li><li><a href="/index.php/page?menu_id=4&submenu_id=13">Refresher Education</a></li></ul></div></div><div class="col-lg-3 col-md-6"><div class="footer-box pages"><h2 class="widget-title">Research</h2><ul><li><a href="/index.php/page?menu_id=5&submenu_id=15">Research Project</a></li><li><a href="/index.php/page?menu_id=5&submenu_id=16">Intellectual Property</a></li><li><a href="/index.php/page?menu_id=5&submenu_id=17">Forums and Public Presentations</a></li><li><a href="/index.php/page?menu_id=5&submenu_id=25">Paper Publication to SCI Journals</a></li></ul></div></div>				<div class="col-lg-3 col-md-6">
					<div class="footer-box get-in-touch">
						<h2 class="widget-title">Contacts</h2>
						<ul>
							<li>Address:  Kyogu-dong, Central District, Yonggwang Street, Pyongyang, DPR Korea</li>
							<li>E-mail:    kut@star-co.net.kp</li>
							<li>085 02 381 18111</li>
						</ul>
					</div>
				</div>
				
			</div>
		</div>
	</div>
	<!-- end footer -->

	<!-- copyright -->
	<div class="copyright">
		<div class="container">
			<div class="row">
				<div class="col-lg-12 col-md-12">
					<p>© 2025 Kim Chaek University of Technology</p>
				</div>
			</div>
		</div>
	</div>
	<!-- end copyright -->
</footer>