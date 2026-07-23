function convertToDate(date: string) {
  const dateFormatted = new Date(date);

  if(!isNaN(dateFormatted.getTime())) {
    return dateFormatted;
  }

  return null;
}

export function formatDate(date: string): string {
  const dateFormatted = convertToDate(date);

  if(dateFormatted) {
    return dateFormatted.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return '';
}

export function formatTime(date: string): string {
  const dateFormatted = convertToDate(date);

  if(dateFormatted) {
    return dateFormatted.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return '';
}