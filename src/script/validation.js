const liveEditing = (() => {
    String.prototype.capitalize = function () {
        return this.split(' ').map(t => (t[0]) ? t[0].toUpperCase() + t.substring(1) : '').join(' ')
    }

    class FormControl {
        static verifyRegex(formControl, regExp, msg) {
            const inputs = document.querySelectorAll(`#${formControl.id} input`)
            let isValid = true

            for (let i = 0; i < inputs.length; i++) {
                const value = inputs[i].value
                let currentIsValid= regExp.test(value)
                isValid = isValid && currentIsValid

                FormControl.toggleErrorMsg(isValid, msg, formControl, i, currentIsValid)
                formControl.value[i] = value

                // if(!isValid) break
            }
            
            return isValid
        }

        static toggleErrorMsg(isValid, msg, formControl, inputIndex, currentIsValid){
            const errorMsgElement = document.querySelector(`#${formControl.id} small`)
            const background = document.querySelector(`#${formControl.id} .gradient:nth-of-type(${inputIndex + 1})`)

            //raha efa correct le eo am input ray de tsy asina backround mena
            if(currentIsValid) background.classList.remove('error')
            else background.classList.add('error')

            //raha tsy correct ny ray de apotra ny msg
            if (!isValid) errorMsgElement.innerText = msg
            else errorMsgElement.innerText = ""
        }

        static containAlphaOnly(formControl) {
            return function () {
                return FormControl.verifyRegex(formControl, /^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Wrong format, alphabetic only')
            }
        }

        static containNumOnly(formControl, quantificateur = '+') {
            // const minLength=  quantificateur.match(/\d+/)[0] 
            const regExp = new RegExp(`^\\d${quantificateur}$`)
            return function () {
                return FormControl.verifyRegex(formControl, regExp, `Wrong format, number only`)
                // return FormControl.verifyRegex(formControl, regExp, `Wrong format, ${minLength} digits number only`)
            }
        }

        static cantBeBlank(formControl){
            return ()=>{
                const inputs = document.querySelectorAll(`#${formControl.id} input`)
                let isValid = true

                for(let i=0; i<inputs.length; i++){
                    let currentIsValid= true
                    const value= inputs[i].value

                    if(value.trim()=='')
                        currentIsValid= false

                    isValid= isValid && currentIsValid
                    formControl.value[i] = value
                    FormControl.toggleErrorMsg(isValid, 'Can\'t be blank', formControl, i, currentIsValid)
                }

                return isValid
            }

        }

        static checkMinAndMax(formControl, minAndMax){
            return ()=>{
                const inputs = document.querySelectorAll(`#${formControl.id} input`)
                let isValid = true
    
                for(let i = 0; i < inputs.length; i++){
                    const value= inputs[i].value
                    const minMaxOfCurrent= minAndMax[i]
                    let currentIsValid= true
    
                    if(minMaxOfCurrent){
                        const min= parseInt(minMaxOfCurrent.min)
                        const max= parseInt(minMaxOfCurrent.max)
                        if( min != -Infinity) {
                            if( value < minMaxOfCurrent.min ){
                                currentIsValid= false
                                isValid= isValid && currentIsValid
                            }
                            FormControl.toggleErrorMsg(isValid, `Minimum value is ${minMaxOfCurrent.min}`, formControl, i, currentIsValid)
                        }

                        if(!isValid) continue
    
                        if ( max != Infinity ) {
                            if( value > max ){
                                currentIsValid= false
                                isValid= isValid && currentIsValid
                            }
                            FormControl.toggleErrorMsg(isValid, `Maximum value is ${minMaxOfCurrent.max}`, formControl, i, currentIsValid)
                        }
                    }
                }
    
                return isValid
            }
        }

        //minAndMax= [{min: ..., max: ...}, ....] or null
        constructor(defaultVal, formControl, displayer, canBeEmpty, alphaOnly, numOnly, options= {quantifNumOnly: '+', lengthFormat: 0, separator: '', minAndMax: []}) {
            this.defaultVal= defaultVal
            this.id = formControl
            this.displayer = displayer
            this.value = ['']
            this.verification = []
            this.separator = options.separator
            this.lengthFormat = options.lengthFormat

            if (!canBeEmpty) this.verification.push(FormControl.cantBeBlank(this))
            if (alphaOnly) this.verification.push(FormControl.containAlphaOnly(this,canBeEmpty))
            if (numOnly) {
                this.verification.push(FormControl.containNumOnly(this, options.quantifNumOnly, canBeEmpty))
                if (options.minAndMax) this.verification.push(FormControl.checkMinAndMax(this, options.minAndMax))
            }
        }

        validate() {
            let valid= true
            for (const verif of this.verification){
                const currentIsValid= verif()
                valid= valid && currentIsValid
                if(!valid) return false
            }
            return true
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

    const d= new Date()
    const monthAndYear= [d.getMonth() + 1, d.getFullYear().toString().slice(2)];
    const dateOption= {
        quantifNumOnly: '{2}', 
        lengthFormat: 2, 
        separator: '/', 
        minAndMax: [
            { min: '01', max: '12'}
        ]
    }

    const elements = {
        name: new FormControl(['Jane Appleseed'],'cardHolderName', 'name', false, true, false),
        number: new FormControl(['0000000000000000'],'cardNumber', 'id', false, false, true, {quantifNumOnly: '{16}', lengthFormat: 4, separator: ' '}),
        date: new FormControl(monthAndYear, 'monthAndYear', 'dateExpShow', false, false, true, dateOption),
        cvc: new FormControl(['123'],'cvcForm', 'cvc', false, false, true, {quantifNumOnly: '{3}', lengthFormat: 3, separator: ''})
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