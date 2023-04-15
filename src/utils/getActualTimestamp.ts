export async function getActualTimestamp() {
  const timezone = await fetch("http://worldtimeapi.org/api/ip");
  const timezoneData = await timezone.json();
  const timestamp = timezoneData.unixtime;
  return timestamp;
}
