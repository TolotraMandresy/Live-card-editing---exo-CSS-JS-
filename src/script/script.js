const  cardsAnimation= (function (){
    const cardsContainer= document.getElementById('cartsContainer');
    const transitionDuration= {
        lateral: parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--lateral-transition-duration')),
        vertical: parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--vertical-transition-duration'))
    };
    let cardsReversed= false;
    
    const transitions= [ 
        async () =>  {
            //move cards laterally
            await delay(()=>{
                cardsContainer.classList.toggle('moveLaterally');
            }, transitionDuration.lateral);
        },
        async () =>  {
            //move cards vertically
            await delay(()=>{
                cardsContainer.classList.toggle('moveVertically');
            }, transitionDuration.vertical);
        },
        async () =>  {
            await delay(()=>{
                cardsContainer.classList.toggle('revertCards');
            }, transitionDuration.lateral);
        }
    ]

    function delay(todo, delayTime){
        return new Promise(( resolve )=>{
            todo()
            setTimeout(resolve, delayTime);
        })
    }

    const animate= async function(reverse= false){
        if(cardsReversed != reverse){
            const currentTransition= (cardsReversed) ? [...transitions].reverse() : transitions;
            for(let t of currentTransition){
                await t();
            }
            cardsReversed= !cardsReversed; 
        }

    }

    return { transitions, animate }
})()

function toggleSuccessMessage(){
    const  container= document.getElementById('formAndMsg');
    container.classList.toggle('showMessage');
}