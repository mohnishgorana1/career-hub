export function timeAgo(inputDate: string): string {
    const date = new Date(inputDate);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = Math.floor(seconds / 31536000); // 1 year = 31536000 seconds
    if (interval >= 1) {
      return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
    }
  
    interval = Math.floor(seconds / 2592000); // 1 month = 2592000 seconds
    if (interval >= 1) {
      return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
    }
  
    interval = Math.floor(seconds / 86400); // 1 day = 86400 seconds
    if (interval >= 1) {
      return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
    }
  
    interval = Math.floor(seconds / 3600); // 1 hour = 3600 seconds
    if (interval >= 1) {
      return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
    }
  
    interval = Math.floor(seconds / 60); // 1 minute = 60 seconds
    if (interval >= 1) {
      return interval === 1 ? `${interval} minute ago` : `${interval} minutes ago`;
    }
  
    return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
  }
  
//   // Example usage
//   const dateString = "2024-09-26T13:34:14.932Z";
//   console.log(timeAgo(dateString)); // Outputs something like '2 hours ago' (based on current time)
  