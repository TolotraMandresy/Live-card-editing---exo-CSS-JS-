function toggleSuccessMessage(){
    const container= document.getElementById('formAndMsg');
    container.classList.toggle('showMessage');
}

function editOnFront(){
    const frontCard= document.getElementById('cartPreview');
    console.log(window.getComputedStyle(frontCard));
    frontCard.style.transform= 'translate(calc(25px - var(--width)), 65px)'
}

// editOnFront();