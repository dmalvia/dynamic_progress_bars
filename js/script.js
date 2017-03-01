(function() {
  getBarsData();	
})();

function getBarsData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var buttons = data.buttons;
      var bars = data.bars;
      var limit = data.limit;

      dynamicBarsData(buttons, bars, limit);
    }
    else {
    	console.log('No Data');
    }
  };
  xhttp.open("GET", "http://pb-api.herokuapp.com/bars", true);
  xhttp.send();
}

function dynamicBarsData(buttons, bars, limit) {
	 console.log(limit);
	var select = document.createElement("Select");
	var appDiv = document.getElementById('selectbar');
	var appBarDiv = document.getElementById('appendBars');
	
	appDiv.appendChild(select);
	select.setAttribute("id","selectbr");
	for(i=0; i < bars.length; i++) {
		var pBar = document.createElement("div");
		var progress = document.createElement("div");
		var progressLabel = document.createElement("div");
		var barPercent = (bars[i]/limit)*100;
		var valReturn = decimalVal(barPercent);
		var option = document.createElement("option");
		progress.setAttribute("id","progress"+i);
		pBar.setAttribute("id","progressbar-"+i);
		pBar.setAttribute("class","bars");
		progressLabel.setAttribute("class","percentLabel");
		progressLabel.setAttribute("id","percentLabel"+i);
    	var t = document.createTextNode(valReturn+"%");
    	pBar.appendChild(progress);
    	pBar.appendChild(progressLabel);
    	progressLabel.appendChild(t);
    	appBarDiv.appendChild(pBar);
    	option.value = 'progressBar-' + i;
   		option.text = 'progressBar-' + i;
   		select.appendChild(option);
 		animateProgressBar(0,valReturn,progress);
		
	}

	for(i=0; i < buttons.length; i++) {
		var btn = document.createElement("BUTTON");
		btn.setAttribute("id","changebar-"+i);
    	var t = document.createTextNode(buttons[i]);
    	btn.appendChild(t);
    	appDiv.appendChild(btn);
	}

	document.querySelector('body').addEventListener('click', function(event) {
	  if (event.target.tagName.toLowerCase() === 'button') {
	  	var buttonValue = parseFloat(event.target.innerHTML);
	    var selectedBarValue = document.getElementById('selectbr').value;
	    var selectedBarValue = selectedBarValue.split("-");
	    var activeBar = document.getElementById('progress'+selectedBarValue[1]);
	    var activePreviousBarPercent = parseFloat(document.getElementById('percentLabel'+selectedBarValue[1]).innerHTML.replace('%',''));	
	    /* Last Value*/ 
	    var activePreviousBarValue = decimalVal((activePreviousBarPercent/100)*limit);
	    var activeNewBarPercent = decimalVal(((parseFloat(activePreviousBarValue) + (buttonValue))/limit)*100);
	    if(activeNewBarPercent > 0) {
	    	document.getElementById('percentLabel'+selectedBarValue[1]).innerHTML = activeNewBarPercent+'%';
	    	if(activeNewBarPercent >= 100) {
	    		activeBar.style.width = "100%";
	    		activeBar.style.backgroundImage = "url('')";
	    		activeBar.style.backgroundColor = "red";
	    	}
	    	else {
	    		animateProgressBar(activePreviousBarPercent,activeNewBarPercent,activeBar);
	    	}
	    }
	    else {
	    	alert('Progress Bar should be positive in number');
	    }
	  }
	});
}

function animateProgressBar(startVal, endVal, activeProgressBar) {
	if(startVal < endVal) {
		var id1 = setInterval(frame1, 15);
	}
	else {
		var id2 = setInterval(frame2, 15);
	}

	function frame1() {
	    if (startVal >= endVal) {
	      clearInterval(id1);
	    } else {
	      startVal++; 
	      activeProgressBar.style.width = startVal + '%';
	      activeProgressBar.style.backgroundImage = "url('images/pbar-ani.gif')";
	      activeProgressBar.style.height = "22px"; 
	    }
	}    
 	
 	function frame2() {
	    if (startVal >= endVal) {
	      startVal--; 
	      activeProgressBar.style.width = startVal + '%';
	      activeProgressBar.style.backgroundImage = "url('images/pbar-ani.gif')";
	      activeProgressBar.style.height = "22px";
	      
	    } else {
	      clearInterval(id2); 
	    }
	} 
}

function decimalVal(barPercent) {
	return barPercent.toFixed(2);
}