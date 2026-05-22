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
export function getMonthRange(year=null, month=null) {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth();

    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);

    return {
        start_date: formatDate(start),
        end_date: formatDate(end),
    };
}