export function checkYears(date, minAge) {
  const [year, month, day] = date.split("-").map(Number);
  const birthdate = new Date(year, month - 1, day);

  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();

  return age >= minAge;
}

export function testCPF(cpf) {
  var Soma;
  var Resto;
  Soma = 0;
  let i;

  if (cpf == "98989898989") return true;
  if (cpf == "00000000000") return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(10, 11))) return false;
  return true;
}

export function todayDate() {
  const [date, _] = new Date().toISOString().split("T");
  const [year, month, day] = date.split("-");
  const today = `${day}/${month}/${year}`

  return today;
}