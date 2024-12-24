const abbreviations = ['k', 'm', 'b', 't'];

export function abbreviateNumber(number: number, decimals: number = 2): string {
  let result = String(number);
  decimals = Math.pow(10, decimals);

  // Go through the array backwards, so we do the largest first
  for (let i = abbreviations.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    const size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decimals, round, and then divide by decimals.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decimals) / size) / decimals;

      // Handle special case where we round up to the next abbreviation
      if (number == 1000 && i < abbreviations.length - 1) {
        number = 1;
        i++;
      }

      result = String(number) + abbreviations[i];
      break;
    }
  }

  return result;
}