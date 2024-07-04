function truncateNumber(nombre) {
  // Convert number to string
  const nombreString = nombre.toString();

  // Check if the number starts with 0
  if (nombreString.startsWith('0')) {
    // Truncate to 8 decimal places
    const tronque = parseFloat(nombre).toFixed(8);
    return parseFloat(tronque);
  }
  // Truncate to 2 decimal places
  const tronque = parseFloat(nombre).toFixed(2);
  return parseFloat(tronque);
}

export default truncateNumber;
