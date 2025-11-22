// 极客时间清屏脚本
function GeekTimeClear(){

	$("._1lgUyPfS_0").click(() => {
		setTimeout(function () {
			location = location
		}, 1000 * 3)
	})

	$('._1kh1ihh6_0 ::selection').css({
		'background-color': 'blue !important'
	})
	var textarea = '<textarea style="width:1000px;height:500px;position:fixed;z-index:9999;" id="thistextarea"></textarea>';

	// $("#app").find('div').eq(0).find('div').eq(0).remove();
	
	$('.Index_side_2umED').remove();
	$('.Toolbar_toolbar_3rYXr').remove();
	$('.Index_articleCover_3sTdB').remove();
	$('.AudioPlayerPC_main_1QFlQ').remove();
	$('.MindMap_mindmap-box_1yZTE').remove();
	$('.MindMap_desc_26qCL').remove();
	$('.ArticleLikeModulePc_LikeWrapper_HqHD5').remove();
	$('.Index_copyright_3Cbwk').remove();
	$('.Index_copyright_3Cbwk').remove();
	$('.Index_comment_1Pwfq').remove();
		$('.Index_comments_3HIaO').remove();
		$('.Syllabus_syllabusContainer_3Ya_u').remove();
	


	$("._1kh1ihh6_0").removeClass('_1kh1ihh6_0')

	let vimg = [];

	$(".ps").each(function () {
		let t = $(this).text()
		$(this).css({
			"padding":"15px"
		})
	})
return
	let vtitle = $(".cZCVMzBP_0").text()
	$("div").each(function () {
		let dataCodeLanguage = $(this).attr("data-code-language")
		console.log(dataCodeLanguage)

		let slatetype = $(this).attr('data-slate-type')
		if (slatetype == 'pre') {
			$(this).find('div').eq(0).remove()
			$(this).find('div').eq(1).hide()
		}

		let datacodelinenumber = $(this).attr('data-code-line-number')

		if (datacodelinenumber) {
			$(this).remove()
		}

		let imgs = $(this).find('img').attr('src');


		if (imgs) {
			if (imgs == 'https://static001.geekbang.org/resource/image/d8/6e/d80106af8866281d3335ddb264ee396e.jpg' || imgs == 'https://static001.geekbang.org/resource/image/10/ae/10ca151069383502eacd5ad0684a97ae.jpg'

			) {
				$(this).remove();
			}
		}


		if (imgs) vimg.push(imgs);

		let title = $(this).find('h1').text();
		if (title && title.indexOf('|') > 0) {
			document.getElementsByTagName("title")[0].innerText = title;
			//console.log(title)
		}

		// console.log(slatetype, datacodelinenumber)
	})

	$('#thistextarea').val(vimg.join('\n'));
	// $('img:last-child').remove();


	let t = $("#app").html()

	return
	let describe = '极客时间备份'
	let linepath = window.location.href
	let nr = t
	$.ajax({
		type: "POST",
		url: "http://localhost:80/mywww/php/requestOnline.php",
		data: {
			act: 'saveContenttoTXT',
			describe: describe,
			linepath: linepath,
			nr: nr,
			title: vtitle
		},
		success: function (data) {
			console.log(data)
			window.open(data)
			if (data == 'ok') {
				// window.close();
			}
		},
		error: function (data) {

		}
	});
	//$('._3-b6SqNP_0').remove();
}
