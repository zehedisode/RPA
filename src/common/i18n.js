/**
 * i18n — Hafif çeviri modülü
 * Varsayılan dil: Türkçe (tr)
 */

import trLocale from '../locales/tr'
import enLocale from '../locales/en'

const locales = {
    tr: trLocale,
    en: enLocale
}

const STORAGE_KEY = 'ui_vision_lang'

let currentLang = (() => {
    try {
        return localStorage.getItem(STORAGE_KEY) || 'tr'
    } catch (e) {
        return 'tr'
    }
})()

/**
 * Çeviri fonksiyonu
 * @param {string} key — Çeviri anahtarı 
 * @param {object} [params] — İsteğe bağlı parametre değişkenleri, örn: { name: 'test' }
 * @returns {string}
 */
export function t(key, params) {
    const locale = locales[currentLang] || locales['tr']
    let text = locale[key]

    if (text === undefined) {
        // Fallback: önce İngilizce, sonra anahtar
        text = locales['en'][key] || key
    }

    if (params) {
        Object.keys(params).forEach(k => {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k])
        })
    }

    return text
}

/**
 * Dil değiştir
 * @param {string} lang — 'tr' veya 'en'
 */
export function setLang(lang) {
    if (locales[lang]) {
        currentLang = lang
        try {
            localStorage.setItem(STORAGE_KEY, lang)
        } catch (e) { }
    }
}

/**
 * Aktif dili getir
 * @returns {string}
 */
export function getLang() {
    return currentLang
}

export default t
