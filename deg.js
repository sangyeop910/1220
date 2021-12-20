document.getElementsByClassName("icol-3 ")[0].children[0].addEventListener('click',shopHanlder);
document.getElementsByClassName("icol-3 ")[0].children[1].addEventListener('click',downloadHandler);
document.getElementsByClassName("icol-3 ")[0].children[2].addEventListener('click',configureHandler);
document.getElementsByClassName("plus_btn")[0].addEventListener('click', AddMenuPop);

let key_value = [["yes"], ["simple"], ["edgeR"], [], [], [], [1], ["P-value"], [0.05]];

function shopHanlder(){ alert('set'); }

function configureHandler(){
	const configureModal = document.getElementsByClassName("pro_li_plot_pop pop01")[0];
	const pv = document.getElementById("pv");
	const fc = document.getElementById("fc");
	const cpm = document.getElementById("cpm");
	const btn_apply = document.getElementById("apply");
	const btn_pval = document.getElementById('pop03_op1');
	const btn_fdr = document.getElementById('pop03_op2');
	const num = document.getElementsByClassName('icol-4 num');
	const repli = document.getElementById('replicate');
	const deg_pi = document.getElementById('deg_pipe');
	const gr = document.getElementsByClassName('btn_wr icol-3');
	
	let pvv = [50, 10, 1];
	let fcv = [1, 2, 3];
	let cpmv = [0, 1, 2];
	
	console.log(key_value)
	let user_gr = ['1deeedf', 'asf3r', 'mg3fdf', 'akdde4'];
	
	configureModal.setAttribute('style','none;');
	
	btn_pval.addEventListener('click', ch_pval);
	btn_fdr.addEventListener('click', ch_fdr);
	btn_apply.addEventListener('click', applyBtnHandler);
	
	pv.addEventListener('click', pval);
	fc.addEventListener('click', log_fc);
	cpm.addEventListener('click', log_cpm);
	
	repli.addEventListener('input', select_repli);
	deg_pi.addEventListener('input', select_pipe);
	/*
	for(let i=0; i<user_gr.length; i++){
		const newp = document.createElement('div')
		newp.setAttribute('class', 'btn btn03 r_btn bt_gray');
		newp.innerText = user_gr[i];
		newp.value = user_gr[i];
		newp.addEventListener('click', select_group);
		gr[0].children[0].appendChild(newp);
		gr[0].children[0].children[i].style.display = 'table-cell';
		gr[0].children[0].children[i].style.borderRadius = '7px';
		gr[0].children[0].children[i].style.border = '2px solid white';
		//gr[0].children[0].children[i].style.background = 'user_color[i]';
	}*/

	for(let i=0; i<pv.children.length; i++){
		pv.children[i].value = pvv[i];
		fc.children[i].value = fcv[i];
		cpm.children[i].value = cpmv[i];
	}
	for(let i=0; i<3; i++){
		for(let j=0; j<3; j++){
			num[i].children[j].style.width = '20%';	
		}	
	}
	function ch_pval() {
		pf.innerText = 'P-value'
		key_value[7][0] = pf.innerText;
	}
	function ch_fdr() {
		pf.innerText = 'FDR'
		key_value[7][0] = pf.innerText;
	}
	function pval(e){//pval
		pv_floor = e.target.value;
	}
	function log_fc(e){//log fc
		fc_floor = e.target.value;
	}
	function log_cpm(e){//log cpm
		cpm_floor = e.target.value;
	}
	function select_pipe(e) {
		let val = e.target.value;
		console.log(val);
		key_value[2][0] = val;
	}
	function select_repli(e) {
		let val = e.target.value;
		console.log(val);
		key_value[1][0] = val;
	}
	function select_group(e){
		/*let val = e.target.value;//두 개만 선택되도록 제한
		console.log(e.target.value);
		key_value[5].push(val);*/
	}
	function applyBtnHandler() {
		let conf = document.getElementsByClassName('pro_li_plot_pop pop01');
		let loading = document.getElementsByClassName('loading');

		const chartArea = document.getElementsByClassName("Graph chart_area")[0]
		if (!!chartArea.getElementsByTagName('svg')[0]) {
			chartArea.removeChild(chartArea.getElementsByTagName('svg')[0])
		}
		//draw(datas[1], datas[0]);

		if(pv_floor == undefined){
			key_value[8][0] = 0.05;	
		}else{
			key_value[8][0] = pv_floor / 1000;	
		}
		if(fc_floor == undefined){
			key_value[6][0] = 1;	
		}
		else{
			key_value[6][0] = fc_floor;	
		}
		//key_value[][] = cpm_floor;

		if(pv_floor == undefined || fc_floor == undefined || cpm_floor == undefined){
			alert("please input numeric")
		}else{
			loading[0].style.display = 'block';
			conf[0].style.display = 'none';	
		}
		requestData();
	}	
	return key_value;
}


let datas = {};
/*let X_mod, Y_mod;
let Menu = new Array();*/
let pv_floor, fc_floor, cpm_floor;
let pf = document.getElementById('PorF');

function getData(){
	$.ajax({
		url: get_context_path() + "/deg/deg_data",
		type: "GET",
		async: true,
		dataType: "Json",
		data: {
			"deg_pipe": key_value[2][0],
		},
		success: function(data) {
			console.log("success");
			return data;
		}
	});
}
function requestData(){
	const loading = document.getElementsByClassName('loading')[0];
	loading.setAttribute("style", "display:block");
	console.log(key_value[7][0]);
    $.ajax({
        url : get_context_path() + "/deg/do_deg",
        type : "POST",
		async : true,
        data : {
                "replicate" : key_value[0][0],
                "design" : key_value[1][0],
                "deg_pipe" : key_value[2][0],
                "group_colname" : "irRECIST",
                "group" : "Progressive Disease,Complete Response",
                "group_col" : "darkgrey,yellow",
                "log2fc" : key_value[6][0],
                "pf" : key_value[7][0],
                "cutoff" : key_value[8][0],
        },
		success:function(filePath) {
			console.log(filePath)
			const checkDegEnd = setInterval(function() {
				$.ajax({
					url: get_context_path() + "/deg/check_deg_status",
					type: "POST",
					async: true,
					data: {
						"file_path": filePath,
					},
					success: function(status) {
						if(status == "done"){
							console.log("done");
							clearInterval(checkDegEnd);
							setDegPanel(filePath);
							// callback 함수 호출
						}
					}
				});
			}, 5000); // interval end
		}
    });
}
let test1;
let test2;
let test3;


function setDegPanel(filePath){
	console.log(filePath);
	d3.tsv(`/rdap/deg/get_deg_tsv_json`,{
		method:"POST",
      	body: JSON.stringify({
       	file_path : filePath
      }),
	}).then(result => {
		console.log(result)
		let da=result;
		test3 = result;
		let data2 = new Array();
		let attrs;
		let Menu = new Array();
		
		//gr[0].children[0].children[0].style.background = 'blue';
		
		let datx = datas[1];
		let daty = datas[0];
		let datp = datas[2];
		let datf = datas[3];
		datx = datx.map(datx => Number(datx));
		daty = daty.map(daty => Number(daty));
		datp = datp.map(datp => Number(datp));
		datf = datf.map(datf => Number(datf));

		attrs = Object.keys(result[0]).filter(a => {
	        let test1 = Number(result[0][a]);
	        if (isNaN(test1) != true) {
	            return (typeof test1 === "number")
	        }
	    });
	    name_tag = Object.keys(result[0]).filter(a => {
	        let test2 = Number(result[0][a]);
	        if (isNaN(test2) == true) {
	            return (typeof test2 === "number")
	        }
	    });
	
	    data1 = result.map(d => name_tag.map((a, i) => d[a]));//Symbols
	    data2 = result.map(d => attrs.map((a, i) => d[a]));//data(자료형은 string)
	 
	    let num_columns_len = attrs.length;
	
	    for (let i = 0; i < num_columns_len; i++) {//Menu배열에 모든 경우의 수 할당
	        for (let j = 0; j < num_columns_len; j++) {
	            if (attrs[i] != attrs[j])
	                Menu.push(attrs[i] + " : " + attrs[j])
	        }
	    }
	
	    for (let i = 0; i < num_columns_len; i++) {//datas 선언
	        datas[i] = new Array();
	    }
	
	    for (let i = 0; i < data2.length; i++) {//datas에 데이터 할당
	        for (let j = 0; j < num_columns_len; j++) {
	            datas[j].push(data2[i][j]);
	        }
	    }
		
	    let xa = Menu[0].split(':')[0];//앞 gene
	    let ya = Menu[0].split(':')[1];//뒤 gene
	
	    X_mod = xa.slice(0, -1);//공백 제거
	    Y_mod = ya.slice(1);//공백 제거

		draw(datas[1], datas[0], da);

	}).catch(e => {
    	console.log(e)
	});//======================================//d3.tsv
}

//===========================================//d3.tsv

function draw(q, p, da) {//================================//draw 함수
	let x_min = Math.min.apply(null, q);
	let x_max = Math.max.apply(null, q);
	let y_min = Math.min.apply(null, p);
	let y_max = Math.max.apply(null, p);
	
    let svg = d3.select(".Graph")//svg area
        .append("svg")
        .attr("width", 1200)
        .attr("height", 1010)
        .attr("viewBox", [0, 0, 1220, 1020])
        .append("g")
        .attr("transform", "translate(" + 40 + "," + 10 + ")");

    let x = d3.scaleLinear()//x aixs
        .domain([x_min - 0.06, x_max])
        .range([0, 1170]);
    svg.append("g")
        .attr("transform", "translate(0," + 980 + ")")
        .call(d3.axisBottom(x));

    let y = d3.scaleLinear()//y aixs
        .domain([y_min - 0.05, y_max + 0.1])
        .range([980, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    let gs = svg.selectAll(".point")//scatter plot, dots
        .data(da)
        .enter()
        .append("g")
        .append("circle")
        .attr("id", "c1")
        .attr("class", "point")
        .attr("fill", "black")
        .style("stroke-width", 2)
        .attr("cx", (d, i) => x(q[i]))
        .attr("cy", (d, i) => y(p[i]))
        .attr("r", 2)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
	const loading = document.getElementsByClassName('loading')[0];
	loading.setAttribute("style", "display:none");
	document.querySelector("#container\\ chart_area").setAttribute("style", "display:block");
	document.getElementsByClassName("Graph chart_area")[0].setAttribute("style", "display:block");
	
	function redraw() {
		const datx = datas[1];
		const daty = datas[0];
		const datp = datas[2];
		const datf = datas[3];

		let PVAL_or_FDR;

		datx = datx.map(datx => Number(datx));
		daty = daty.map(daty => Number(daty));
		datp = datp.map(datp => Number(datp));
		datf = datf.map(datf => Number(datf));

		if (pf.innerText == 'FDR') {
			PVAL_or_FDR = datf;
		} else {
			PVAL_or_FDR = datp;
		}

		for (let i = 0; i < c1.length; i++) {
			if (PVAL_or_FDR[i] < pv_floor / 1000) {
				if (datx[i] < cpm_floor && daty[i] < fc_floor) {
					c1[i].style.fill = 'blue';
					//c1[i].style.stroke = 'blue';
				} else {
					c1[i].style.fill = 'red';
					//c1[i].style.stroke = 'red';
				}
			} else {
				c1[i].style.fill = 'black';
				//c1[i].style.stroke = 'black';
			}
		}
	}
	redraw();
}//====================================================//draw 함수

const tooltip = d3.select(".Graph")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("padding", "5px")
    .style("border", "2px solid black")
    .style("width", "200px")
    .style("pointer-events", "none")
    .style("background", "white")
    .style("text-align", "center")
    .style("font-size", "12px");

function mouseover(event, d, val) {//mouse over
    tooltip.style("opacity", 1)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 45) + "px")
        .html(/*d["gene"] + "<br/>" + */"logAvrExp : " + d["logAvrExp"] + "<br/>" + "logFC : " + d["logFC"] + 
			"<br/>" + "PValue : " + d["PValue"] + "<br/>" + "FDR : " + d["FDR"] + "<br/>" +  
			"F : " + d["F"])
    d3.select(this).style("r", 4);
}//mouse over

function mouseout(d) {//mouse out
    d3.select(this).style("r", 2);
    tooltip.style("opacity", 0);
}//mouse out

window.onload = function(){
	configureHandler();
}