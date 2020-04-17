class DieCard extends HTMLElement {
	set hass(hass) {
		
// Die calendar v1.2 (18.04.2020)		

///// SETTINGS /////////////////////////////////////////////////////////////
		// String translations (translate these to your own language) //
		
		var bdTextToday = "Hôm nay"; // Today
		var bdTextTomorrow = "Ngày mai"; // Tomorrow
		var bdTextNone = "Không có"; // No during next
		var bdTextDays = "Ngày"; // days
		var bdTextIn = ""; // in
		
		
///// REGISTRY ////////////////////////////////////////////////////			

		var ngayMat=[
			{name:"Test Nội", day:25, month:3, year:1982},
			{name:"Test Ngoại", day:26, month:3, year:1989},
			{name:"Test Cậu", day:20, month:4,year:1989},
			{name:"Test Chú", day:2, month:2, year:2019},
			{name:"Test Bác", day:4, month:10, year:2014, s:1},
		];				
///// DO NOT EDIT BELOW THIS LINE //////////////////////////////////////////
				
		if (!this.content) {
			const card = document.createElement('ha-card');
			this.content = document.createElement('div');
			this.content.style.padding = '10px 10px 10px';
			card.appendChild(this.content);
			this.appendChild(card);
		}
///////############################		
		const entityId = this.config.entity;
		const state = hass.states[entityId];
		const stateStr = state ? state.state : 'unavailable';
			
		const numberOfDays = this.config.numberofdays ? this.config.numberofdays : 14; //Number of days from today upcomming days will be displayed - default 14		

		const date = new Date();
		const thu = ["Chủ Nhật","Thứ Hai", "Thứ Ba","Thứ Tư","Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
		const ddd =  getMonday(date);		
		
		var today = '';
		today = new Date();
		var act = today.getDay();
		if(act==0) act = 7;
		today = today.getDay();
		today = thu[today];			

		var day = [], lday = [];
		day[0] = ddd.getDate(); lday[0] = getLday(ddd);
		ddd.setDate(ddd.getDate() + 1); day[1] = ddd.getDate(); lday[1] = getLday(ddd);
		ddd.setDate(ddd.getDate() + 1); day[2] = ddd.getDate(); lday[2] = getLday(ddd);
		ddd.setDate(ddd.getDate() + 1); day[3] = ddd.getDate(); lday[3] = getLday(ddd);
		ddd.setDate(ddd.getDate() + 1); day[4] = ddd.getDate(); lday[4] = getLday(ddd);
		ddd.setDate(ddd.getDate() + 1); day[5] = ddd.getDate(); lday[5] = getLday(ddd);
		ddd.setDate(ddd.getDate() + 1); day[6] = ddd.getDate(); lday[6] = getLday(ddd);

		var today = '';
		today = new Date();
		var act = today.getDay();
		if(act==0) act = 7;
		today = today.getDay();
		today = thu[today];
			
		var currdate = (new Date()).toLocaleDateString('en-GB');
		var y = +Intl.DateTimeFormat("zh-TW-u-ca-chinese", {
			year: "numeric"
		}).format(date).match(/\d+/)[0],
			m = +Intl.DateTimeFormat("zh-TW-u-ca-chinese", {
				month: "numeric"
			}).format(date).match(/\d+/)[0],
			d = +Intl.DateTimeFormat("zh-TW-u-ca-chinese", {
				day: "numeric"
			}).format(date).match(/\d+/)[0],
			can = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"],
			chi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

		    y = can [(y - 1) % 10] + ' ' + chi [(y - 1) % 12];
	

		
		var current = new Date();
		var currentMonth = m;
		var currentDay = d;
		var currentYear = current.getFullYear();
		var currentDayTS = new Date(currentYear, currentMonth, currentDay).getTime();
		var oneDay = 24*60*60*1000;
		
		
		for(var i = 0; i < ngayMat.length; i++) {
			var obj = ngayMat[i];
			
			if ( ((obj.month) < currentMonth) || ( ((obj.month) == currentMonth) && (obj.day < currentDay) ) ) {
				obj.ts = new Date((currentYear+1), (obj.month), obj.day).getTime();
				obj.aPlus = 1;
			} else {
				obj.ts = new Date(currentYear, (obj.month), obj.day).getTime();
				obj.aPlus = 0;
			}
			
			obj.diff = Math.round( Math.abs( (currentDayTS - obj.ts)/(oneDay) ) );
			
			if ( obj.diff > numberOfDays) { obj.ts = 0; }
		}
		
		var sortertListe = ngayMat.sort((a, b) => (a.ts > b.ts) ? 1 : ((b.ts > a.ts) ? -1 : 0)); 
		var dayToday = "";
		var dayNext = "";
		
		for(var i = 0; i < sortertListe.length; i++) {
			
			var obj = sortertListe[i];
						
			if (((obj.month) == currentMonth) && (obj.day == currentDay)) {
				
				dayToday = dayToday + "<div class='bd-wrapper bd-today'><ha-icon class='ha-icon entity on' icon='mdi:christianity'></ha-icon><div class='bd-name'>" + obj.name + "</div><div class='bd-when'>" + bdTextToday + "</div></div>";
				
			} else if (obj.ts != 0) {
				
				var dbExpr = obj.diff == 1 ? bdTextTomorrow : bdTextIn + " " + obj.diff + " " + bdTextDays;
				dayNext = dayNext + "<div class='bd-wrapper'><ha-icon class='ha-icon entity' icon='mdi:calendar-clock'></ha-icon><div class='bd-name'>" + obj.name + "</div><div class='bd-when'>" + dbExpr + " (" + obj.day + "/" + obj.month + "), "+ y +"</div></div>";
				
			}
		}
		
		
		var cardHtmlStyle = `
		<div class="ldate">
        <div class="day">                   
        </div>
        <div class="date">          
          <div class="date1">${today}, &ensp; ${currdate} &emsp;&#8652;&emsp;  ${d}/${m} năm ${y}</div>
        </div>     
        </div>
      </div>
		<style>
			.bd-wrapper {
				padding: 5px;
				margin-bottom: 5px;
			}
			.bd-wrapper:last-child {
				OFFborder-bottom: none;
			}
			.bd-divider {
				height: 1px;
				border-bottom: 1px solid rgba(127, 127, 127, 0.7);
				margin-bottom: 5px;
			}
			.bd-today {
				font-weight: bold;
				OFFborder-bottom: 1px solid;
			}
			.bd-wrapper .ha-icon {
				display: inline-block;
				height: 20px;
				width: 20px;
				margin-left: 2px;
				margin-right: 5px;
				color: var(--paper-item-icon-color);
			}
			.bd-wrapper .ha-icon.on {
				margin-left: 2px;
				margin-right: 5px;
				color: var(--paper-item-icon-active-color);
			}
			.bd-name {
				display: inline-block;
				padding-left: 2px;
				padding-top: 2px;
			}
			.bd-none {
				color: var(--paper-item-icon-color);
			}
			.bd-when {
				display: inline-block;
				float: right;
				font-size: smaller;
				padding-top: 3px;
			}
		</style>
		`;
		
		if (!dayToday && !dayNext) {
			var cardHtmlContent = " ";
		} else if (!dayToday) {
			var cardHtmlContent = dayNext;
		} else if (!dayNext) {
			var cardHtmlContent = dayToday;
		} else {
			var cardHtmlContent = dayToday + "<div class='bd-divider'></div>" + dayNext;
		}
		
		this.content.innerHTML = cardHtmlStyle + cardHtmlContent;
		
	}
	
	
	
	setConfig(config) {
		this.config = config;
	}
	
// The height of your card. Home Assistant uses this to automatically distribute all cards over the available columns.
	getCardSize() {
		return 3;
	}
}

customElements.define('die-card', DieCard);
