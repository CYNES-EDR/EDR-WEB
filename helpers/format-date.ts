function formatDateString(inputDateString:string) {
  if(inputDateString===""){
    return ""
  }
    // Create a new Date object
    var date = new Date(inputDateString);
  
    // Extract date components
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero-based, so we add 1
    var year = date.getFullYear();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
  
    // Format the date string
    var formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  
    // Return the formatted date
    return formattedDate;
  }
  export default formatDateString;
  