export function checkYears(date, minAge) {
  const [year, month, day] = date.split("-").map(Number);
  const birthdate = new Date(year, month - 1, day);

  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();

  return age >= minAge;
}
