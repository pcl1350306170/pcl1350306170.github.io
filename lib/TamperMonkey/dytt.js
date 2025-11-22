$(function () {
	setTimeout(function () {
		$("#cs_DIV_cscpvrich5041B").remove();
		var a = $("#Zoom span table tbody tr").html();
		var b = a.split('thunder://');
		var b2 = b[1].split('">ftp:');
		var link = 'thunder://' + b2[0];

		var name = $("#Zoom span table tbody tr td").text();
		var n = name.split('阳光电影www.ygdy8.com.');
		var Tname = n[1];
		var imagePath = $("#Zoom").find('img').eq(0).attr('src');

		let nr = $("#Zoom").text();
		let n2 = nr.split('类　　别')
		let n3 = n2[1].split('语　　言')
		let n4 = n3[0].split('/')
		let ntype = []
		for (let i = 0; i < n4.length; i++) {
			ntype.push(n4[i].replace(' ', '').replace('◎', '').replace('　', ''))
		}


		//window.open("http://localhost:80/mywww/vue-admin/php/getmonkey.php?path="+link +"&name="+Tname);

		$.ajax({
			type: "POST",
			url: "http://localhost:80/blog/movie/php/movie.php",
			data: {act: 'savemovie', path: link, name: Tname, imagePath: imagePath, type: ntype.join(',')},
			success: function (data) {
				console.log(data)
				if (data == 'ok') {
					window.close();
				}
			},
			error: function (data) {

			}
		});


	}, 1000)
})
