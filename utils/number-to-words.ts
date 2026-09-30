// utils/number-to-words.ts
export function numberToWordsEs(num: number): string {
  const units = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"]
  const teens = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ]
  const tens = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"]
  const hundreds = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ]

  if (num === 0) return "cero"

  function convertLessThanOneThousand(n: number): string {
    let s = ""
    if (n >= 100) {
      s += hundreds[Math.floor(n / 100)]
      if (n % 100 === 0 && n !== 100) s = s.replace("ciento", "cien") // "cien" for 100, "ciento" for 101-199
      n %= 100
      if (n > 0) s += " "
    }
    if (n >= 20) {
      s += tens[Math.floor(n / 10)]
      if (n % 10 !== 0) s += " y " + units[n % 10]
    } else if (n >= 10) {
      s += teens[n - 10]
    } else if (n > 0) {
      s += units[n]
    }
    return s.trim()
  }

  let result = ""
  const integerPart = Math.floor(num)
  const decimalPart = Math.round((num - integerPart) * 100) // Obtener los centavos

  if (integerPart === 100) {
    result = "cien"
  } else if (integerPart < 1000) {
    result = convertLessThanOneThousand(integerPart)
  } else if (integerPart < 1000000) {
    const thousands = Math.floor(integerPart / 1000)
    const remainder = integerPart % 1000

    if (thousands === 1) {
      // Para 1000-1999, se usa "mil"
      result = "mil"
    } else {
      // Para 2000+, se usa "dos mil", "tres mil", etc.
      result = convertLessThanOneThousand(thousands) + " mil"
    }

    if (remainder > 0) {
      result += " " + convertLessThanOneThousand(remainder)
    }
  } else {
    // Para números más grandes, simplificamos o extendemos según necesidad
    // Por ahora, solo hasta millones para este ejemplo
    const millions = Math.floor(integerPart / 1000000)
    const remainder = integerPart % 1000000
    result = convertLessThanOneThousand(millions) + " millón" + (millions > 1 ? "es" : "")
    if (remainder > 0) {
      result += " " + numberToWordsEs(remainder) // Recursivo para el resto
    }
  }

  // Solo añadir "con X centavos" si hay centavos reales
  if (decimalPart > 0) {
    result += ` con ${decimalPart} centavos`
  }

  return result.trim()
}
