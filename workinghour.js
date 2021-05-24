	/**
#Objective:
write a function to calculate the expiry datetime. The expiry datetime is 3 WORKING hours from the "now" input parameter.
the working hours is defined in the "schedule" input parameter.
You should write the function in javascript programming language.

@param {Date} now - current datetime. e.g: '2019-10-11T08:13:07+0800'
@param {Array} schedule - an array of objects. which specified the day open or close and also the start and end of working hours
[
	{"open": false, "open_at": "", close_at: ""}, // sunday
	{"open": true, "open_at": "09:00", close_at: "18:00"}, // monday
	{"open": true, "open_at": "09:00", close_at: "18:00"},
	{"open": true, "open_at": "09:00", close_at: "18:00"},
	{"open": true, "open_at": "09:00", close_at: "18:00"},
	{"open": true, "open_at": "09:00", close_at: "17:00"},
	{"open": false, "open_at": "", close_at: ""},
]
@returns {Date} - datetime, 3 working hour from input date ("now"), which is 11 am of next monday

# example:
If "now" is friday 4pm. and "schedule" as the above sample, the expiry date should be next monday 11 am. because on friday office close
at 5pm and office is closed on weekend.
*/


let  schedule =
[
{"open": false, "open_at": "", close_at: ""}, // sunday
{"open": true, "open_at": "09:00", close_at: "18:00"}, // monda
{"open": true, "open_at": "09:00", close_at: "18:00"},
{"open": true, "open_at": "09:00", close_at: "18:00"},
{"open": true, "open_at": "09:00", close_at: "18:00"},
{"open": true, "open_at": "09:00", close_at: "17:00"},
{"open": false, "open_at": "", close_at: ""},
]
 var now = new Date("2019-10-11T16:13:07");
 console.log("Current date",now)
 let result= find(now, schedule);

async function find(now, schedule){
	const getNextOpenDay=makeInputVerifier(new Date(now),schedule,0);
	let hours=3;
	while(true){
	 const FirstOpenday=await getNextOpenDay.getNextOpenDay();
	 let Firstloop=0;
	 let OpenDate;
	 // check now date and next open date is equal or not
	 if(now.getTime()==getNextOpenDay.currentDate.getTime()){
	   // set open date if the now date is less than current opendate open hrs.
	   if(now.getTime()<(getNextOpenDay.AddTime(FirstOpenday.open_at).getTime())){
		  OpenDate=await getNextOpenDay.AddTime(FirstOpenday.open_at)
	   }
	   else{
		 OpenDate=await getNextOpenDay.AddTime(now.getHours() +":"+
		 now.getMinutes())
	   }
	 }
	 else{
	  OpenDate=await getNextOpenDay.AddTime(FirstOpenday.open_at)
	 }
	 // set close date
	 let CloseDate=await getNextOpenDay.AddTime(FirstOpenday.close_at)
	 if(CloseDate.getTime()<OpenDate.getTime() + (hours * 60 * 60 * 1000)){
	   // set balance hours
	   if((CloseDate.getTime()<now.getTime()) && Firstloop==0){
		  hours=3;
	   }
	   else{
	  	hours=msToTime((OpenDate.getTime() + (hours * 60 * 60 * 1000))-CloseDate.getTime())
	   }
	   Firstloop=1;
	   getNextOpenDay.currentDate.setDate(getNextOpenDay.currentDate.getDate() + 1)
	 }
	 else{
	   console.log("Expiry date",new Date(OpenDate.getTime() + (hours * 60 * 60 * 1000)))
	   return new Date(OpenDate.getTime() + (hours * 60 * 60 * 1000))
	   break;
	 }
	}
}


function makeInputVerifier(dateNow,schedule,Type){
    let currentDate=dateNow;
     function getNextOpenDay(){
        while (true) {
         if((schedule[currentDate.getDay()]).open==true){
          //return suitable opened schedule
          return schedule[currentDate.getDay()];            
         }
         else{
           // Add a day
           currentDate.setDate(currentDate.getDate() + 1);
         }
       }
    }
   
     function AddTime(timesNow){
       const dateNow=new Date(currentDate);
       let hrs=Number(timesNow.split(':')[0]);
       let mns=Number(timesNow.split(':')[1]);
       dateNow.setHours(hrs);
       dateNow.setMinutes(mns);
       dateNow.setSeconds(0);
       return dateNow
     }
    return {getNextOpenDay,currentDate,AddTime}
}

function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    //minutes=(minutes/60)*100
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return Number(hours) + "." + Number(minutes);
}