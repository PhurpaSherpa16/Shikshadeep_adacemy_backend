export const isRequired = (value) => {
    if (!value || value.trim() === "") {
        return false
    }
    return true
}

export const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const isPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
}

export const isString = (value) => typeof value === "string"

export const isNumber = (value) => typeof value === "number"

export const isBoolean = (value) => typeof value === "boolean"

export const isDate = (value) => typeof value === "date"


export const maxLength = (value, length) =>{
    value.length <= length
}

export const minLength = (value, length) =>{
    value.length >= length
}

export const normalizeSpace = (value) => value.replace(/\s+/g, " ").trim()
