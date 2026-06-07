// dark/light mode switch function
function dlSwitch(){
    document.body.classList.toggle("dark-mode");
    console.log("switching dark/light mode:");
    console.log("   ",document.body.classList);
}

// default is light scheme - switch to dark at start if dark
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    dlSwitch();
} else {
    console.log("staying in light mode");
}

// if the user switches off the dark scheme then return to light and vice versa
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', dlSwitch());