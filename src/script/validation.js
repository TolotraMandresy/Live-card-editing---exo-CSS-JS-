const validation= (()=>{
    function validate(formControlId, regExp, msg){
        const inputs= document.querySelectorAll(`#${formControlId} input`)
        const errorMsgElement= document.querySelector(`#${formControlId} small`)
        let isValid= true

        for (let i=0; i<inputs.length; i++) {
            console.log(inputs[i].value);
            isValid= regExp.test(inputs[i].value) 
            const background= document.querySelector(`#${formControlId} .gradient:nth-of-type(${i+1})`)
            if(isValid){
                errorMsgElement.innerText= ""
                background.classList.remove('error')
            }
            else{
                errorMsgElement.innerText= msg
                background.classList.add('error')

                break
            }
        }
    }
    
    function containAlphaOnly(id){
        validate(id, /^[A-Za-z]+(?: [A-Za-z])*$/, 'Wrong format, alphabetic only')
    }
    
    function containNumOnly(id, quantificateur= '+'){
        const regExp= new RegExp(`\\d${quantificateur}`)
        validate(id, regExp, 'Wrong format, number only')
    }

    // function capitalize()

    const elements= {
        name: 'cardHolderName',
        number: 'cardNumber',
        date: 'monthAndYear',
        cvc: 'cvcForm'
    }

    containAlphaOnly(elements.name)
})()