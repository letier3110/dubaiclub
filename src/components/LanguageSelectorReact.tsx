import { ChangeEvent, FC, useState } from 'react'
import '../i18n/config'
import { useTranslation } from 'react-i18next'

interface LanguageSelectorReactProps {}

// Languages
const languages = [
  { name: 'English', code: 'en' },
  { name: 'Українська', code: 'uk-UA' }
]

export const LanguageSelectorReact: FC<LanguageSelectorReactProps> = ({}) => {
  const currentLocale = 'uk-UA'
  const [language, setLanguage] = useState(currentLocale)
  const { t, i18n } = useTranslation()

  const handleChangeLocale = (e: ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <div className='switcher'>
      {/* Language switch dropdown here */}
      <span>{t('languages')}</span>{' '}
      <select onChange={handleChangeLocale} value={language}>
        {languages.map(({ name, code }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
