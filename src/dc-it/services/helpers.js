const helpers = {
  serialize: arr => {
    let res = `a:${arr.length}:{`
    for (let i = 0; i < arr.length; i += 1) {
      res += `i:${i};s:${arr[i].length}:"${arr[i]}";`
    }
    res += '}'

    return res
  },
  dateFormat(date, t = false) {
    const y = date.getFullYear()
    const m = (((date.getMonth() + 1).toString().length === 1) ? '0' : '') + (date.getMonth() + 1).toString()
    const d = (date.getDate().toString().length === 1 ? '0' : '') + date.getDate().toString()
    let r = `${y}-${m}-${d}`
    if (t) {
      r += ' '
      const h = (date.getHours().toString().length === 1 ? '0' : '') + date.getHours().toString()
      const i = (date.getMinutes().toString().length === 1 ? '0' : '') + date.getMinutes().toString()
      const s = (date.getSeconds().toString().length === 1 ? '0' : '') + date.getSeconds().toString()
      r += `${h}:${i}:${s}`
    }
    return r
  },
  numberFormat(number) {
    const n = parseFloat(number)
    const val = (n).toFixed(2)// .replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  capitalize(value) {
    if (value) {
      const arr = value.toString().split(' ')
      for (let i = 0; i < arr.length; i += 1) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase()
      }
      return arr.join(' ')
    }
    return value
  },
}

export default helpers
