export default class IdDict {
  constructor() {
    this.added = new Set()
    this._keys = []
    this.values = []

//    this.size = this.size.bind(this)
  }

  put = (key, value) => {
    if (this.added.has(key)) {
      // Update the exists
      const index = this._keys.indexOf(key)
      this._keys[index] = key
      this.values[index] = value
    } else {
      this._keys.push(key)
      this.values.push(value)
      this.added.add(key)
    }
  }

  // Update another dict to this dict
  update = (that) => {
    for (const key of that.keys()) {
      this.put(key, that.get(key))
    }
  }

  get = (key) => {
    if (!this.added.has(key)) {
      return undefined
    } else {
      const index = this._keys.indexOf(key)
      return this.values[index]
    }
  }

  has = (key) => this.added.has(key)

  keys() {
    return this._keys
  }

  get size() {
    return this.added.size
  }
}
