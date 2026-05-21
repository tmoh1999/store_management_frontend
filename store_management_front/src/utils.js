export function getLocalDate(){
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export function formatDate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};  
export function getMonthRange(year=-1,mounth=-1){
  const now = new Date();
  let start=null;
  let end=null;
  
  if(mounth>=0 && year>=0){
    start = new Date(year, mounth, 1);
    end = new Date(year, mounth + 1, 0);

  }else{
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  return {
    start_date: formatDate(start),
    end_date: formatDate(end),
  };
};