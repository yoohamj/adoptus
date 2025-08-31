import { useMemo } from 'react'
import PhoneInput from 'react-phone-input-2'

export default function PhonePicker({ code = '+1', number = '', onChange, className = '' }) {
  const raw = useMemo(() => {
    const n = String(number || '').replace(/\D/g, '')
    const c = String(code || '+1').replace(/\D/g, '')
    return `${c}${n}`
  }, [code, number])

  const handleFullChange = (val /* numeric digits string */, countryData) => {
    const dial = countryData?.dialCode ? String(countryData.dialCode) : '1'
    const v = String(val || '')
    const newCode = `+${dial}`
    let newNum = v.startsWith(dial) ? v.slice(dial.length) : v
    newNum = newNum.replace(/\D/g, '')
    onChange && onChange({ code: newCode, number: newNum, full: `+${v}` })
  }

  return (
    <div className={className}>
      <PhoneInput
        country={'us'}
        preferredCountries={['ca','us']}
        value={raw}
        onChange={handleFullChange}
        inputProps={{ name: 'phone', autoComplete: 'tel', inputMode: 'tel' }}
        enableSearch
        countryCodeEditable
      />
    </div>
  )
}
