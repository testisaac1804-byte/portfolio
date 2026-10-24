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
		朝鲜艺术	</title>

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
	
<div class="header-main chinese-font">

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
									<a href="#" class="text-dark" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-search mr-1"></i><span> 搜索</span></a>
									<div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow" style="padding: 5px; min-width: 18rem !important;">
										<div class="input-group icon-quote-right chinese-font">
											<input type="text" class="form-control br-tl-7 br-bl-7" name="totalSearch" id="totalSearch" value="" placeholder="请输入搜索单词" onkeyup="totalSearch(event,this);">
											<div class="input-group-append ">
												<button type="button" onclick="javascript:Total_Search();" class="btn btn-primary br-tr-7 br-br-7">
													搜索												</button>
											</div>
										</div>
									</div>
								</li>
								<li class="dropdown">
									<a href="#" class="text-dark" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-language mr-1"></i><span> 语言</span></a>
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
										<img src="assets/images/logo_ch.png" height="35px" alt="" />
				</span>
			</a>
		</div>
		<!--/Mobile Header -->

		<div class="horizontal-main my_container clearfix">
			<div class="horizontal-mainwrapper clearfix" style="background-size:100% auto;">
				<div class="desktoplogo" style="width:20%; margin-left:50px;">
					<a href="index__language_korean.php">
												<img src="assets/images/logo_ch.png" alt="logo">
					</a>
				</div>
				<!--Nav-->
				<nav class="horizontalMenu clearfix d-md-flex chineseMenu navcenter">
					<ul class="horizontalMenu-list" style="margin-right: 20px; text-align: center !important;">
						<!-- 불멸의 령도 -->
						<li aria-haspopup="true" >
							<a   href="index.php/leader/news__kind_1_language_korean">
								伟大的领导																	<span class="badge badge-danger nav-badge-total">5</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">

								<li aria-haspopup="true">
									<a href="index.php/leader/news__kind_1_language_korean">
										伟大的领导																					<span class="badge badge-danger nav-badge pull-right">1</span>
																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/leader/theory__language_korean">
										主体文艺理论																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/leader/story__language_korean">
										伟人故事																					<span class="badge badge-danger nav-badge pull-right">4</span>
																			</a>
								</li>
							</ul>
						</li>
						<!-- 작품감상 -->
						<li aria-haspopup="true" >
							<a  >
								艺术作品																	<span class="badge badge-danger nav-badge-total">67</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/stage/productions__language_korean">
										舞台艺术																					<span class="badge badge-danger nav-badge pull-right">19</span>
																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/art/productions__language_korean">
										美术																					<span class="badge badge-danger nav-badge pull-right">48</span>
																			</a>
								</li>

							</ul>
						</li>
						<!-- 예술행사, 경연 -->
						<li aria-haspopup="true" >
							<a  >
								艺术活动,表演赛																	<span class="badge badge-danger nav-badge-total">15</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">
																<li aria-haspopup="true">
									<a href="index.php/people_festival/introduction__language_korean">
										四月之春人民艺术节																			</a>
								</li>
																																<li aria-haspopup="true">
									<a href="index.php/personal_contest/introduction__language_korean">
										2.16艺术奖个人比赛																			</a>
								</li>
																								<li aria-haspopup="true">
									<a href="index.php/musical_contest/introduction__language_korean">
										平壤国际声乐比赛																			</a>
								</li>
																								<li aria-haspopup="true">
									<a href="index.php/art_contest/introduction__language_korean">
										美术展示会																			</a>
								</li>
																<li aria-haspopup="true">
									<a href="index.php/april__language_korean">
										4月之春友谊艺术节																					<span class="badge badge-danger nav-badge pull-right">15</span>
																			</a>
								</li>
							</ul>
						</li>
						<!-- 예술교육 -->
						<li aria-haspopup="true" >
							<a  >
								艺术教育																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>
							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/education/introduction__language_korean">
										概括									</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/education/organ_detail__language_korean">
										艺术教育单位																			</a>
								</li>
							</ul>
						</li>
						<!-- 기관소개 -->
						<li aria-haspopup="true" >
							<a  >
								单位介绍																	<span class="badge badge-danger nav-badge-total">1</span>
																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>

							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										舞台艺术单位																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										美术单位																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										剧院介绍																			</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/company/detail__kind_5_language_korean">
										其它																					<span class="badge badge-danger nav-badge pull-right">1</span>
																			</a>
								</li>

							</ul>
						</li>

						<!-- 국제교류 -->
						<li aria-haspopup="true" >
							<a   href="index.php/exchange/introduction__language_korean"> 国际艺术交流																<span class="fa fa-caret-down m-0" style="color:#000000;"></span>
							</a>
							<ul class="sub-menu">
								<li aria-haspopup="true">
									<a href="index.php/exchange/introduction__language_korean">
										介绍									</a>
								</li>
								<li aria-haspopup="true">
									<a href="index.php/exchange/activity__language_korean">
										交流活动																			</a>
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
						<i class="fa fa-search mr-1"></i><span> 搜索</span>
					</div>
					<div class="input-group icon-quote-right">
						<input value="" placeholder="请输入搜索单词" onkeyup="totalSearch(event, this);" type="text" class="form-control br-tl-7 br-bl-7" name="totalSearch">
						<div class="input-group-append ">
							<button type="button" onclick="javascript:Total_Search();" class="btn btn-primary br-tr-7 br-br-7">
								搜索							</button>
						</div>
					</div>

					<div style="margin-top: 15px; margin-bottom: 5px;">
						<i class="fa fa-language mr-1"></i><span> 语言</span>
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
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/leader-ch.png') no-repeat;
		background-size: auto 100%;
		height: 50px;
	}

	.revolution-icon:hover,
	.revolution-icon:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/leader_hover-ch.png') no-repeat;
		background-size: auto 100%;
		height: 50px;
	}

	.famous-song-icon {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/song_back-ch.png') no-repeat;
		background-size: auto 100%;
		height: 55px;
	}

	.famous-song-icon:hover,
	.famous-song-icon:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/song_back_hover-ch.png') no-repeat;
		background-size: auto 100%;
		height: 55px;
	}

	.home_stage_title {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_btn-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.home_stage_title:hover,
	.home_stage_title:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_btn_hover-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.home_art_title {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/art_btn-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.home_art_title:hover,
	.home_art_title:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/art_btn_hover-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 35px;
		background-position-x: center;
	}

	.culture_article {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_art_bar_bg-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
		background-position-x: center;
		margin-top: 5px;
	}

	.culture_article:hover,
	.culture_article:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_art_bar_bg_hover-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
		background-position-x: center;
		margin-top: 5px;
	}

	.culture_life {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_life_bar_bg-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
		background-position-x: center;
		margin-top: 5px;
	}

	.culture_life:hover,
	.culture_life:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/culture_life_bar_bg_hover-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
		background-position-x: center;
		margin-top: 5px;
	}

	.download_bar {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/download_bar_bg-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
		background-position-x: center;
		margin-top: 6px;
	}

	.download_bar:hover,
	.download_bar:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/download_bar_bg_hover-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
		background-position-x: center;
		margin-top: 6px;
	}

	.edu_bar {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/edu_bar_bg-ch.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 65%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.edu_bar:hover,
	.edu_bar:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/edu_bar_bg_hover-ch.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 65%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.stage_bar {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_bar_bg-ch.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 65%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.stage_bar:hover,
	.stage_bar:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/stage_bar_bg_hover-ch.png') no-repeat;
		background-size: 100% auto;
		display: block;
		width: 65%;
		height: 100%;
		background-position-x: center;
		margin-top: 6px;
	}

	.notice-icon {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/news_bar_bg-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
		margin-top: 5px;
	}

	.notice-icon:hover,
	.notice-icon:focus {
		background: url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home/news_bar_bg_hover-ch.png') no-repeat;
		background-size: auto 100%;
		display: block;
		height: 30px;
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
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										欢迎赴海外作战区执行党的战斗命令归国的朝鲜人民军工兵部队仪式隆重举行									</a>
																			<!--a onclick="javascript:leader_image_show(783)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.12.13.</span>
																													<span>
												<div class="culture-new-span" style="margin-right:5px;">
													<span class="pulsate-regular chinese-font">
														新													</span>
												</div>
										</span>
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										纪念朝鲜人民军空军成立８０周年活动隆重举行									</a>
																			<!--a onclick="javascript:leader_image_show(773)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.11.30.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										敬爱的<span style="font-weight: bold; white-space: nowrap; font-size: larger">金正恩</span>同志祝贺和勉励朝鲜劳动党成立８０周年庆祝活动参加者和后勤保障人员，并同他们一起观看大型团体操和艺术演出									</a>
																			<!--a onclick="javascript:leader_image_show(751)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.10.13.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										庆祝朝鲜劳动党成立八十周年大型团体操和艺术演出《朝鲜劳动党万岁》隆重举行									</a>
																			<!--a onclick="javascript:leader_image_show(741)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.10.10.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										庆祝朝鲜劳动党成立８０周年俄罗斯艺术家演出举行									</a>
																			<!--a onclick="javascript:leader_image_show(737)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.10.10.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										朝鲜人民军海外作战部队指战员祝贺演出举行									</a>
																			<!--a onclick="javascript:leader_image_show(713)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.8.22.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										在祖国解放８０周年之际俄罗斯艺术家举行庆祝演出									</a>
																			<!--a onclick="javascript:leader_image_show(703)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.8.16.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										庆祝祖国解放８０周年文艺演出隆重举行									</a>
																			<!--a onclick="javascript:leader_image_show(699)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.8.15.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										敬爱的<span style="font-weight: bold; white-space: nowrap; font-size: larger">金正恩</span>同志会见到访我国的俄罗斯联邦文化部长并观看文艺演出									</a>
																			<!--a onclick="javascript:leader_image_show(682)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.7.3.</span>
																																				</li>
															<li class="list-group-item" style="background:none;border:none;">
									<i class="fa fa-flag-o text-red" aria-hidden="true"></i>
									<a class="chinese-font" href="index.php/leader/show_detail__article_id_734_language_korean" target="blank" style="padding-left:5px;">
										象征平壤建设新的全盛期、平壤文化繁荣期的又一座耀眼雄姿<br />和盛地区第三期１万套住宅竣工典礼隆重举行									</a>
																			<!--a onclick="javascript:leader_image_show(656)"><i class="fa fa-image text-red"></i></a-->

										<a href="index.php/leader/image_show__id_738" target="blank"><i class="fa fa-image text-red"></i></a>									<span class="text-red">2025.4.17.</span>
																																				</li>
													</div>
					</div>

					<div class="hidden">
													<a class="news-item" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=578&language=chinese" value="578" start="2023-04-26" end="2023-04-26" current="2026-01-01 14:25:37"></a>
											</div>
				</div>

				<div class="col-xl-7 col-lg-8">

					<div role="main" class="main" style="border:solid #FEDA5E;">
						<div class="slider-container light rev_slider_wrapper my_slide" style="width:100% !important;left:0 !important">
							<div id="revolutionSlider" class="slider rev_slider" data-plugin-revolution-slider data-plugin-options='{"gridwidth": 1000, "gridheight": 600}'>
								<ul>
																			<li data-transition="fade">
																						<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/notice/acd107af947229bf9829684545ec0230.jpg" 
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
																						<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/notice/2c921cadb91a63ea519983178b782e49.jpg" 
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
									<a class="chinese-font" href="javascript:select_stage_music(3109);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">党啊，您是我的母亲</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(3121);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">献给母亲党的歌</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(3855);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">和蔼可亲的慈父</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(2512);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">去白头山</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(3125);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">温情世界</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(1569);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">铁岭脚下苹果大海</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(2892);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">母亲的生日</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(2977);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">将军的家属</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(2443);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">亲昵的名字</p>
									</a>
									
																											</li>
															<li class="list-group-item" style="background:none;border:none;">
									<a class="chinese-font" href="javascript:select_stage_music(1572);">
										<img class="song-icon" src="assets/images/song_icon.gif">

										<p style="margin-top:3px;">大海丰收歌</p>
									</a>
									
																											</li>
													</div>
					</div>

				</div>
				<div class="col-xl-5 col-lg-8 col-md-12 mt-3">
					<div class="col-md-12 home-festival-panel" style="background-color: #f7f7f7;">
						<div class="text-center pt-3"><label class="pl-2 pr-2 mb-0 chinese-font" style="font-size:15pt; font-weight:900;color:#8f0d0d;">艺术活动</label></div>
						<div class="col-md-12 home_festival_content_panel">
																<div class="row" style="padding-top: 0px; padding-left: 0px;">
										<div class="col-md-2" style="text-align: center;">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art_contest/articles?language=chinese">
												<img alt="美术展示会" src="assets/images/home/fine_art_contest_mark.png">
											</a>
										</div>
										<div class="col-md-10">
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1698&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>庆祝伟大领袖<span style="font-weight: bold; white-space: nowrap; font-size: larger">金日成</span>同志华诞113周年全国书法节开幕													</a>
																										<span class="text-blue pr-1">2025.6.4.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1492&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>庆祝朝鲜劳动党成立79周年第5次全国雕塑及工艺节隆重举行													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.11.21.</span>
																																																				</div>
																					</div>

									</div>
																<div class="row" style="padding-top: 20px; padding-left: 0px;">
										<div class="col-md-2" style="text-align: center;">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/april/ready_article?language=chinese">
												<img alt="4月之春友谊艺术节" src="assets/images/home/april_mark.gif">
											</a>
										</div>
										<div class="col-md-10">
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1458&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节(俄罗斯车里雅宾斯克国立乌拉尔舞蹈团)													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.10.18.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1457&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节(俄罗斯吉季娜国立艺术中心民俗艺术团)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.10.18.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1426&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第三十三届四月之春友谊艺术节（俄罗斯滨海边疆区音乐协会轻音乐团）
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.9.12.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1425&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第三十三届四月之春友谊艺术节（俄联邦安全局中央边防军艺术团）
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.9.12.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1397&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节中(俄罗斯武装力量亚历山德罗夫红旗歌舞团)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.27.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1396&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节中(俄罗斯新西伯利亚国立歌剧及芭蕾舞剧院芭蕾团)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.27.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1395&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节中(俄罗斯联邦民族近卫军学院协奏团)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.27.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1394&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节中(俄罗斯伊戈里•莫伊谢耶夫国立民间舞蹈团)
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.8.27.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1345&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节（俄罗斯流行歌手奥列格•加兹马诺夫）
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.20.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1344&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节（俄罗斯国家杂技公司杂技团）
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.20.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1343&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节（中国艺术团）
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.20.</span>
																																																				</div>
																							<div class="col-md-12 ">
													<a target='_blank' class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/news_article/show_detail?id=1342&language=chinese">
														<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第33届四月之春友谊艺术节（中国上海杂技团）
													</a>
																											<span class="text-success pl-1 pr-1"><i class="fa fa-video-camera"></i></span>
																										<span class="text-blue pr-1">2024.7.20.</span>
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
												<iframe id="adv_video_frame" src="/hls/player.php?id=1dc07b3f0e764bc3c193daa9843745fb" style="width:100%;height:220px;"></iframe>
											</a>
										</div>
									</div>
																	<div class="col-md-6" style="padding: 10px;">
										<div class="marketplace-single-imag mx-auto text-center" style="position: relative;">
											<a class="d-block link-overlay">
												<iframe id="adv_video_frame" src="/hls/player.php?id=6c582fc3c4046912200f160cf7ebbfbc" style="width:100%;height:220px;"></iframe>
											</a>
										</div>
									</div>
															</div>
						</div>
						<div class="col-md-12 home_alarm_panel" style="margin-top: 10px;">
							<div class="col-md-12 pt-1 pl-4" style="text-align: left;">
								<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/home_detail?kind=10&language=chinese" class="notice-icon card-options-collapse">
								</a>
							</div>
							<div class="col-md-12 home_alarm_content_panel">
																	<div class="col-md-12 ">
										<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=578&language=chinese">
											<i class="fa fa-envelope-o" aria-hidden="true" style="padding-right:10px;"></i>四月之春友谊艺术节基金董事会常任董事向伟大领袖<span style="font-weight: bold; white-space: nowrap; font-size: larger">金日成</span>同志和<nobr>伟大领导者<span style="font-weight: bold; white-space: nowrap; font-size: larger">金正日</span>同志</nobr>的铜像送来了花篮。										</a>
																																								</div>
																	<div class="col-md-12 ">
										<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=390&language=chinese">
											<i class="fa fa-envelope-o" aria-hidden="true" style="padding-right:10px;"></i>庆祝伟大领袖<span style="font-weight: bold; white-space: nowrap; font-size: larger">金日成</span>同志华诞110周年大型演出隆重举行										</a>
																																								</div>
															</div>

						</div>

					</div>

				</div>
			</div>

			<!-- start of favorites -->
							<div class="row" style="padding: 30px 10px 0px 10px;">
					<div class="col-md-12 home_favor_panel" style="text-align: center;">
						<img class="home_star" src="assets/images/home/star-ch.png">
					</div>

					<div class="col-md-12 home_slides_star_panel">
						<div id="favoriteCarousel" class="owl-carousel owl-carousel-icons3_6 pb-2 pt-5" style="margin-top: 10px;">
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/cd0575ca32084b54d89e877bba1920a9.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=80&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;을밀대</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/25ed1e53b111ed708d6f468f536b79dd.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=239&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;朝鲜象棋</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/8a095489e525387926bfb0fc76120464.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=241&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;乙密台</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/db58ce60a059e1dc5dff7d846943dc98.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=763&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;第8届四月之春人民艺术节中(1)</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/bdba9188a2f221a66a38cd6e14a424c8.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=867&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;朝鲜美术（8）</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/12/e2930c9f4d094c448d7b835d5fb3c436.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=1699&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;歌剧《梁山伯与祝英台》</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/fccdd99433122302cfbace28f254d5a5.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=589&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;朝鲜美术（4）</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/22/d6519ff2e24f05315ba4d76ed0903733.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=769&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;话剧《霓虹灯下的哨兵》</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/12/a401cb02276828fcbe4be0f5cf179821.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=1587&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;朝鲜歌剧 《红楼梦》</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/d1920e1dcb0fa92daf9760963ff298e7.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?sp=1&id=832&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;第8届四月之春人民艺术节中(2)</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/22/26db0a1f9806e8bab70a59fd07a502db.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=765&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;话剧《李舜臣将军》</span>
												</p>
											</div>
										</div>

									</div>
																<div class="item">
										<div class="item7-card-img contain-image" style="padding:0px;background-image:url('https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/stage_articles/12/659f1237d5c1445a334629f5a3156b4a.jpg')">
											<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/stage/show_detail?id=1947&language=chinese" target="_self"> </a>
										</div>
										<div class="card-body" style="padding:5px;height:58px;display:flex;">
											<div class="item-card9 h-rotate">
												<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
													<span>&nbsp;&nbsp;民族歌剧《春香传》</span>
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
																					
												<img src="uploads/stage_articles/33/92cd0a72dfa6099be57a798fb93cd480.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4988,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;朝鲜的将军<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/31eeaad19ba2571ee10d638c89e8b1e7.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4987,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;祝愿<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/d20e14882be0d2046638e51b903afeed.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4986,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;倾倒<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/16f2843cd9f99bb86914cb2ab2c37591.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4985,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;倾倒和景仰<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/30ca1776abd18b0084217fd0b9ff201b.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4984,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;思念将军<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/3a3d3e764f0f0f41a093314c846580e9.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4983,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;<span style="font-weight: bold; white-space: nowrap; font-size: larger">金正日</span>将军是永恒的太阳<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/8bf57b016a79c2da714b8b077aa8be6e.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4982,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;他的一生<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/9b32aa435b9679747f94515a5bcbebac.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4981,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;一心思念将军<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/44596458a6966e75a9e70fb37b5aba71.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4980,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;令人怀念的雪花<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/0a308dbff609536a1c7e355996f7301a.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4979,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;永远的微笑<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/9dc981bb34f50759b6f2510102d4af88.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4978,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;啊，想念您<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																											</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
																					
												<img src="uploads/stage_articles/33/fd48e40251591596490a86710b8def8f.jpg" alt="img" class="cover-image">
												<a href="javascript:select_stage_music(4977,33)" target="_self"></a>
																														</div>
									<div class="card-body" style="padding:5px;height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18  name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;思念的大河<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
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
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3075&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/1cbeef5fcf9653a9a2f6a4042c222b69.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;石膏雕塑《稻米丰收，鲇鱼丰收》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3074&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/c4a8e226ffca9bc28564efb7900f4cbd.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;石膏雕塑《明沙十里的新景象》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3073&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/1fc1cff77d2eda9f22a909537e457758.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;石膏雕塑《日益长大的心灵》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3072&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/17e62a28e4a5ad63b31da862cc359593.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;石膏雕塑《革命的接班人》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3071&language=chinese" target="_self"> </a>
										<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/art_articles/b7dc33edc48b406b54f4dbbe64066827.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;石膏雕塑《抗日女战士》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3070&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/bb96734bf2f8285f3d06b0fdffd97a87.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;塑料雕塑《仰望钢铁统帅》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3069&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/2efeab913183d6c1bf652c27be6e79cc.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;塑料雕塑《未来的主人》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3068&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/9f948d3e18c37a4249bfc19b2de9d96e.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;陶瓷工艺《金刚山青华装饰花瓶》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3067&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/b3c5b9454f13c7f3cae6640b7b1f647e.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;陶瓷工艺《明沙十里的夜晚》釉上装饰花瓶<span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3066&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/c5ed469dac88493bb59ac862fb6ebcff.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;陶瓷工艺《松树与仙鹤》浮雕纹花瓶  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3065&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/786e6cda2ec974162ef83d572bc9334f.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;蛋壳工艺《松树与木兰花》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
											</div>
																			
								</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img" style="padding: 0px;">
										<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/art/show_detail?sp=0&id=3064&language=chinese" target="_self"> </a>
										<img src="uploads/art_articles/a56cea65dfae5cf5e9a206daa22690e1.jpg" alt="img" class="cover-image">
										<!-- <img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/home_new/6.jpg" alt="img" class="cover-image"> -->
									</div>
									<div class="card-body" style="padding:5px; height:58px;display:flex;">
										<div class="item-card9 h-rotate">
											<p class="home_slide_item_text fs-18 name-nowrap chinese-font" style='margin-bottom:0px;'>
												<span>&nbsp;&nbsp;蛋壳工艺《鸵鸟》  <span>
											</p>
										</div>
									</div>
																														<div class="sticker-doc new-data-badge-ch">
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
						<a class="culture_article" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/home_detail?kind=40&language=chinese" class="card-options-collapse">
						</a>

					</div>
					<div class="col-md-12 home_culture_life_bar_bg">
					</div>
					<div class="col-md-12" style="overflow:scroll; height:240px;">
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1912&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>怀念之白雪								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1912&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1911&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>为了祖国和人民								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1911&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1910&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>同主体法律建设史一道永放光芒的伟大业绩								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1910&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1909&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>同人民这一称呼一道熠熠生辉的伟大的一生								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1909&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1908&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>享有尊严的人民的国家								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1908&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1907&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>团结一心的国家								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1906&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>千万人民的坚定信念和宣誓之歌
歌曲《宁死不抛弃革命信念》
								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1906&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1884&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>千万人民坚定不移的信念和意志
欣赏歌曲《我们的信念》								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1884&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1883&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>引以为傲的朝鲜式农村文明之实体								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1883&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1882&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>世代传唱的爱国之歌
欣赏歌曲《强大的母亲我祖国》								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_article_page?id=1882&language=chinese" class="text-success">
										<i class="fa fa-image"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																										<span>
											<!-- <div class="culture-new-span"> -->
											<span class="pulsate-regular chinese-font">
												新											</span>
											<!-- </div> -->
									</span>
																								</div>
											</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="col-md-12">
						<a class="culture_life" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/culture_life?language=chinese">
						</a>
					</div>
					<div class="col-md-12 home_culture_life_bar_bg">

					</div>
					<div class="col-md-12 " style="overflow:scroll; height:240px;">
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=832&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第8届四月之春人民艺术节中(2)								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=832&language=chinese" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=867&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>朝鲜美术（8）								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=867&language=chinese" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=764&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>朝鲜美术（6）								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=764&language=chinese" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=763&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>第8届四月之春人民艺术节中(1)								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=763&language=chinese" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=589&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>朝鲜美术（4）								</a>
																	<a href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=589&language=chinese" class="text-success">
										<i class="fa fa-video-camera"></i>
									</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=241&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>乙密台								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=240&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>东明王陵								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=239&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>朝鲜象棋								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=238&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>朝鲜的民族风俗之一——拜年								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/detail_page?id=237&language=chinese">
									<i class="fa fa-file-text-o" aria-hidden="true" style="padding-right:10px;"></i>幸福乐园——阳德温泉								</a>
																<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
																																</div>
											</div>
				</div>
				<div class="col-lg-3 col-md-12">
					<div class="col-md-12">
						<a class="download_bar" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/index.php/home/home_detail?kind=50&language=chinese">
						</a>
					</div>
					<div class="col-md-12 home_culture_life_bar_bg">

					</div>
					<div class="col-md-12" style="overflow:scroll; height:240px;">
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/0e07aa8c706ffb6da7d27bc9a9972c0a.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>第34届 四月之春友谊艺术节 参加申请书								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/81e93ad58ab3b8320625d5fd32319b66.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>第34届 四月之春友谊艺术节 组织纲要								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/5983840186c2d91e896eb2839a95f23c.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>艺术节象征物								</a>
																																</div>
													<div class="col-md-12 ">
								<a class="chinese-font home-article_title" href="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/uploads/news_articles/2ed02261afb509ced3e736801a148675.zip">
									<i class="fa fa-download" style="padding-right:10px;"></i>第33届 四月之春友谊艺术节 参加申请书								</a>
																																</div>
						
					</div>
				</div>
			</div>
							<div class="row" style="padding-top:20px;">
				<div class="col-lg-2 col-md-12 pl-5 april-nav">
						<a class="edu_bar" href="index.php/education/organ_detail__language_korean"></a>
					</div>
					<div class="col-lg-2 col-md-12 pl-6 mobile-april-nav">
						<a class="go-detail chinese-font" href="index.php/education/organ_detail__language_korean">
							艺术教育单位							<span></span>
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
											<p><span class="chinese-font">主体音乐艺术的原种场——平壤金元均音乐舞蹈综合大学<span></p>
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
											<p><span class="chinese-font">平壤美术大学<span></p>
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
											<p><span class="chinese-font">中区东岸高中 早期声乐班<span></p>
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
											<p><span class="chinese-font">大同门幼儿园<span></p>
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
						<a class="go-detail chinese-font" href="index.php/education/organ_detail__language_korean">
							艺术创作单位							<span></span>
						</a>
					</div>
					<div class="col-lg-10 col-md-12" style="padding: 0px 35px;">
						<div style="margin-top: 5px; border-bottom: 3px solid #AFADAE;"></div>
						<div id="orgCarousel" data-items=6 class="owl-carousel owl-carousel-icons_8 pb-2 pt-5" style="margin-top: 5px;">
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
											<p><span class="chinese-font">朝鲜字母式舞蹈标记信息局<span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/company/detail__kind_5_language_korean">
										</a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/c9f2020fdd22a205f19acb20aa928bbb.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="chinese-font">血海歌剧团<span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/company/detail__kind_5_language_korean">
										</a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/ca6d01438561837eb2a0cff2b190b2e9.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="chinese-font">国立民族艺术团<span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/company/detail__kind_5_language_korean">
										</a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/2a714cf7cc121ddbf199e13f0c7195e9.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="chinese-font">国立话剧团<span></p>
										</div>
									</div>
																																				</div>
															<div class="item card" style="border:none; margin-bottom:0px;">
									<div class="item7-card-img">
										<a href="index.php/company/detail__kind_5_language_korean">
										</a>
										<div class="mb-2" style="height:120px;display:flex;">
											<img src="uploads/department_catalogs/22c65694ff134d63e3bfc1b81aa9d521.jpg" alt="img" class="cover-image align-self-center" style="display:flex;">
										</div>
									</div>
									<div class="card-body" style="padding:5px; display:flex;">
										<div class="item-card9 h-rotate">
											<p><span class="chinese-font">国立杂技团<span></p>
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
											<p><span class="chinese-font">平壤木偶戏团<span></p>
										</div>
									</div>
																																				</div>
													</div>

					</div>
				</div>
										<div class="row">
					<div class="col-md-12 mt-4 mb-2 pt-1">
						<div style="border-bottom: 6px solid #aaa; border-top: 3px solid #ccc;display:flex;">
							<img src="assets/images/site-back.png" style="width:70px;margin:0px 20px 0px 40px;"><span class="chinese-font" style="font-size:20pt;font-weight:700;align-self: center;padding-top:3px;color:darkred;text-shadow: 4px 4px 10px darkred;">其他网页</span>
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
											<h4 class="video-modal-title" style="font-family: 'Simsun'; font-size: 18px; display: inline-block; margin: 0px; color: #fffdd5; font-weight: bolder;"></h4>
									</div>
				<button type="button" class="close p-1 m-0" data-dismiss="modal" style="width:70px;color:white;">&times;</button>			</div>
			<div class="modal-body" style="padding: 0px;">
				<div style="text-align: center;">
				</div>
				<div id="videoFrameWrapper" class="embed-responsive embed-responsive-16by9" style="background-color:black;">
					<iframe id="videoFrame" src="" style="width: 100%; height: 100%"></iframe>
				</div>
			</div>
			<div class="modal-footer" style="display:none;background-color:dimgrey; font-family: 'Simsun'">
				<a href="" class="btn btn-outline-white hidden download-link"><i class="fa fa-download"></i>&nbsp;&nbsp;下载</a>
				<button type="button" class="btn btn-outline-white" onclick="javascript:hls_video_close();"><i class="fa fa-close"></i>&nbsp;&nbsp;关闭</button>
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
													<h4 style="font-family: 'Simsun'; color: #621E02; font-size: 26px; text-align: left;"><strong>介   绍</strong></h4>
							<p style="font-family: 'Simsun'; text-align: justify; color: black;"><strong>《朝鲜艺术》网站开设于2019年，专门介绍朝鲜民主主义人民共和国文化艺术全貌。<br>《朝鲜艺术》网站管理部将提供更方便而全面的界面，登载更丰富的艺术资料。</strong></p>
											</div>
					<div class="col-lg-7 col-md-12 footer-main-right">
						<div class="row">
							<div class="col-md-2">
							</div>
							<div class="col-md-6">
																	<h4 style="font-family: 'Simsun'; color: #621E02; font-size:26px;"><strong>联系方式</strong></h4>
																<ul class="list-unstyled mb-0">
									<li class="chinese-font" style="color:#ffff;"><strong>地址: 朝鲜民主主义人民共和国平壤市中区外城洞</strong></li>
									<li class="chinese-font" style="color:#ffff;"><strong>电话: 00850-2-18111(Ext.)-381-8653 </strong></li>
									<li class="chinese-font" style="color:#ffff;"><strong>传真: 00850-2-381-4410</strong></li>
								</ul>
							</div>
							<div class="col-md-4" style="top: -10px;">
								<img src="assets/images/qr_cer.png" width="80px" style="margin-left: 10px;" alt=""><br /><br />
																	<p style="font-family: 'Simsun';">
										<strong>朝鲜民主主义人民共和国文化省</strong>
									</p>
															</div>
						</div>

					</div>

				</div>
				<div class="row mobile-april-nav">
					<div class="col-lg-5 col-md-12">
													<h4 style="margin: 10px; font-family: 'Simsun'; color: #621E02; font-size: 26px; text-align: left;"><strong>介   绍</strong></h4>
							<p style="margin: 10px; font-family: 'Simsun'; text-align: justify; color: black;"><strong>《朝鲜艺术》网站开设于2019年，专门介绍朝鲜民主主义人民共和国文化艺术全貌。<br>《朝鲜艺术》网站管理部将提供更方便而全面的界面，登载更丰富的艺术资料。</strong></p>
											</div>
					<div class="col-lg-7 col-md-12">
						<div class="row">
							<div class="col-md-2">
							</div>
							<div class="col-md-6">
																	<h4 style="font-family: 'Simsun'; color: #621E02; font-size:26px;"><strong>联系方式</strong></h4>
																<p class="chinese-font" style="color:#ffff;"><strong>地址: 朝鲜民主主义人民共和国平壤市中区外城洞</strong></p>
								<p class="chinese-font" style="color:#ffff;"><strong>电话: 00850-2-18111(Ext.)-381-8653 </strong></p>
								<p class="chinese-font" style="color:#ffff;"><strong>传真: 00850-2-381-4410</strong></p>
							</div>
							<div class="col-md-4" style="top: -10px;">
								<img src="assets/images/qr_cer.png" width="80px" style="margin-left: 10px;" alt=""><br /><br />
																	<p style="font-family: 'Simsun';">
										<strong>朝鲜民主主义人民共和国文化省</strong>
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

	var vtotal = "共";
	var vitems = "个";
	var vcnt = "个数";
	var vsrch = "搜索";
	var nofilter = "搜索结果不存在.";
</script>

<script>
	var site_url_other = "index.html";
	var language = 'chinese';
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
	var cat_but_0_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/0_0-ch.png";
	var cat_but_0_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/0_1-ch.png";
	var cat_but_0_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/0_2-ch.png";

	var cat_but_8_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/8_0-ch.png";
	var cat_but_8_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/8_1-ch.png";
	var cat_but_8_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/8_2-ch.png";



	var cat_but_1_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/1_0-ch.png";
	var cat_but_1_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/1_1-ch.png";
	var cat_but_1_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/1_2-ch.png";

	var cat_but_2_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/2_0-ch.png";
	var cat_but_2_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/2_1-ch.png";
	var cat_but_2_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/2_2-ch.png";

	var cat_but_3_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/3_0-ch.png";
	var cat_but_3_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/3_1-ch.png";
	var cat_but_3_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/3_2-ch.png";

	var cat_but_4_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/4_0-ch.png";
	var cat_but_4_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/4_1-ch.png";
	var cat_but_4_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/4_2-ch.png";


	var cat_but_5_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/5_0-ch.png";
	var cat_but_5_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/5_1-ch.png";
	var cat_but_5_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/5_2-ch.png";

	var cat_but_6_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/6_0-ch.png";
	var cat_but_6_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/6_1-ch.png";
	var cat_but_6_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/6_2-ch.png";

	var cat_but_7_0 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/7_0-ch.png";
	var cat_but_7_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/7_1-ch.png";
	var cat_but_7_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/april/7_2-ch.png";


	//인민예술축전


	var pe_fes_but_0_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/0_1-ch.png";
	var pe_fes_but_0_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/0_2-ch.png";

	var pe_fes_but_1_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/1_1-ch.png";
	var pe_fes_but_1_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/1_2-ch.png";

	var pe_fes_but_2_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/2_1-ch.png";
	var pe_fes_but_2_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/2_2-ch.png";

	var personal_fes_but_2_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/2_1-ch.png";
	var personal_fes_but_2_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/2_2-ch.png";

	var pe_fes_but_3_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/3_1-ch.png";
	var pe_fes_but_3_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/3_2-ch.png";

	var pe_fes_but_4_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/4_1-ch.png";
	var pe_fes_but_4_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/4_2-ch.png";

	var pe_fes_but_5_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/5_1-ch.png";
	var pe_fes_but_5_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/people_fes/5_2-ch.png";

	var personal_fes_but_5_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/5_1-ch.png";
	var personal_fes_but_5_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/personal_fes/5_2-ch.png";

	var musical_contest_but_6_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/6_1-ch.png";
	var musical_contest_but_6_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/6_2-ch.png";

	var musical_contest_but_7_1 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/7_1-ch.png";
	var musical_contest_but_7_2 = "https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/musical_contest/7_2-ch.png";
</script>
<!--음악-->

<div class="modal fade show" id="music_modal" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-lg chinese-font">
		<div class="modal-content">
			<div class="modal-header" style="padding: 7px; background-color: chocolate;">
				<div class="row" style="width: 100%;">
					<!-- <div class="col-md-4">
						<span class="pull-left" style="font-size: 22px; display: inline-block; color: #fffdd5; font-weight: bolder;">
							<img src="https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/stage/image/music_img.png" height="60px;" alt="">
						</span>
					</div> -->
					<div class="col-md-12" style="text-align: center;">
						<p class="modal-title chinese-font" id="music-modal-title" style="font-size: 16px; display: inline-block; margin: 0px; color: #fffdd5;"></p>

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
				<button type="button" class="btn btn-outline-white-2" onclick="javascript:music_modal_close();"><i class="fa fa-close"></i>&nbsp;&nbsp;关闭</button>
			</div>
		</div>
	</div>
</div>

<!--    본문보여주기-->

<div id="text_modal" class="modal fade">
	<div class="modal-dialog modal-lg chinese-font" role="document">
		<div class="modal-content ">
			<div class="modal-header pd-x-20">
				<h4 class="modal-title">
					<span id="text_modal_subtitle"></span>
											<p id="text_modal_title" style="font-family: 'Simsun'; color: #0267be; font-weight: bold; font-size: 16px;margin-top: 10px; "></p>
									</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body pd-20 modal-scrollable" style="height: 300px;">
				<h5 class=" lh-3 mg-b-20"><a href="" class="font-weight-bold" id="modal_intro"></a></h5>

									<p class="article-body" id="modal_content" style="font-family: 'Simsun'; color: black;"></p>
							</div>
			<div class="modal-footer">
				<a id="modal_link" class="btn btn-red hidden" href="/"><i class="fa fa-link"></i>阅览</a>
				<button type="button" class="btn btn-blue" data-dismiss="modal">关闭</button>
			</div>
		</div>
	</div>
</div>

<div id="text_modal_xl" class="modal fade">
	<div class="modal-dialog chinese-font" role="document" style="width:90%;max-width:90%;">
		<div class="modal-content" style="min-height:500px;">
			<div class="modal-header pd-x-20">
				<h4 class="modal-title">
					<span id="subtitle"></span>
											<p id="title" style="font-family: 'Simsun'; color: #0267be; font-weight: bold; font-size: 16px;margin-top: 10px; "></p>
									</h4>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body pd-20 modal-scrollable">
				<h5 class="lh-3 mg-b-20"><a href="" class="font-weight-bold" id="intro"></a></h5>

									<div class="article-body" id="content" style="font-family: 'Simsun'; color: black;"></div>
							</div>
			<div class="modal-footer">
				<a id="modal_link" class="btn btn-red hidden" href="/"><i class="fa fa-link"></i>阅览</a>
				<button type="button" class="btn btn-blue" data-dismiss="modal">关闭</button>
			</div>
		</div>
	</div>
</div>


<div id="news_modal_mobile" class="modal fade chinese-font">
	<div class="modal-dialog modal-lg chinese-font" role="document">
		<div class="modal-content ">
			<div class="modal-header pd-x-20">
				<h4 class="modal-title">
					<span id="mobile_text_modal_subtitle"></span>
											<p id="mobile_text_modal_title" style="font-family: 'Simsun'; color: #0267be; font-weight: bold; font-size: 16px;margin-top: 10px; "></p>
									</h4>
				<!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button> -->
			</div>
			<div class="modal-body pd-20 modal-scrollable" style="height: 300px;">
				<h5 class=" lh-3 mg-b-20"><a href="" class="font-weight-bold" id="mobile_modal_intro"></a></h5>

									<p class="mobile_article-body" id="mobile_modal_content" style="font-family: 'Simsun'; color: black;"></p>
							</div>
			<!-- <div class="checkbox news-checkbox-div">
				<label><input class="news-checkbox" id="news_modal_check" type="checkbox" value="1">一天不显示</label>
			</div>
			<div class="text-right" style="padding-right:30px">

				<a id="mobile_modal_link" class="btn btn-red hidden" href="/"><i class="fa fa-link"></i>阅览</a>
				<button type="button" class="btn btn-blue" data-dismiss="modal" onclick="javascript:on_news_modal_close();">关闭</button>
			</div> -->
			<div class="checkbox news-checkbox-div" style="margin-left:5px;">
				<label><input class="news-checkbox" id="news_mobile_modal_check" type="checkbox" value="1">一天不显示</label>
			</div>
			<div class="modal-footer">

				<a id="mobile_modal_link" class="btn btn-red hidden chinese-font" href="/"><i class="fa fa-link"></i>阅览</a>
				<button type="button" class="btn btn-blue chinese-font" data-dismiss="modal" onclick="javascript:on_news_mobile_modal_close();">关闭</button>
			</div>
		</div>
	</div>
</div>

<div id="news_modal" class="modal fade">
	<div class="modal-dialog modal-lg chinese-font" role="document" style="max-width:1200px; width: 1100px; height: 611px; background-image: url(https://web.archive.org/web/20260101im_/http://www.korart.sca.kp/assets/images/news_bg.png);">
		<div class="modal-content " style="background-color: transparent; border: 0;">
			<div class="chinese-font" style="border:0">
				<div style="margin-top: 45px;margin-left: 40px;color: white; font-size: 16pt;">
					通告				</div>
				<div>
											<h4 id="news_modal_title" class="modal-title" style="font-family: 'Simsun'; color: #1b75bb; font-size: 16pt;margin-top: 45px;margin-left: 20px;width:70%; text-align:center">

						</h4>
									</div>
			</div>
			<div class="modal-body pd-20 modal-scrollable" style="padding-top: 35px; overflow-y: unset !important;">
				<h5 class=" lh-3 mg-b-20"><a href="" class="font-weight-bold" id="modal_intro"></a></h5>
				<img id="news_modal_image" src="assets/images/april/asfaf.png" style="float: left; width: 150px; margin: 20px 0 0 25px" />
									<p class="article-body" id="news_modal_content" style="font-family: 'Simsun'; color: white;font-size: 14pt;padding: 0 20px;width: 550px;overflow: auto;height: 240px;"></p>
							</div>
			<div class="checkbox news-checkbox-div chinese-font">
				<label><input class="news-checkbox" id="news_modal_check" type="checkbox" value="1">一天不显示</label>
			</div>
			<div class="text-right" style="padding-right:170px">

				<a id="news_link" class="btn btn-red hidden chinese-font" href="/"><i class="fa fa-link"></i>阅览</a>
				<button type="button" class="btn btn-blue chinese-font" data-dismiss="modal" onclick="javascript:on_news_modal_close();">关闭</button>
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
																	<span class="modal_subtitle" style="font-family: 'Simsun'; color:#f8f8f8; font-size: 16px; padding-right: 4px;"></span>
									<h4 class="video-modal-title" id="font-family: 'Simsun'; video_modal_title" style="font-size: 22px; display: inline-block; margin: 10px 0px 0px 0; color: #f5f5f5;"></h4>
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
					<button type="button" class="btn btn-outline-white" onclick="javascript:onVideoClose();"><i class="fa fa-close"></i>&nbsp;&nbsp;关闭</button>
				</div>
			</div>
		</div>
	</div>
</div> -->
</div>
</body>

</html>