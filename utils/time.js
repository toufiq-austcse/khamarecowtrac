let convertTimeToSeconds = (hour,minute,second)=>{
  return hour*60*60 + minute*60 + second;
};

module.exports={
  convertTimeToSeconds
};
