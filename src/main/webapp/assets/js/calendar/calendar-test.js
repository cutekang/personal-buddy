
const headerToolbar = {
    left: 'prevYear,prev',
    center: 'title',
    right: 'next,nextYear'
}

document.addEventListener("DOMContentLoaded", function () {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	const dayName = dayNames[today.getDay()];
	const fullKoreanDate = `${yyyy}.${mm}.${dd}.${dayName}`;
	const todaySpan = document.querySelector(".today-span");
	
	todaySpan.innerText = fullKoreanDate;
	
	document.getElementById('start-date').value = `${yyyy}-${mm}-${dd}`;
	document.getElementById('end-date').value =`${yyyy}-${mm}-${dd}`;
	document.getElementById('start-time').value = '00:00'; 
	document.getElementById('end-time').value = '23:59';
	
	const label = document.getElementById("custom-select-label");
	const options = document.querySelector(".custom-select-options");
	const optionItems = document.querySelectorAll(".calendar-option");
	const hiddenSelect = document.getElementById("hidden-select");
	

	// 라벨 클릭 → 드롭다운 열기/닫기
	label.addEventListener("click", (e) => {
		e.stopPropagation();
		options.classList.toggle("show");
	});

	// 옵션 클릭 → 뷰 전환 + 라벨 변경
	optionItems.forEach(option => {
		option.addEventListener("click", () => {
		  const value = option.dataset.value;
		  const text = option.innerText;
	
		  label.innerText = `${text}`;
		  hiddenSelect.value = value;
		  options.classList.remove("show");
	
		  calendar.changeView(value); // FullCalendar 뷰 변경
		});
	});

	// 외부 클릭 → 드롭다운 닫기
	document.addEventListener("click", () => {
		options.classList.remove("show");
	});
	
	const colorSelectBox = document.getElementById('colorSelectBox');
	const selectedColor = colorSelectBox.querySelector('.color-selected');
	const colorOptions = colorSelectBox.querySelector('.color-options');
	const colorHiddenInput = document.getElementById('colorSelectedValue');

	// 옵션 열기/닫기
	selectedColor.addEventListener('click', () => {
	  colorOptions.style.display = colorOptions.style.display === 'block' ? 'none' : 'block';
	});

	// 옵션 선택
	colorOptions.querySelectorAll('div').forEach(option => {
	  option.addEventListener('click', () => {
	    selectedColor.innerHTML = option.innerHTML;
	    colorHiddenInput.value = option.getAttribute('data-color');
	    colorOptions.style.display = 'none';
	  });
	});

	// 외부 클릭 시 닫기
	document.addEventListener('click', e => {
	  if (!e.target.closest('#colorSelectBox')) {
	    colorOptions.style.display = 'none';
	  }
	});
	
    const calendarEl = document.getElementById('calendar');
	
	let lastSelectedInfo = null;
	
    const calendar = new FullCalendar.Calendar(calendarEl, {
	    initialView: 'dayGridMonth',
		headerToolbar: headerToolbar,
		locale: 'kr',        // 언어 설정
		editable: true,      // event(일정) 
		allDaySlot: false,           // ✅ 이 옵션으로 All-day 칸 제거
		dayCellContent: function(arg) {
		    return arg.date.getDate(); // ✅ 숫자만 반환
	  	},
	    selectable: true,
		select: function(info) {
			lastSelectedInfo = info;
			applySelectionStyle(info);
		},

		unselectAuto: false, // ❗ 자동 unselect 방지
		datesSet: function() {
			// 뷰 바뀌면 다시 스타일 적용
			if (lastSelectedInfo) {
				setTimeout(() => {
			        applySelectionStyle(lastSelectedInfo);
			    }, 10);
			}
		},
		dayMaxEventRows: true, // <= 월간 뷰에서 최대 n줄까지 표시
		dayMaxEvents: 2,
		views: {
			timeGridWeek: {
				eventMaxStack: 1
			},
			timeGridDay: {
				eventMaxStack: 4
			},
		},
		moreLinkText: function(num) {
			return `${num}+`;
		},
		eventDidMount: function(info) {
			const viewType = info.view.type;
			const dotColor = info.event.extendedProps.dotColor; // dot 색상 기본값
			console.log(dotColor);
		  	const bgColor = info.event.extendedProps.bgColor;
			// ✅ 주간/일간일 때만 별도 처리
			  if (viewType.startsWith("timeGrid")) {
			    const mainEl = info.el.querySelector(".fc-event-main");
			    if (mainEl && bgColor) {
			      mainEl.style.setProperty("background-color", bgColor, "important");
			    }

			    // ✅ dot 삽입
			    if (mainEl && !mainEl.querySelector(".fc-dot")) {
			      const dot = document.createElement("div");
			      dot.className = "fc-dot";
				  
				  dot.style.cssText = `
				        width: 10px;
				        height: 10px;
						margin-top: 5px;
						margin-bottom: 5px;
						margin-left: 50%;
				        border-radius: 50%;
				        background-color: ${dotColor} !important;
				        vertical-align: middle;
				      `;
			      mainEl.prepend(dot);
			    }
			  } else {
			    // ✅ 월간(dayGrid) 뷰는 그냥 el에 색상 적용
			    if (bgColor) {
			      info.el.style.setProperty("background-color", bgColor, "important");
			    }
			  }

			  // ✅ 공통 스타일
			  info.el.style.border = "none";
			  info.el.style.borderRadius = "25px";
			  info.el.style.color = "#000";
			  info.el.style.fontSize = "14px";
			  
		  },
		  slotEventOverlap: false,
    });
	function applySelectionStyle(info) {
		// 1. 기존 선택 제거
		document.querySelectorAll('.fc-day-selected, .fc-slot-selected')
		.forEach(el => el.classList.remove('fc-day-selected', 'fc-slot-selected'));
	
		const viewType = calendar.view.type;
	
		if (viewType === 'dayGridMonth') {
			// 📅 월간 뷰: 날짜 셀에 스타일
			const start = info.startStr;
			const end = info.endStr;
		
			document.querySelectorAll('[data-date]').forEach(el => {
				const date = el.getAttribute('data-date');
				if (date >= start && date < end) {
					el.classList.add('fc-day-selected');
				}
			});
	
		} else if (viewType === 'timeGridWeek' || viewType === 'timeGridDay') {
			// ⏰ 주간/일간 뷰: 시간 셀에 스타일
			const start = info.start;
			const end = info.end;
		
			document.querySelectorAll('.fc-timegrid-slot').forEach(slot => {
				const timeStr = slot.getAttribute('data-time');
				const dateContainer = slot.closest('[data-date]');
				if (!dateContainer || !timeStr) return;
			
				const dateStr = dateContainer.getAttribute('data-date');
				const fullDate = new Date(`${dateStr}T${timeStr}`);
			
				if (fullDate >= start && fullDate < end) {
				  slot.classList.add('fc-slot-selected');
				}
			});
		}
	}
	                          
	todaySpan.addEventListener	("click", (e) => {
		calendar.today();
	});

    calendar.render();
	calendar.updateSize(); // 클릭 위치와 시간 매칭 맞추기 위해 꼭 호출
	
	calendar.on("eventMouseEnter", info => console.log("eEnter:", info));
	calendar.on("eventMouseLeave", info => console.log("eLeave:", info));
	
	function isTimeIncluded(date) {
		return !(date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0);
	}
	
	calendar.on("dateClick", info => {
		const date = info.date;
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		
		const formatDate = `${year}-${month}-${day}`;

		let formatStartTime = `00:00`;
		let formatEndTime = `23:59`;
		if(isTimeIncluded(date) || info.dateStr.includes("T")){
			let hour = String(date.getHours()).padStart(2, '0');
			let minute = String(date.getMinutes()).padStart(2, '0');
			
			let timeString = `${hour}:${minute}`;
			
			formatStartTime = timeString;
			formatEndTime = timeString;
		}
		console.log(formatEndTime);
		document.getElementById('start-date').value = formatDate;
        document.getElementById('end-date').value = formatDate;
		
		document.getElementById('start-time').value = formatStartTime;
		document.getElementById('end-time').value = formatEndTime;
	});
	
	calendar.on("select", info => {
		let startDate = info.start;
		let startYear = startDate.getFullYear();
		let startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
		let startDay = String(startDate.getDate()).padStart(2, '0');
		
		let formatStartDate = `${startYear}-${startMonth}-${startDay}`;
		
		let endDate = info.end;
		let endYear = endDate.getFullYear();
		let endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
		let endDay = String(endDate.getDate() - 1).padStart(2, '0');

		let formatStartTime = `00:00`;
		let formatEndTime = `23:59`;
		
		if(isTimeIncluded(startDate)){
			let startHour = String(startDate.getHours()).padStart(2, '0');
			let startMinute = String(startDate.getMinutes()).padStart(2, '0');
			
			let timeString = `${startHour}:${startMinute}`;
			
			formatStartTime = timeString;
		}
		
		if(isTimeIncluded(endDate)){
			endDay = String(endDate.getDate()).padStart(2, '0');
			let endHour = String(endDate.getHours()).padStart(2, '0');
			let endMinute = String(endDate.getMinutes()).padStart(2, '0');
			
			let timeString = `${endHour}:${endMinute}`;
			
			formatEndTime = timeString;
		}

		let formatEndDate = `${endYear}-${endMonth}-${endDay}`;
		
		document.getElementById('start-date').value = formatStartDate;
        document.getElementById('end-date').value = formatEndDate;

		document.getElementById('start-time').value = formatStartTime;
		document.getElementById('end-time').value = formatEndTime;
	});
	
	function hexToRGBA(hex, alpha = 1) {
		hex = hex.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
	
	document.querySelector(".save-btn").addEventListener("click", (e) => {
		
		const calendarTitle = document.getElementById("title-input").value;
		const calendarDesc = document.getElementById("event-desc").value;
		
		const calendarScheduleColor = document.getElementById("colorSelectedValue").value;
		
		const startDate = document.getElementById("start-date").value;
		const startTime = document.getElementById("start-time").value;
		const startDateAndTime = changeFormatDateAndTime(startDate,startTime);

		const endDate = document.getElementById("end-date").value;
		const endTime = document.getElementById("end-time").value;
		const endDateAndTime = changeFormatDateAndTime(endDate,endTime);
		
		if(calendarTitle == null || calendarTitle == ""){
			alert("일정의 제목을 작성해주세요.");
			return;
		}
		if(!isValidDateTime(startDateAndTime)
			|| !isValidDateTime(endDateAndTime)){
			alert("날짜 형식이 올바르게 입력되지 않았습니다.");
			return;
		}
		
		calendar.addEvent({
		    title: calendarTitle,
		    start: startDateAndTime,
		    end: endDateAndTime,
			color: calendarScheduleColor, // ✔ dot 색상용 (필수)
			extendedProps: {
				dotColor: calendarScheduleColor,
				bgColor: `${hexToRGBA(calendarScheduleColor, '0.3')}`
			},
			textColor: "#000",
		  });
	})
	
	function hexToRGBA(hex, alpha = 1) {
	  hex = hex.replace('#', '');
	  const r = parseInt(hex.slice(0, 2), 16);
	  const g = parseInt(hex.slice(2, 4), 16);
	  const b = parseInt(hex.slice(4, 6), 16);
	  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
	
	function changeFormatDateAndTime(date, time){
		let result = "";
		result = date + "T" + time + ":00";
		return result;
	}
	
	function isValidDateTime(str) {
	  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
	  return isoRegex.test(str) && !isNaN(Date.parse(str));
	}
});