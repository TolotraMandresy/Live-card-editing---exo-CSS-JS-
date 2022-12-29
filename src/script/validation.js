const liveEditing = (() => {
    String.prototype.capitalize = function () {
        return this.split(' ').map(t => (t[0]) ? t[0].toUpperCase() + t.substring(1) : '').join(' ')
    }

    class FormControl {
        static verify(formControl, regExp, msg) {
            const inputs = document.querySelectorAll(`#${formControl.id} input`)
            const errorMsgElement = document.querySelector(`#${formControl.id} small`)
            let isValid = true

            for (let i = 0; i < inputs.length; i++) {
                const background = document.querySelector(`#${formControl.id} .gradient:nth-of-type(${i + 1})`)
                const value = inputs[i].value

                isValid = isValid && regExp.test(value)
                formControl.value[i] = value

                if (!isValid) {
                    errorMsgElement.innerText = msg
                    background.classList.add('error')
                    break
                }
                else {
                    errorMsgElement.innerText = ""
                    background.classList.remove('error')
                }
            }
            
            return isValid
        }

        static containAlphaOnly(formControl) {
            return function () {
                return FormControl.verify(formControl, /^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Wrong format, alphabetic only')
            }
        }

        static containNumOnly(formControl, quantificateur = '+') {
            // const minLength=  quantificateur.match(/\d+/)[0] 
            const regExp = new RegExp(`^\\d${quantificateur}$`)
            return function () {
                return FormControl.verify(formControl, regExp, `Wrong format, number only`)
                // return FormControl.verify(formControl, regExp, `Wrong format, ${minLength} digits number only`)
            }
        }

        static isNotEmpty(formControl) {
            return function () {
                return FormControl.verify(formControl, /^.+$/, 'Can\'t be blank')
            }
        }

        constructor(defaultVal, formControl, displayer, cantBeEmpty, alphaOnly, numOnly, options= {quantifNumOnly: '+', lengthFormat: 0, separator: ''}) {
            this.defaultVal= defaultVal
            this.id = formControl
            this.displayer = displayer
            this.value = ['']
            this.verification = []
            this.separator = options.separator
            this.lengthFormat = options.lengthFormat

            if (cantBeEmpty) this.verification.push(FormControl.isNotEmpty(this))
            if (alphaOnly) this.verification.push(FormControl.containAlphaOnly(this))
            if (numOnly) this.verification.push(FormControl.containNumOnly(this, options.quantifNumOnly))
        }

        validate() {
            let valid= true
            for (const verif of this.verification){
                valid= valid && verif()
            }
            return valid
        }

        formatValue() {
            let splittedVal = this.value.map(val => val.capitalize()).join('')

            //display deault if no value
            if(!splittedVal) splittedVal= this.defaultVal.join('')
            
            const separated = []

            //si lengthFomat=0, pas de formatage
            if (!this.lengthFormat) this.lengthFormat = splittedVal.length

            for (let i = 0; i < splittedVal.length; i += this.lengthFormat) {
                separated.push(splittedVal.slice(i, i + this.lengthFormat))
            }
            return separated.join(this.separator)
        }

        showValue(){
            document.getElementById(this.displayer).innerText= this.formatValue()
        }

        startLive() {
            document.querySelectorAll(`#${this.id} input`).forEach(input => {
                input.addEventListener('input', () => {
                    this.validate()
                    this.showValue()
                })
            })
        }
    }

    const elements = {
        name: new FormControl(['Jane Appleseed'],'cardHolderName', 'name', true, true, false),
        number: new FormControl(['0000000000000000'],'cardNumber', 'id', true, false, true, {quantifNumOnly: '{16}', lengthFormat: 4, separator: ' '}),
        date: new FormControl([new Date().getMonth() + 1, new Date().getFullYear().toString().slice(2)], 'monthAndYear', 'dateExpShow', true, false, true, {quantifNumOnly: '{2}', lengthFormat: 2, separator: '/'}),
        cvc: new FormControl(['123'],'cvcForm', 'cvc', true, false, true, {quantifNumOnly: '{3}', lengthFormat: 3, separator: ''})
    }

    return {
        validateEveryInput(){
            let valid= true
            for (const form in elements){
                const currIsValid= elements[form].validate()
                valid = valid && currIsValid
            }

            return valid
        },
        start: () => {
            for (const form in elements)
                elements[form].startLive()
        }
    }
})()

liveEditing.start()