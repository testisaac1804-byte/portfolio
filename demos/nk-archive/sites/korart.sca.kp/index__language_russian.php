<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=0'>
	<meta name="msapplication-TileColor" content="#0f75ff">
	<meta name="theme-color" content="#2ddcd3">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="HandheldFriendly" content="True">
	<meta name="MobileOptimized" content="320">
	<meta name="author" content="RHB, CIS, OGS">
	<meta name="keywords" content="조선예술, korean, art" />
	<link rel="icon" href="assets/images/mark_white.png">
	<!-- Title -->
	<title>
		Корейское Искусство	</title>

	<style type="text/css">
		@font-face {
			font-family: 'KP CheonRiMa';
			src:url(https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/fonts/ryugclm1.ttf);
		}
	</style>

	<!-- Bootstrap Css -->
	<link href="assets/plugins/bootstrap-4.1.3/css/bootstrap.css" rel="stylesheet" />
	<!-- Dashboard Css -->
	<link href="assets/default/css/dashboard.css" rel="stylesheet" />
	<link href="assets/extraplugin/css/theme-elements.css" rel="stylesheet" />
	<!-- Font-awesome  Css -->
	<link rel="stylesheet" href="assets/default/fonts/fonts/font-awesome.min.css">
	<!--Horizontal Menu-->
	<link href="assets/plugins/Horizontal2/Horizontal-menu/dropdown-effects/fade-down.css" rel="stylesheet" />
	<link href="assets/plugins/Horizontal2/Horizontal-menu/horizontal.css" rel="stylesheet" />
	<link href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/plugins/Horizontal2/Horizontal-menu/color-skins/color.css" rel="stylesheet" />
	<link href="assets/plugins/accordion/accordion.css" rel="stylesheet" />
	<!-- c3.js Charts Plugin -->
	<link href="assets/plugins/gallery/gallery.css" rel="stylesheet">
	<!-- Owl Theme css-->
	<link href="assets/plugins/owl-carousel/owl.carousel.css" rel="stylesheet" />
	<!-- Custom scroll bar css-->
	<link href="assets/plugins/scroll-bar/jquery.mCustomScrollbar.css" rel="stylesheet" />
	<link href="assets/plugins/tabs/style.css" rel="stylesheet" />
	<link href="assets/global/css/plugins-md-rtl.css" rel="stylesheet" />


	<!-- <link href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/plugins/ecomerce/jquery.exzoom.css" rel="stylesheet"> -->

	<link href="assets/default/css/stage.css" rel="stylesheet">
	<link href="assets/default/css/nav.css" rel="stylesheet">
	<link href="assets/new/css.css" rel="stylesheet">
	<link href="assets/new/style.css" rel="stylesheet">
			<link href="assets/extraplugin/css/theme.css" rel="stylesheet">
			<link href="assets/extraplugin/vendor/rs-plugin/css/settings.css" rel="stylesheet">
			<link href="assets/global/css/plugins-md-rtl.css" rel="stylesheet">
			<link href="assets/default/css/nav.css" rel="stylesheet">
			<!--Font icons-->
	<link href="assets/plugins/iconfonts/plugin.css" rel="stylesheet">
	<link href="assets/plugins/iconfonts/icons.css" rel="stylesheet">

	<!-- Main Stylesheet File -->
	<link href="assets/pages/common/style.css" rel="stylesheet">

	<link href="assets/pages/common/css/animate.min.css" rel="stylesheet">
</head>


<body>
	<!--Loader-->
	<!-- <div id="loading"></div> -->
	
<div class="header-main russian-font">

	<div class="my_header" style="">
		<div class="top-bar" data-select2-id="15">
			<div class="container" data-select2-id="14">
				<div class="row" data-select2-id="13">
					<div class="col-xl-8 col-lg-8 col-sm-4 col-7" data-select2-id="12">
						<div class="top-bar-left d-flex" data-select2-id="11">
							<div class="clearfix">
							</div>
						</div>
					</div>
					<div class="col-xl-4 col-lg-4 col-sm-8 col-5">
						<div class="top-bar-right">
							<ul class="custom">
								<li class="dropdown">
									<a href="#" class="text-dark" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-search mr-1"></i><span> Поиск</span></a>
									<div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow" style="padding: 5px; min-width: 18rem !important;">
										<div class="input-group icon-quote-right russian-font">
											<input type="text" class="form-control br-tl-7 br-bl-7" name="totalSearch" id="totalSearch" value="" placeholder="Напишите слово поиска." onkeyup="totalSearch(event,this);">
											<div class="input-group-append ">
												<button type="button" onclick="javascript:Total_Search();" class="btn btn-primary br-tr-7 br-br-7">
													Поиск												</button>
											</div>
										</div>
									</div>
								</li>
								<li class="dropdown">
									<a href="#" class="text-dark" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-language mr-1"></i><span> Язык</span></a>
									<div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
																				<a href="/index.php?language=korean" class="dropdown-item">
											조선어
										</a>
										<a style="font-family: 'Times New Roman';" href="/index.php?language=english" class="dropdown-item">
											English
										</a>
										<a style="font-family: 'Simsun';" href="/index.php?language=chinese" class="dropdown-item">
											中文
										</a>
										<a style="font-family: 'Times New Roman';" href="/index.php?language=russian" class="dropdown-item">
											Pусский
										</a>

									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Mobile Header -->
		<div class="horizontal-header clearfix " style="background-color: red;">
			<!-- <div class="container"> -->
			<a id="horizontal-navtoggle" class="animated-arrow"><span></span></a>
			<a href="index.php/home/mindex__language_korean">
				<span class="smllogo">
										<img src="assets/images/logo_ru.png" height="35px" alt="" />
				</span>
			</a>
		</div>
		<!--/Mobile Header -->

		<div class="horizontal-main my_container clearfix">
			<div class="horizontal-mainwrapper clearfix" style="background-size:100% auto;">
				<div class="desktoplogo" style="width:20%; margin-left:50px;">
					<a href="index__language_korean.php">
												<img src="assets/images/logo_ru.png" alt="logo">
					</a>
				</div>
				<!--Nav-->
				<nav class="horizontalMenu clearfix d-md-flex russianMenu navcenter">
					<ul class="horizontalMenu-list" style=" margin-right: 20px;text-align: center !important;">
						<!-- 불멸의 령도 -->
						<li aria-haspopup="true" style="line-height: 20px !important; padding_bottom: 0px !important;">
							<a style="padding-left: 7px !important; padding-right: 7px !important;"  href="index.php/leader/news__kind_1_language_korean">
								Испытанное <br />руководство																	<span class="badge badge-danger nav-badge-total">5</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">

								<li aria-haspopup="true">
									<a href="index.php/leader/news__kind_1_language_korean">
										Испытанное руководство																					<span class="badge badge-danger nav-badge pull-right">1</span>
																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/leader/theory__language_korean">
										Чучхейская теория литературы и искусства																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/leader/story__language_korean">
										Революционный эпизод																					<span class="badge badge-danger nav-badge pull-right">4</span>
																			</a>
								</li>
							</ul>
						</li>
						<!-- 작품감상 -->
						<li aria-haspopup="true" style="line-height: 20px !important; padding_bottom: 0px !important;">
							<a style="padding-left: 7px !important; padding-right: 7px !important;" >
								Художественное<br>произведение																	<span class="badge badge-danger nav-badge-total">67</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/stage/productions__language_korean">
										Сценическое <br />искусство																					<span class="badge badge-danger nav-badge pull-right">19</span>
																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/art/productions__language_korean">
										Изобразительное <br>искусство																					<span class="badge badge-danger nav-badge pull-right">48</span>
																			</a>
								</li>

							</ul>
						</li>
						<!-- 예술행사, 경연 -->
						<li aria-haspopup="true" style="line-height: 20px !important; padding_bottom: 0px !important;">
							<a style="padding-left: 7px !important; padding-right: 7px !important;" >
								Художественное <br>мероприятие, конкурс																	<span class="badge badge-danger nav-badge-total">16</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">
																<li aria-haspopup="true">
									<a href="index.php/people_festival/introduction__language_korean">
										Народный художественный фестиваль «Апрельская весна»																			</a>
								</li>
																																<li aria-haspopup="true">
									<a href="index.php/personal_contest/introduction__language_korean">
										Конкурс отдельных профессионалов на худ. приз «16 февраля»																			</a>
								</li>
																								<li aria-haspopup="true">
									<a href="index.php/musical_contest/introduction__language_korean">
										Пхеньянский международный конкурс вокалистов																			</a>
								</li>
																								<li aria-haspopup="true">
									<a href="index.php/art_contest/introduction__language_korean">
										Художественная выставка																			</a>
								</li>
																<li aria-haspopup="true">
									<a href="index.php/april__language_korean">
										Художественный фестиваль дружбы «Апрельская весна»																					<span class="badge badge-danger nav-badge pull-right">16</span>
																			</a>
								</li>
							</ul>
						</li>
						<!-- 예술교육 -->
						<li aria-haspopup="true" style="line-height: 20px !important; padding_bottom: 0px !important;">
							<a style="padding-left: 7px !important; padding-right: 7px !important;" >
								Образование <br />по искусству																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>
							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/education/introduction__language_korean">
										Обзор									</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/education/organ_detail__language_korean">
										Учебные заведения в системе искусства																			</a>
								</li>
							</ul>
						</li>
						<!-- 기관소개 -->
						<li aria-haspopup="true" style="line-height: 20px !important; padding_bottom: 0px !important;">
							<a style="padding-left: 7px !important; padding-right: 7px !important;" >
								Учреждения																	<span class="badge badge-danger nav-badge-total">1</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										Учреждения сценического искусства																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										Учреждения в области изобразительных искусств																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										Театры																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										Прочее																					<span class="badge badge-danger nav-badge pull-right">1</span>
																			</a>
								</li>

							</ul>
						</li>

						<!-- 국제교류 -->
						<li aria-haspopup="true" style="line-height: 20px !important; padding_bottom: 0px !important;">
							<a style="padding-left: 7px !important; padding-right: 7px !important;"  href="index.php/exchange/introduction__language_korean"> Международный <br>художественный обмен																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>
							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/exchange/introduction__language_korean">
										Обзор									</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/exchange/activity__language_korean">
										Обменная деятельсность																			</a>
								</li>
							</ul>
						</li>

					</ul>
				</nav>
				<!--Nav-->
				<div class="search-language-control">
					<img src="assets/images/icon_btn.png">
					<!-- <i class="fa fa-bars"></i> -->
				</div>

				<div class="search-language">
					<div style="margin-bottom: 5px;">
						<i class="fa fa-search mr-1"></i><span> Поиск</span>
					</div>
					<div class="input-group icon-quote-right">
						<input value="" placeholder="Напишите слово поиска." onkeyup="totalSearch(event, this);" type="text" class="form-control br-tl-7 br-bl-7" name="totalSearch">
						<div class="input-group-append ">
							<button type="button" onclick="javascript:Total_Search();" class="btn btn-primary br-tr-7 br-br-7">
								Поиск							</button>
						</div>
					</div>

					<div style="margin-top: 15px; margin-bottom: 5px;">
						<i class="fa fa-language mr-1"></i><span> Язык</span>
					</div>
					<div>

												<a style="font-size:15px;" href="/index.php?language=korean" class="dropdown-item">
							조선어
						</a>
						<a style="font-family: 'Times New Roman';font-size:15px;" href="/index.php?language=english" class="dropdown-item">
							English
						</a>
						<a style="font-family: Simsun';font-size:15px;" href="/index.php?language=chinese" class="dropdown-item">
							中文
						</a>
						<a style="font-family: 'Times New Roman';font-size:15px;" href="/index.php?language=russian" class="dropdown-item">
							Pусский
						</a>
					</div>
				</div>

			</div>
		</div>
	</div>
</div><style>
	.list-group-item {
		padding-top: 0.1rem;
		padding-bottom: 0rem;
		padding-left: 0.5rem;
		padding-right: 0rem;
	}

	.song-icon {
		position: absolute;
		width: 12px;
	}

	.song-card .card-body .list-group-item>a>p {
		padding-left: 20px;
	}

	.item7-card-img>p {
		text-align: center;
	}

	.revolution-icon {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/leader-ru.png') no-repeat;
		background-size: auto 100%;
		height: 50px;
	}

	.revolution-icon:hover,
	.revolution-icon:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/leader_hover-ru.png') no-repeat;
		background-size: auto 100%;
		height: 50px;
	}

	.famous-song-icon {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/song_back-ru.png') no-repeat;
		background-size: auto 100%;
		height: 55px;
	}

	.famous-song-icon:hover,
	.famous-song-icon:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/song_back_hover-ru.png') no-repeat;
		background-size: auto 100%;
		height: 55px;
	}

	.home_stage_title {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_btn-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.home_stage_title:hover,
	.home_stage_title:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_btn_hover-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.home_art_title {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/art_btn-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.home_art_title:hover,
	.home_art_title:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/art_btn_hover-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.culture_article {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_art_bar_bg-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		background-position-x: center;
		margin-top: 5px;
	}

	.culture_article:hover,
	.culture_article:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_art_bar_bg_hover-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		background-position-x: center;
		margin-top: 5px;
	}

	.culture_life {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_life_bar_bg-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		background-position-x: center;
		margin-top: 5px;
	}

	.culture_life:hover,
	.culture_life:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_life_bar_bg_hover-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		background-position-x: center;
		margin-top: 5px;
	}

	.download_bar {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/download_bar_bg-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		background-position-x: center;
		margin-top: 6px;
	}

	.download_bar:hover,
	.download_bar:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/download_bar_bg_hover-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		background-position-x: center;
		margin-top: 6px;
	}

	.edu_bar {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/edu_bar_bg-ru.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 65%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.edu_bar:hover,
	.edu_bar:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/edu_bar_bg_hover-ru.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 65%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.stage_bar {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_bar_bg-ru.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 93%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.stage_bar:hover,
	.stage_bar:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_bar_bg_hover-ru.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 93%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.notice-icon {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/news_bar_bg-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		margin-top: 5px;
	}

	.notice-icon:hover,
	.notice-icon:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/news_bar_bg_hover-ru.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 25px;
		margin-top: 5px;
	}

	.home_star {
		margin-top: -5px;
		height: 48px;
		margin-bottom:5px;
	}

	.other_site {
		border-radius: 3px;
		padding: 4px 4px;
		border: 1px solid #ccc;
	}
	.h-rotate {
		padding-bottom:6px;
	}

	.go-detail {
		display: inline-block;
		color: #882211;
		font-size: 20px;
		font-weight: 700;
	}
	.go-detail:hover {
		color: #dc4c4c;
	}
	.go-detail > span {
		display: inline-block;
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/go-detail.png') no-repeat;
		background-size: 100% auto;
		width: 15px;
		height: 15px;
		background-position-x: center;
		margin-bottom: 6px;
	}

	.go-detail:hover > span,
	.go-detail:focus > span {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/go-detail-hover.png') no-repeat;
		background-size: 100% auto;
		width: 15px;
		height: 15px;
		background-position-x: center;
		margin-bottom: 6px;
	}
</style>
<div class="container" style="max-width: 1920px;">
	<!-- <div id="loading"></div> -->
	<div class="body">


		<section class="mt-1">
			<div class="row">
				<div class="col-xl-3 col-lg-4">
					<div class="rev-card home_revolution_panel">
						<a class="card-header-short revolution-icon" href="index.php/leader/news__kind_1_language_korean">
						</a>
						<div class="card-body modal-scrollable home-card-body mt-3">
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										В торжественной обстановке состоялась церемония приветствия инженерно-саперной части КНА, вернувшейся на Родину, выполнив боевой приказ партии в зоне зарубежной операции									</a>
																			<!--a onclick="javascript:leader_image_show(784)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.12.13.</span>
																													<span>
												<div class="culture-new-span" style="margin-right:5px;">
													<span class="pulsate-regular russian-font">
														Новые													</span>
												</div>
										</span>
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										Прошли торжественные мероприятия в честь 80-летия создания ВВС КНА									</a>
																			<!--a onclick="javascript:leader_image_show(774)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.11.30.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										Уважаемый товарищ <span style="font-weight: bold; white-space: nowrap; font-size: larger">Ким Чен Ын</span> воодушевил участников и снабженцев торжественных мероприятий в честь 80-летия основания ТПК и вместе с ними посмотрел массовые гимнастические и художественные выступления									</a>
																			<!--a onclick="javascript:leader_image_show(752)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.10.13.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										По случаю 80-летия основания ТПК торжественно прошли массовые гимнастические и художественные выступления «Да здравствует Трудовая партия Кореи»									</a>
																			<!--a onclick="javascript:leader_image_show(739)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.10.10.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										По случаю 80-летия основания ТПК прошел концерт российских деятелей искусства									</a>
																			<!--a onclick="javascript:leader_image_show(735)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.10.10.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										Состоялся поздравительный концерт в честь командиров и бойцов зарубежных операционных войск КНА									</a>
																			<!--a onclick="javascript:leader_image_show(714)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.8.22.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										По случаю 80-летия освобождения Родины прошел торжественный концерт российских деятелей искусства									</a>
																			<!--a onclick="javascript:leader_image_show(704)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.8.16.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										С аншлагом прошел художественный концерт в честь 80-летия освобождения Родины									</a>
																			<!--a onclick="javascript:leader_image_show(700)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.8.15.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										Уважаемый товарищ <span style="font-weight: bold; white-space: nowrap; font-size: larger">Ким Чен Ын</span> принял министра культуры РФ, нанесшую визит в нашу страну, и посетил концерты									</a>
																			<!--a onclick="javascript:leader_image_show(683)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.7.3.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="russian-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										Очередной блестящий и величавый облик, символизирующий новый период бурного развития строительства Пхеньяна, период расцвета культуры Пхеньяна<br />В торжественной обстановке состоялась церемония завершения строительства жилых домов на 10 тысяч квартир – третьей очереди жилищного строительства в районе Хвасона									</a>
																			<!--a onclick="javascript:leader_image_show(657)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.4.17.</span>
																																				</li>
													</div>
					</div>

					<div class="hidden">
													<a class="news-item" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=579&language=russian" value="579" start="2023-04-26" end="2023-04-26" current="2026-01-01 14:34:19"></a>
											</div>
				</div>

				<div class="col-xl-7 col-lg-8">

					<div role="main" class="main" style="border:solid #FEDA5E;">
						<div class="slider-container light rev_slider_wrapper my_slide" style="width:100% !important;left:0 !important">
							<div id="revolutionSlider" class="slider rev_slider" data-plugin-revolution-slider data-plugin-options='{"gridwidth": 1000, "gridheight": 600}'>
								<ul>
																			<li data-transition="fade">
																						<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/notice/cf0e5bee40f8fc37190b5f023db3d28d.jpg" 
											alt=""											
											data-bgposition="center center"
											data-bgfit="100% 100%"
											data-bgrepeat="no-repeat"
											data-kenburns="on"
											data-duration="3000"
											data-ease="Linear.easeNone"
											data-scalestart="0"
											data-scaleend="0"
											data-rotatestart="0"
											data-rotateend="0"
											data-offsetstart="0 0"
											data-offsetend="0 0"
											data-bgparallax="10"
											class="rev-slidebg">
										</li>
																			<li data-transition="fade">
																						<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/notice/5f8413b9fb7fbc8e6f5ce051526f0537.jpg" 
											alt=""											
											data-bgposition="center center"
											data-bgfit="100% 100%"
											data-bgrepeat="no-repeat"
											data-kenburns="on"
											data-duration="3000"
											data-ease="Linear.easeNone"
											data-scalestart="0"
											data-scaleend="0"
											data-rotatestart="0"
											data-rotateend="0"
											data-offsetstart="0 0"
											data-offsetend="0 0"
											data-bgparallax="10"
											class="rev-slidebg">
										</li>
																	</ul>
							</div>
						</div>
					</div>
				</div>

				<div class="col-xl-2 col-lg-4">
					<div class="song-card">
						<a class="card-header-short famous-song-icon" href="index.php/stage/productions__language_korean">
						</a>
						<div class="card-body home-card-body mt-3" style="overflow-y:auto;">
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(3084);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Партия – моя мать</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(3095);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Гимн партии-матери</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(3856);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Отец наш дорогой</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(2596);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Пойдем на гору Пэкту</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(3099);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Мир любви к человеку</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(1546);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Море яблонь под перевалом Чхор</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(2937);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">День рождения партии-матери</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(3000);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">И мы члены большой семьи Полководца</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(2525);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Дорогое имя</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="russian-font" href="javascript:select_stage_music(1549);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">Богатый улов на море</p>
									</a>
									
																											</li>
													</div>
					</div>

				</div>
				<div class="col-xl-5 col-lg-8 col-md-12 mt-3">
					<div class="col-md-12 home-festival-panel" style="background-color: #f7f7f7;">
						<div class="text-center pt-3"><label class="pl-2 pr-2 mb-0 russian-font" style="font-size:15pt; font-weight:900;color:#8f0d0d;">Художественные мероприятия</label></div>
						<div class="col-md-12 home_festival_content_panel">
																<div class="row" style="padding-top: 0px; padding-left: 0px;">
										<div class="col-md-2" style="text-align: center;">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art_contest/articles?language=russian">
												<img alt="Художественная выставка" src="assets/images/home/fine_art_contest_mark.png">
											</a>
										</div>
										<div class="col-md-10">
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1699&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Открытие Общереспубликанского фестиваля каллиграфии, приуроченный к 113-летию <br />со дня рождения великого вождя товарища <span style="font-weight: bold; white-space: nowrap; font-size: larger">Ким Ир Сена</span>													</a>
																										<span class="text-blue pr-1">2025.6.4.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1491&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>В торжественной обстановке проходил 5-й Общереспубликанский фестиваль скульптуры и прикладного искусства, посвященный 79-летию основания ТПК													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.11.18.</span>
																																																				</div>
																					</div>

									</div>
																<div class="row" style="padding-top: 20px; padding-left: 0px;">
										<div class="col-md-2" style="text-align: center;">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/april/ready_article?language=russian">
												<img alt="Художественный фестиваль дружбы «Апрельская весна»" src="assets/images/home/april_mark.gif">
											</a>
										</div>
										<div class="col-md-10">
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1438&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Государственный ансамбль танца «Урал»  России)													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.10.16.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1437&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Государственный академический русский народный ансамбль «Россия» имени Л. Г. Зыкиной)													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.10.16.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1424&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Эстрадный оркестр Приморской краевой филармонии России)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.9.11.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1423&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Центральный пограничный ансамбль Федеральной службы безопасности Российской Федерации)													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.9.11.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1389&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Академический ансамбль песни и пляски Российской Армии имени А. В. Александрова)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.26.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1388&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Новосибирский государственный академический театр оперы и балета России)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.26.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1387&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Академический ансамбль песни и пляски войск национальной гвардии Российской Федерации)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.26.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1386&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»<br />(Государственный академический ансамбль народного танца России имени Игоря Моисеева)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.26.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1324&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»(Российский певец Олег Газманов)													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.17.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1323&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»(Российская государственная цирковая компания )													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.17.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1322&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»(Художественный ансамбль Китая)													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.17.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1321&language=russian">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>На XXXIII Художественном фестивале дружбы «Апрельская весна»(Шанхайский цирк Китая)													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.17.</span>
																																																				</div>
																					</div>

									</div>
													</div>

					</div>

				</div>
				<div class="col-xl-7 col-lg-12 mt-3">
					<div class="col-md-12">
						<div class="col-md-12 ">
							<div class="row home_video_panel">
																	<div class="col-md-6" style="padding: 10px;">
										<div class="marketplace-single-imag mx-auto text-center" style="position: relative;">
											<a class="d-block link-overlay">
												<iframe id="adv_video_frame" src="/hls/player.php?id=b1f3dce2e63b4f438d0586c4a3e06c07" style="width:100%;height:220px;"></iframe>
											</a>
										</div>
									</div>
																	<div class="col-md-6" style="padding: 10px;">
										<div class="marketplace-single-imag mx-auto text-center" style="position: relative;">
											<a class="d-block link-overlay">
												<iframe id="adv_video_frame" src="/hls/player.php?id=75726e7ca9501388c11c0143bd961539" style="width:100%;height:220px;"></iframe>
											</a>
										</div>
									</div>
															</div>
						</div>
						<div class="col-md-12 home_alarm_panel" style="margin-top: 10px;">
							<div class="col-md-12 pt-1 pl-4" style="text-align: left;">
								<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/home_detail?kind=10&language=russian" class="notice-icon card-options-collapse">
								</a>
							</div>
							<div class="col-md-12 home_alarm_content_panel">
																	<div class="col-md-12 ">
										<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=579&language=russian">
											<i class="fa fa-envelope-o" aria-hidden="true" style="padding-right:10px;"></i>К бронзовым статуям <nobr>великого вождя</nobr> <span style="font-weight: bold; white-space: nowrap; font-size: larger">Ким Ир Сена</span> и <nobr>великого руководителя</nobr> <span style="font-weight: bold; white-space: nowrap; font-size: larger">Ким Чен Ира</span> прислал корзину цветов постоянный директор Совета Фонда Художественного фестиваля дружбы «Апрельская весна».										</a>
																																								</div>
																	<div class="col-md-12 ">
										<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=384&language=russian">
											<i class="fa fa-envelope-o" aria-hidden="true" style="padding-right:10px;"></i>  Большой концерт в честь 110-летия великого <span style="font-weight: bold; white-space: nowrap; font-size: larger">Ким Ир Сена</span>										</a>
																																								</div>
															</div>

						</div>

					</div>

				</div>
			</div>

			<!-- start of favorites -->
							<div class="row" style="padding: 30px 10px 0px 10px;">
					<div class="col-md-12 home_favor_panel" style="text-align: center;">
						<img class="home_star" src="assets/images/home/star-ru.png">
					</div>

					<div class="col-md-12 home_slides_star_panel">
						<div id="favoriteCarousel" class="owl-carousel owl-carousel-icons3_6 pb-2 pt-5" style="margin-top: 10px;">
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/4b9812da3ae9a9a1932920ac1d68319f.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=240&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;东明王陵</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/f2653425cf3dc5f3987bd030ee7198b8.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=590&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Изоискусство Кореи (4)</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/3c768d9b1160eb7561239f07f18bc49c.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=765&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Изоискусство Кореи (6)</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/a84dcaf798be6a887acdd3a757ac2f0f.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=766&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Из VIII Народного художественного фестиваля «Апрельская весна»(1)</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/b00ed5b63b2cccea7781655ae39dd1a5.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=834&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Из VIII Народного художественного фестиваля «Апрельская весна» (2)</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/addc4e6371a1df2e5de5c4c2b5657232.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=868&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Изоискусство Кореи (8)</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/11/572d406dd21f45ac1830bb737000752a.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=792&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Революционная опера «Море крови» из одноименного бессмертного классического шедевра.</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/22/42452767adfa90acf64da9fc03dea7da.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=804&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Спектакль «Воевод Ли Сун Син»</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/22/531ee025fdc90102790b9e72ed553e70.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=810&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Спектакль «Будем вспоминать о сегодняшнем дне»</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/12/f70567fd86df67a0a39a861b68dc5bb0.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=1590&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Опера «Сон в красном тереме»</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/12/e66496e2fbfc768d5f8ed380d0f4c980.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=1822&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Опера «Седая девушка»</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/12/33685cdecdc4f87e5f0446594e017d8f.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=1950&language=russian" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;Национальная опера «Сказание о девушке Чхун Хян»</span>
												</p>
											</div>
										</div>

									</div>
													</div>
					</div>
				</div>
						<!-- end of favorites -->

							<div class="row" style="padding: 20px 10px;">
					<div class="col-md-12 home_stage_panel">
						<a class="home_stage_title mt-3" href="index.php/stage/productions__language_korean">
						</a>
					</div>

					<div class="col-md-12 home_slides_panel">
						<div id="stageCarousel" class="owl-carousel owl-carousel-icons2_6 pb-2 pt-5" style="margin-top: 10px;">
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/a902798a86d097910bd66862fa6028af.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5007,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Полководец Кореи<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/c8ed3756d438847b4851fcbc05d3d151.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5006,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Пожелание<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/ddd1a304e396713ea1ebbeab39c69795.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5005,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Очарование<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/77ec9ee63b0728b5ffff0eb3c1b5d92f.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5004,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Очарование и почтение<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/553cee9c082f4182406c3b474374c778.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5003,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Думы о Полководце<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/37f5ab12f917de57b59f7b999bcb4c99.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5002,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;<span style="font-weight: bold; white-space: nowrap; font-size: larger">Ким Чен Ир</span> бессмертен как Солнце<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/de9a9c45622571c43b8483f8295df79b.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5001,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Его вся жизнь<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/738b189fdff6f3bce394fd10409baf62.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(5000,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Думаю лишь только о Нем<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/d063730450116edd2a19c9dc63198018.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4999,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Вызывающая тоску снежинка<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/a9b19519a07a782c68e723fe2164bc0a.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4998,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;О, тоскую<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/49f4bbda52db6b2f4b4633adb47227c9.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4997,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Вечная улыбка<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/7fffeddbf3fc2fb9e198519754111765.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4996,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Великое течение тоски<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																											</div>
													</div>
					</div>

				</div>

				<div class="row" style="padding: 0px 10px;">
					<div class="col-md-12  home_bar_bg">
					</div>
				</div>
										<div class="row" style="padding: 20px 10px;">
					<div class="col-md-12 home_art_panel">
						<a class="home_art_title mt-4" href="index.php/art/productions__language_korean">
						</a>
					</div>
					<div class="col-md-12 home_slides_panel">
						<div id="artCarousel" class="owl-carousel owl-carousel-icons4_6 pb-2 pt-5" style="margin-top: 10px;">
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3100&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/63e4b06e72f5f37338c87df603e10903.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Инкрустация перламутром «Новая история процветания деревни в Сончхоне»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3099&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/1cbeef5fcf9653a9a2f6a4042c222b69.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Гравирование на гипсе «Богатый урожай риса, богатый улов сома»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3098&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/c4a8e226ffca9bc28564efb7900f4cbd.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Гравирование на гипсе «Новая панорама в Мёнсасимни»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3097&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/1fc1cff77d2eda9f22a909537e457758.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Гравирование на гипсе «Растет добрая душа»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3096&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/17e62a28e4a5ad63b31da862cc359593.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Гравирование на гипсе «Продолжатель революции»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3095&language=russian" target="_self"> </a>
										<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/art_articles/b7dc33edc48b406b54f4dbbe64066827.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Гравирование на гипсе «Антияпонские партизанки»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3094&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/bb96734bf2f8285f3d06b0fdffd97a87.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Пластмасса «Взирая на стального Полководца»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3093&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/2efeab913183d6c1bf652c27be6e79cc.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Пластмасса «Будущие хозяева»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3092&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/9f948d3e18c37a4249bfc19b2de9d96e.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Керамика «Ваза с украшением гор Кымган»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3091&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/b3c5b9454f13c7f3cae6640b7b1f647e.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Керамика «Ночь в Мёнсасимни». Ваза с украшением картинной живописью<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3090&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/c5ed469dac88493bb59ac862fb6ebcff.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Керамика «Сосна и журавль». Ваза с рельефным орнаментом<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3089&language=russian" target="_self"> </a>
										<img src="uploads/art_articles/786e6cda2ec974162ef83d572bc9334f.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/2.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap russian-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;Яйцо «Сосна и магнолия»<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ru">
											</div>
																			
								</div>
													</div>
					</div>
				</div>
				<div class="row" style="padding: 0px 10px;">
					<div class="col-md-12  home_bar_bg">
					</div>
				</div>
						<div class="row">
				<div class="col-lg-5 col-md-12">
					<div class="col-md-12">
						<a class="culture_article" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/home_detail?kind=40&language=russian" class="card-options-collapse">
						</a>

					</div>
					<div class="col-md-12 home_culture_life_bar_bg">
					</div>
					<div class="col-md-12" style="overflow:scroll; height:240px;">
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1919&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Снег тоски								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1919&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1918&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Во имя Родины и народа 								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1918&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1917&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Великие заслуги, вошедшие в историю создания чучхейского закона 								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1917&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1916&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Великая жизнь, сияющая вместе с народом								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1916&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1915&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Достойная страна для народа								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1915&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1914&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Единодушная сплоченность 								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1913&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Песня о незыблемых убеждениях и клятве всего народа
– О песне «Хоть умрем, но не бросим веры в революцию» –
								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1913&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1891&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Незыблемые убеждения и воля<br />
О песне «Наши убеждения»								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1891&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1890&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Славный плод цивилизации деревни нашего образца 								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1890&language=russian" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular russian-font">
												Новые											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1742&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Питомник чучхейского музыкального искусства – Пхеньянский музыкально-хореографический университет имени Ким Вон Гюна								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
											</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="col-md-12">
						<a class="culture_life" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/culture_life?language=russian">
						</a>
					</div>
					<div class="col-md-12 home_culture_life_bar_bg">

					</div>
					<div class="col-md-12 " style="overflow:scroll; height:240px;">
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=834&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Из VIII Народного художественного фестиваля «Апрельская весна» (2)								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=834&language=russian" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=868&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Изоискусство Кореи (8)								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=868&language=russian" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=766&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Из VIII Народного художественного фестиваля «Апрельская весна»(1)								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=766&language=russian" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=765&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Изоискусство Кореи (6)								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=765&language=russian" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=590&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Изоискусство Кореи (4)								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=590&language=russian" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=305&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Сводное цирковое представление: восторг и романтика								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=293&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Женщина и цветок								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=292&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Яндокский горячий источник: счастливые улыбки у людей								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=291&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Народный обычай Кореи – <i>«Себэ»</i>

								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=290&language=russian">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>Корейские шахматы								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
											</div>
				</div>
				<div class="col-lg-3 col-md-12">
					<div class="col-md-12">
						<a class="download_bar" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/home_detail?kind=50&language=russian">
						</a>
					</div>
					<div class="col-md-12 home_culture_life_bar_bg">

					</div>
					<div class="col-md-12" style="overflow:scroll; height:240px;">
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/bf3ad45733341dfb1f7d2870836cf187.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>Песня о Родине								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/d6f609829869c27f1276a871fb7d174a.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>Заявка на участие в 34-м Художественном фестивале дружбы «Апрельская весна»								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/81c9f730e281d1dde04eda82e505e1ab.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>Основные принципы организации<br />
XXXIV Художественного фестиваля дружбы<br />
 «Апрельская весна»								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/f5612c44652acd54e0f158547c8528d4.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>Эмблема фестиваля								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/2d05245656a694d813dbfc6a8c12e62d.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>Заявка на участие XXXIII Художественного 
фестиваля дружбы «Апрельская весна»								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="russian-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/b9712ae4ccbb99529dd51129bce88bcd.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>Программа XXXIII Художественного 
фестиваля дружбы «Апрельская весна»								</a>
																																</div>
						
					</div>
				</div>
			</div>
							<div class="row" style="padding-top:20px;">
				<div class="col-lg-2 col-md-12 pl-5 april-nav">
						<a class="edu_bar" href="index.php/education/organ_detail__language_korean"></a>
					</div>
					<div class="col-lg-2 col-md-12 pl-6 mobile-april-nav">
						<a class="go-detail russian-font" href="index.php/education/organ_detail__language_korean">
							Учебные заведения в системе искусства							<span></span>
						</a>
					</div>
					<div class="col-lg-10 col-md-12" style="padding: 0px 35px;">
						<div style="margin-top: 5px; border-bottom: 3px solid #AFADAE;"></div>

						<div id="eduCarousel" data-items=4 class="owl-carousel owl-carousel-icons2_8 pb-2 pt-5" style="margin-top: 5px;">
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/education/organ_detail__language_korean" target="_self"> </a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/eb285e0ba64b113573cfa5d88689f865.png" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="russian-font">Питомник чучхейского музыкального искусства – <br>Пхеньянский музыкально-хореографический университет <br>имени Ким Вон Гюна<span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/education/organ_detail__language_korean" target="_self"> </a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/904092432eb4ab4333a3f4675602b1fe.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="russian-font">Пхеньянский институт изобразительных искусств<span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/education/organ_detail__language_korean" target="_self"> </a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/ba2a04ec2a84a86eeed1995208c4a1be.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="russian-font">Класс раннего вокального обучения в Тонъанской полной средней школе Чунского района<span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/education/organ_detail__language_korean" target="_self"> </a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/c71c59a7381df26030fd15a333eef6e3.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="russian-font">Тэдонмунский детский сад<span></p>
										</div>
									</div>
																																				</div>
													</div>

					</div>
				</div>
										<div class="row">
					<div class="col-lg-2 col-md-12 pl-5 april-nav">
						<a class="stage_bar" href="index.php/company/detail__kind_5_language_korean"></a>
					</div>
					<div class="col-lg-2 col-md-12 pl-6 mt-5 mobile-april-nav">
						<a class="go-detail russian-font" href="index.php/education/organ_detail__language_korean">
							Художественные творческие коллективы							<span></span>
						</a>
					</div>
					<div class="col-lg-10 col-md-12" style="padding: 0px 35px;">
						<div style="margin-top: 5px; border-bottom: 3px solid #AFADAE;"></div>
						<div id="orgCarousel" data-items=2 class="owl-carousel owl-carousel-icons_8 pb-2 pt-5" style="margin-top: 5px;">
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/company/detail__kind_5_language_korean">
										</a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/29094c80dd8496fd732b6a9ae487ca86.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="russian-font">Управление по информации о корейской знаковой системе записи танцев <span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/company/detail__kind_5_language_korean">
										</a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/8e01557511dd3f242188da7cc4f42c72.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="russian-font">Пхеньянская кукольная труппа<span></p>
										</div>
									</div>
																																				</div>
													</div>

					</div>
				</div>
										<div class="row">
					<div class="col-md-12 mt-4 mb-2 pt-1">
						<div style="border-bottom: 6px solid #aaa; border-top: 3px solid #ccc;display:flex;">
							<img src="assets/images/site-back.png" style="width:70px;margin:0px 20px 0px 40px;"><span class="russian-font" style="font-size:20pt;font-weight:700;align-self: center;padding-top:3px;color:darkred;text-shadow: 4px 4px 10px darkred;">Другие сайты</span>
						</div>
					</div>
											<div class="col-xl-2 col-md-3 col-sm-4 col-6">
							<div class="item card other_site overflow-hidden">
								<div class="item7-card-img">
									<a target="_blank" href="http://www.naenara.com.kp/sites/national" class="align-items-center">
									</a>
									<img class="align-self-center" src="uploads/news_articles/6e2b4c749d42dade71d5aca47abc685a.jpg" style="width:100%;">
								</div>
															</div>
						</div>
											<div class="col-xl-2 col-md-3 col-sm-4 col-6">
							<div class="item card other_site overflow-hidden">
								<div class="item7-card-img">
									<a target="_blank" href="http://www.dprkportal.kp" class="align-items-center">
									</a>
									<img class="align-self-center" src="uploads/news_articles/aedeab55285fa1b43d54ea35a771539d.png" style="width:100%;">
								</div>
															</div>
						</div>
									</div>
					</section>
	</div>

	<style type="text/css">
#hls_video_modal .modal-header {
	background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/player_header_bg.png') no-repeat;
	background-size: auto 100%;
}
</style>
<!--// hls동영상modal보여주기-->

<div class="modal fade show" id="hls_video_modal" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header" style="background-color:dimgrey;">
				<div class="modal-title align-self-end text-center mr-2" style="padding-left:70px;width:100%;">
											<h4 class="video-modal-title" style="font-family: 'Times New Roman'; font-size: 18px; display: inline-block; margin: 0px; color: #fffdd5; font-weight: bolder;"></h4>
									</div>
				<button type="button" class="close p-1 m-0" data-dismiss="modal" style="width:70px;color:white;">&times;</button>			</div>
			<div class="modal-body" style="padding: 0px;">
				<div style="text-align: center;">
				</div>
				<div id="videoFrameWrapper" class="embed-responsive embed-responsive-16by9" style="background-color:black;">
					<iframe id="videoFrame" src="" style="width: 100%; height: 100%"></iframe>
				</div>
			</div>
			<div class="modal-footer" style="display:none;background-color:dimgrey; font-family: 'Times New Roman'">
				<a href="" class="btn btn-outline-white hidden download-link"><i class="fa fa-download"></i>&nbsp;&nbsp;Загрузка</a>
				<button type="button" class="btn btn-outline-white" onclick="javascript:hls_video_close();"><i class="fa fa-close"></i>&nbsp;&nbsp;Закрыть</button>
			</div>
		</div>

	</div>

</div><!--Footer Section-->
<section>
	<footer class="bg-dark text-white" style="margin-top:10px;">
		<div class="footer-main" style="padding: 0px;border-top: none;">

			<div style="padding: 0px; text-align: center !important;">
				<div class="row april-nav">
					<div class="col-lg-5 col-md-12 footer-main-left">
													<h4 style="font-family: 'Times New Roman'; color: #621E02; font-size:26px; text-align: left;"><strong>Представление о наc</strong></h4>
							<p style="font-family: 'Times New Roman'; text-align: justify; color: black;"><strong>Сайт «Корейское искусство» открыт в 108 г. чучхе (2019) в целях, чтобы разными методами и в разных формах ознакомлять культуру и искусство КНДР.  <br />Редакция «Корейское искусство» впредь будет прилагать все усилия для создания посетителям нашего сайта более удобной и улучшенной обстановки для пользования, также для обеспечения обильных данных об искусстве. 
</strong></p>
											</div>
					<div class="col-lg-7 col-md-12 footer-main-right">
						<div class="row">
							<div class="col-md-2">
							</div>
							<div class="col-md-6">
																	<h4 style="font-family: 'Times New Roman';color: #621E02; font-size:26px;"><strong>Связь с нами</strong></h4>
																<ul class="list-unstyled mb-0">
									<li class="russian-font" style="color:#ffff;"><strong>Адрес; квартал Вэсон, район Чунский,город Пхеньян, КНДР</strong></li>
									<li class="russian-font" style="color:#ffff;"><strong>Телефон: 00850-2-18111(Ext.)-381-8653</strong></li>
									<li class="russian-font" style="color:#ffff;"><strong>Факс: 00850-2-381-4410</strong></li>
								</ul>
							</div>
							<div class="col-md-4" style="top: -10px;">
								<img src="assets/images/qr_cer.png" width="80px" style="margin-left: 10px;" alt=""><br /><br />
																	<p style="font-family: 'Times New Roman';">
										<strong>Министерство культуры КНДР</strong>
									</p>
															</div>
						</div>

					</div>

				</div>
				<div class="row mobile-april-nav">
					<div class="col-lg-5 col-md-12">
													<h4 style="margin: 10px; font-family: 'Times New Roman'; color: #621E02; font-size:26px; text-align: left;"><strong>Представление о наc</strong></h4>
							<p style="margin: 10px; font-family: 'Times New Roman'; text-align: justify; color: black;"><strong>Сайт «Корейское искусство» открыт в 108 г. чучхе (2019) в целях, чтобы разными методами и в разных формах ознакомлять культуру и искусство КНДР.  <br />Редакция «Корейское искусство» впредь будет прилагать все усилия для создания посетителям нашего сайта более удобной и улучшенной обстановки для пользования, также для обеспечения обильных данных об искусстве. 
</strong></p>
											</div>
					<div class="col-lg-7 col-md-12">
						<div class="row">
							<div class="col-md-2">
							</div>
							<div class="col-md-6">
																	<h4 style="font-family: 'Times New Roman';color: #621E02; font-size:26px;"><strong>Связь с нами</strong></h4>
																<p class="russian-font" style="color:#ffff;"><strong>Адрес; квартал Вэсон, район Чунский,город Пхеньян, КНДР</strong></p>
								<p class="russian-font" style="color:#ffff;"><strong>Телефон: 00850-2-18111(Ext.)-381-8653</strong></p>
								<p class="russian-font" style="color:#ffff;"><strong>Факс: 00850-2-381-4410</strong></p>
							</div>
							<div class="col-md-4" style="top: -10px;">
								<img src="assets/images/qr_cer.png" width="80px" style="margin-left: 10px;" alt=""><br /><br />
																	<p style="font-family: 'Times New Roman';">
										<strong>Министерство культуры КНДР</strong>
									</p>
															</div>
						</div>

					</div>

				</div>
			</div>

		</div>

	</footer>
</section>
<!--Footer Section-->
<!-- <a href="#top" id="total_search"><i class="fa fa-rocket"></i></a> -->
<a href="#top" id="back-to-top" class="back-to-top"><i class="fa fa-chevron-up"></i></a>
<!-- <i href="javascript:window.history.back()" id="back-button" class="back-to-top back-button"><i class="fa fa-chevron-left"></i></a> -->
<!-- JQuery js-->
<script src="assets/plugins/jquery.min.js"></script>
<!-- Bootstrap js -->
<script src="assets/plugins/bootstrap-4.1.3/popper.min.js"></script>
<script src="assets/plugins/bootstrap-4.1.3/js/bootstrap.min.js"></script>
<!--JQuery Sparkline Js-->
<script src="assets/default/js/vendors/jquery.sparkline.min.js"></script>
<!-- Circle Progress Js-->
<script src="assets/default/js/vendors/circle-progress.min.js"></script>
<!-- Star Rating Js-->
<script src="assets/plugins/rating/jquery.rating-stars.js"></script>
<!--Owl Carousel js -->
<script src="assets/plugins/owl-carousel/owl.carousel.js"></script>
<!--Horizontal Menu-->
<script src="assets/plugins/Horizontal2/Horizontal-menu/horizontal.js"></script>
<!--JQuery TouchSwipe js-->
<script src="assets/default/js/jquery.touchSwipe.min.js"></script>
<script src="assets/plugins/accordion/accordion.min.js"></script>
<script src="assets/default/js/accor.js"></script>
<!-- Ion.RangeSlider -->
<script src="assets/plugins/jquery-uislider/jquery-ui.js"></script>
<!-- Custom scroll bar Js-->
<script src="assets/plugins/scroll-bar/jquery.mCustomScrollbar.concat.min.js"></script>

<!---Tabs JS-->
<script src="assets/plugins/tabs/jquery.multipurpose_tabcontent.js"></script>
<script src="assets/default/js/tabs.js"></script>

<!-- Gallery js -->
<script src="assets/plugins/gallery/picturefill.js"></script>
<script src="assets/plugins/gallery/lightgallery.js"></script>
<script src="assets/plugins/gallery/lg-pager.js"></script>
<script src="assets/plugins/gallery/lg-autoplay.js"></script>
<script src="assets/plugins/gallery/lg-fullscreen.js"></script>
<script src="assets/plugins/gallery/lg-zoom.js"></script>
<script src="assets/plugins/gallery/lg-hash.js"></script>
<!-- <script src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/plugins/gallery/lg-share.js"></script> -->
<script src="assets/default/js/gallery.js"></script>
<script src="assets/plugins/fancybox/source/jquery.fancybox.js"></script>
<script src="assets/plugins/jquery.pulsate.min.js"></script>

<!--    TODO 시험중에 있는 부분-->
<!-- <script src="assets/extraplugin/js/theme.js"></script>
	<script src="assets/extraplugin/js/theme.init.js"></script> -->

<!-- Custom Js-->
<script src="assets/default/js/custom.js"></script>
<script>
	function site_url(url) {
		var site_url = 'index.html';
		return site_url + url;
	}

	var vtotal = "Всего";
	var vitems = "Событие";
	var vcnt = "Число показов";
	var vsrch = "Поиск";
	var nofilter = "Нет результатов.";
</script>

<script>
	var site_url_other = "index.html";
	var language = 'russian';
	var newsFlag_ko = '';
	var newsFlag_en = '';
	var newsFlag_ch = '';
	var newsFlag_ru = '';
</script>


	<script src="assets/extraplugin/js/theme.js"></script>
	<script src="assets/extraplugin/vendor/rs-plugin/js/jquery.themepunch.tools.min.js"></script>
	<script src="assets/extraplugin/vendor/rs-plugin/js/jquery.themepunch.revolution.min.js"></script>
	<script src="assets/extraplugin/js/theme.init.js"></script>
	<script src="assets/pages/stage/index.js"></script>
	<script src="assets/default/scripts/home.js"></script>
	<script src="assets/pages/home/index.js"></script>
<script>
	function pauseVideo() {
		var video = $('#gossVideo')[0];
		video.pause();
		video.currentTime = 0;
		$('#gossVideo').attr('src', '');
	}
</script>
<script src="assets/pages/common/superfish/superfish.min.js"></script>
<script src="assets/pages/common/stickyjs/sticky.js"></script>
<script src="assets/pages/common/custom.js"></script>

<script>
	var cat_but_0_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/0_0-ru.png";
	var cat_but_0_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/0_1-ru.png";
	var cat_but_0_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/0_2-ru.png";

	var cat_but_8_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/8_0-ru.png";
	var cat_but_8_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/8_1-ru.png";
	var cat_but_8_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/8_2-ru.png";



	var cat_but_1_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/1_0-ru.png";
	var cat_but_1_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/1_1-ru.png";
	var cat_but_1_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/1_2-ru.png";

	var cat_but_2_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/2_0-ru.png";
	var cat_but_2_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/2_1-ru.png";
	var cat_but_2_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/2_2-ru.png";

	var cat_but_3_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/3_0-ru.png";
	var cat_but_3_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/3_1-ru.png";
	var cat_but_3_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/3_2-ru.png";

	var cat_but_4_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/4_0-ru.png";
	var cat_but_4_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/4_1-ru.png";
	var cat_but_4_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/4_2-ru.png";


	var cat_but_5_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/5_0-ru.png";
	var cat_but_5_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/5_1-ru.png";
	var cat_but_5_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/5_2-ru.png";

	var cat_but_6_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/6_0-ru.png";
	var cat_but_6_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/6_1-ru.png";
	var cat_but_6_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/6_2-ru.png";

	var cat_but_7_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/7_0-ru.png";
	var cat_but_7_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/7_1-ru.png";
	var cat_but_7_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/7_2-ru.png";


	//인민예술축전


	var pe_fes_but_0_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/0_1-ru.png";
	var pe_fes_but_0_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/0_2-ru.png";

	var pe_fes_but_1_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/1_1-ru.png";
	var pe_fes_but_1_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/1_2-ru.png";

	var pe_fes_but_2_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/2_1-ru.png";
	var pe_fes_but_2_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/2_2-ru.png";

	var personal_fes_but_2_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/2_1-ru.png";
	var personal_fes_but_2_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/2_2-ru.png";

	var pe_fes_but_3_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/3_1-ru.png";
	var pe_fes_but_3_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/3_2-ru.png";

	var pe_fes_but_4_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/4_1-ru.png";
	var pe_fes_but_4_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/4_2-ru.png";

	var pe_fes_but_5_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/5_1-ru.png";
	var pe_fes_but_5_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/5_2-ru.png";

	var personal_fes_but_5_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/5_1-ru.png";
	var personal_fes_but_5_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/5_2-ru.png";

	var musical_contest_but_6_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/6_1-ru.png";
	var musical_contest_but_6_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/6_2-ru.png";

	var musical_contest_but_7_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/7_1-ru.png";
	var musical_contest_but_7_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/7_2-ru.png";
</script>
<!--음악-->

<div class="modal fade show" id="music_modal" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-lg russian-font">
		<div class="modal-content">
			<div class="modal-header" style="padding: 7px; background-color: chocolate;">
				<div class="row" style="width: 100%;">
					<!-- <div class="col-md-4">
						<span class="pull-left" style="font-size: 22px; display: inline-block; color: #fffdd5; font-weight: bolder;">
							<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/stage/image/music_img.png" height="60px;" alt="">
						</span>
					</div> -->
					<div class="col-md-12" style="text-align: center;">
						<p class="modal-title russian-font" id="music-modal-title" style="font-size: 16px; display: inline-block; margin: 0px; color: #fffdd5;"></p>

					</div>
				</div>
			</div>
			<div class="modal-body">
				<div style="text-align: center;">
					<div style=" height: 400px;" class="modal-scrollable">
						<img id="music_image" style="width: 100%" src="" alt="">
					</div>
				</div>
				<div style="text-align: center;">
					<audio id="audioPlayer" oncontextmenu="return false;" controls="nodownload" controlslist="nodownload" style="width: 100%; height: 40px; background-color: white;">
						<source id="music_url" src="" type="audio/mp3">
					</audio>
				</div>
			</div>
			<div class="modal-footer" style="background-color: chocolate;">
				<button type="button" class="btn btn-outline-white-2" onclick="javascript:music_modal_close();"><i class="fa fa-close"></i>&nbsp;&nbsp;Закрыть</button>
			</div>
		</div>
	</div>
</div>

<!--    본문보여주기-->

<div id="text_modal" class="modal fade">
	<div class="modal-dialog modal-lg russian-font" role="document">
		<div class="modal-content ">
			<div class="modal-header pd-x-20">
				<h4 class="modal-title">
					<span id="text_modal_subtitle"></span>
											<p id="text_modal_title" style="font-family: 'Times New Roman'; color: #0267be; font-weight: bold; font-size: 16px; margin-top: 10px; "></p>
									</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body pd-20 modal-scrollable" style="height: 300px;">
				<h5 class=" lh-3 mg-b-20"><a href="" class="font-weight-bold" id="modal_intro"></a></h5>

									<p class="article-body" id="modal_content" style="font-family: 'Times New Roman'; color: black;"></p>
							</div>
			<div class="modal-footer">
				<a id="modal_link" class="btn btn-red hidden" href="/"><i class="fa fa-link"></i>Просмотр</a>
				<button type="button" class="btn btn-blue" data-dismiss="modal">Закрыть</button>
			</div>
		</div>
	</div>
</div>

<div id="text_modal_xl" class="modal fade">
	<div class="modal-dialog russian-font" role="document" style="width:90%;max-width:90%;">
		<div class="modal-content" style="min-height:500px;">
			<div class="modal-header pd-x-20">
				<h4 class="modal-title">
					<span id="subtitle"></span>
											<p id="title" style="font-family: 'Times New Roman'; color: #0267be; font-weight: bold; font-size: 16px; margin-top: 10px; "></p>
									</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body pd-20 modal-scrollable">
				<h5 class="lh-3 mg-b-20"><a href="" class="font-weight-bold" id="intro"></a></h5>

									<div class="article-body" id="content" style="font-family: 'Times New Roman'; color: black;"></div>
							</div>
			<div class="modal-footer">
				<a id="modal_link" class="btn btn-red hidden" href="/"><i class="fa fa-link"></i>Просмотр</a>
				<button type="button" class="btn btn-blue" data-dismiss="modal">Закрыть</button>
			</div>
		</div>
	</div>
</div>


<div id="news_modal_mobile" class="modal fade russian-font">
	<div class="modal-dialog modal-lg russian-font" role="document">
		<div class="modal-content ">
			<div class="modal-header pd-x-20">
				<h4 class="modal-title">
					<span id="mobile_text_modal_subtitle"></span>
											<p id="mobile_text_modal_title" style="font-family: 'Times New Roman'; color: #0267be; font-weight: bold; font-size: 16px; margin-top: 10px; "></p>
									</h4>
				<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button> -->
			</div>
			<div class="modal-body pd-20 modal-scrollable" style="height: 300px;">
				<h5 class=" lh-3 mg-b-20"><a href="" class="font-weight-bold" id="mobile_modal_intro"></a></h5>

				
					<p class="mobile_article-body" id="mobile_modal_content" style="font-family: 'Times New Roman'; color: black;"></p>
							</div>
			<!-- <div class="checkbox news-checkbox-div">
				<label><input class="news-checkbox" id="news_modal_check" type="checkbox" value="1">За день – без изображения</label>
			</div>
			<div class="text-right" style="padding-right:30px">

				<a id="mobile_modal_link" class="btn btn-red hidden" href="/"><i class="fa fa-link"></i>Просмотр</a>
				<button type="button" class="btn btn-blue" data-dismiss="modal" onclick="javascript:on_news_modal_close();">Закрыть</button>
			</div> -->
			<div class="checkbox news-checkbox-div" style="margin-left:5px;">
				<label><input class="news-checkbox" id="news_mobile_modal_check" type="checkbox" value="1">За день – без изображения</label>
			</div>
			<div class="modal-footer">

				<a id="mobile_modal_link" class="btn btn-red hidden russian-font" href="/"><i class="fa fa-link"></i>Просмотр</a>
				<button type="button" class="btn btn-blue russian-font" data-dismiss="modal" onclick="javascript:on_news_mobile_modal_close();">Закрыть</button>
			</div>
		</div>
	</div>
</div>

<div id="news_modal" class="modal fade">
	<div class="modal-dialog modal-lg russian-font" role="document" style="max-width:1200px; width: 1100px; height: 611px; background-image: url(https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/news_bg.png);">
		<div class="modal-content " style="background-color: transparent; border: 0;">
			<div class="russian-font" style="border:0">
				<div style="margin-top: 45px;margin-left: 40px;color: white; font-size: 16pt;">
					Уведомление				</div>
				<div>
											<h4 id="news_modal_title" class="modal-title" style="font-family: 'Times New Roman'; color: #1b75bb; font-size: 16pt;margin-top: 45px;margin-left: 20px;width:70%; text-align:center">

						</h4>
									</div>
			</div>
			<div class="modal-body pd-20 modal-scrollable" style="padding-top: 35px; overflow-y: unset !important;">
				<h5 class=" lh-3 mg-b-20"><a href="" class="font-weight-bold" id="modal_intro"></a></h5>
				<img id="news_modal_image" src="assets/images/april/asfaf.png" style="float: left; width: 150px; margin: 20px 0 0 25px" />
									<p class="article-body" id="news_modal_content" style="font-family: 'Times New Roman'; color: white;font-size: 14pt;padding: 0 20px;width: 550px;overflow: auto;height: 240px;"></p>
							</div>
			<div class="checkbox news-checkbox-div russian-font">
				<label><input class="news-checkbox" id="news_modal_check" type="checkbox" value="1">За день – без изображения</label>
			</div>
			<div class="text-right" style="padding-right:170px">

				<a id="news_link" class="btn btn-red hidden russian-font" href="/"><i class="fa fa-link"></i>Просмотр</a>
				<button type="button" class="btn btn-blue russian-font" data-dismiss="modal" onclick="javascript:on_news_modal_close();">Закрыть</button>
			</div>
		</div>
	</div>
</div>

<!-- 광고동영상보여주기-->
<!-- 
<div>
	<div class="modal fade show" id="video_modal" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content" style="background-color: rgba(70,130,180,0);">
				<div class="modal-header" style="text-align: center; background-color: rgba(0, 0, 0, 0.33); padding: 0px 15px 0px 15px">
					<div class="row" style="width: 100%;">
						<div class="col-md-2">
							<span class="pull-left" style="font-size: 22px; display: inline-block; color: #fffdd5; font-weight: bolder;">
								<img src="assets/images/stage/image/video.ico" height="70px;" alt="">
							</span>
						</div>
						<div class="col-md-8" style="padding-top: 10px;">
							<span style="text-align: center">
																	<span class="modal_subtitle" style="font-family: 'Times New Roman'; color:#f8f8f8; font-size: 16px; padding-right: 4px;"></span>
									<h4 class="video-modal-title" id="font-family: 'Times New Roman'; video_modal_title" style="font-size: 22px; display: inline-block; margin: 10px 0px 0px 0; color: #f5f5f5;"></h4>
															</span>
						</div>
						<button type="button" class="close" onclick="javascript:onVideoClose();">
							<span aria-hidden="true"><i class="si si-close fa-2x text-white"></i></span>
						</button>
					</div>
				</div>
				<div class="modal-body" style="padding: 0px;">
					<div style="text-align: center;">
					</div>
					<div style="text-align: center;">
						<video id="videoPlayer" controls controls="nodownload" controlslist="nodownload" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); width: 100%; background-color: white;">
							<source id="video_url" src="" type="video/mp4">
						</video>
					</div>
				</div>
				<div class="modal-footer" style="background-color: rgba(0, 0, 0, 0.33);">
					<button type="button" class="btn btn-outline-white" onclick="javascript:onVideoClose();"><i class="fa fa-close"></i>&nbsp;&nbsp;Закрыть</button>
				</div>
			</div>
		</div>
	</div>
</div> -->
</div>
</body>

</html>