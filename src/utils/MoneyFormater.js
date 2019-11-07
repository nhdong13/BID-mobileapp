export function formater(money) {
  if (money) {
    return money.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
  }
  return 0;
}
