export function checkYears(date, minAge) {
  const [year, month, day] = date.split("-").map(Number);
  const birthdate = new Date(year, month - 1, day);

  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();

  return age >= minAge;
}

export function todayDate() {
  const [date, _] = new Date().toISOString().split("T");
  const [year, month, day] = date.split("-");
  const today = `${day}/${month}/${year}`

  return today;
}